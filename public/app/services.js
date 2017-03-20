angular.module('RecipeServices', ['ngResource'])
.factory('Recipe', ['$resource', function($resource) {
  return $resource('/api/recipes/:id');
}])
.factory("Auth", ["$window", function($window){
  return {
    saveToken: function(token){
      // PUT/save token
      $window.localStorage["secretRecipesToken"] = token;
    },
    getToken: function(){
      // GET token
      return $window.localStorage["secretRecipesToken"];
    },
    removeToken: function(){
      // DESTROY token
      $window.localStorage.removeItem("secretRecipesToken");
    },
    isLoggedIn: function(){
      // shortcut get token
      var token = this.getToken();
      return token ? true : false;
    },
    currentUser: function(){
      // guickly get user info
      if(this.isLoggedIn()){
        var token = this.getToken();

        try{
          // vulnerable code
          var payload = JSON.parse($window.atob(token.split(".")[1]));
          console.log("Payload:", payload);
          return payload;
        }
        catch (err){
          // graceful error handling
          console.log("Uh oh" + err);
          return false;
        }
      }
      return false;
    }
  }
}])
.factory("AuthInterceptor", ["Auth", function(Auth){
  return {
    request: function(config){
      var token = Auth.getToken();
      if (token){
        config.headers.Authorization = "Bearer " + token;
      }
      return config;
    }
  }
}])
.factory("Alerts", [function(){
  var alerts = [];

  return{
    clear: function(){
      alerts = [];
    },
    add: function(type, msg){
      alerts.push({type:type, msg:msg});
    },
    get: function(){
      return alerts;
    },
    remove: function(index){
      alerts.splice(index, 1);
    }
  }
}])
