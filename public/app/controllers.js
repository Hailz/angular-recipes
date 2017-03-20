angular.module('RecipeCtrls', ['RecipeServices'])
.controller('HomeCtrl', ['$scope', 'Recipe', function($scope, Recipe) {
  $scope.recipes = [];

  Recipe.query(function success(data) {
    $scope.recipes = data;
  }, function error(data) {
    console.log(data);
  });

  $scope.deleteRecipe = function(id, recipesIdx) {
    Recipe.delete({ id: id }, function success(data) {
      $scope.recipes.splice(recipesIdx, 1);
    }, function error(data) {
      console.log(data);
    });
  };
}])
.controller('ShowCtrl', ['$scope', '$stateParams', 'Recipe', function($scope, $stateParams, Recipe) {
  $scope.recipe = {};

  Recipe.get({ id: $stateParams.id }, function success(data) {
    $scope.recipe = data;
  }, function error(data) {
    console.log(data);
  });
}])
.controller('NewCtrl', ['$scope', '$location', 'Recipe', function($scope, $location, Recipe) {
  $scope.recipe = {
    title: '',
    description: '',
    image: ''
  };

  $scope.createRecipe = function() {
    Recipe.save($scope.recipe, function success(data) {
      $location.path('/');
    }, function error(data) {
      console.log(data);
    });
  };
}])
.controller('NavCtrl', ['$scope', "$state", "Auth", "Alerts", function($scope, $state, Auth, Alerts) {
  $scope.isLoggedIn = Auth.isLoggedIn();
  $scope.logout = function() {
    console.log("Before logout " + Auth.getToken());
    Auth.removeToken();
    console.log("After logout" + Auth.getToken());
    Alerts.add("success", "You are now logged out!");
    $state.go("home");
    Alerts.clear();
  };
}])
.controller('SignupCtrl', ['$scope', "$http", "$state", "Alerts", function($scope, $http, $state, Alerts) {
  $scope.user = {
    email: '',
    password: ''
  };
  $scope.userSignup = function() {
    $http.post('/api/users', $scope.user).then(function success(res){
      console.log("Signed up! " + res);
      Alerts.add("success", "You are now signed up!");
      $state.go("home");
    }, function error(res){
      console.log("Failed " + res);
      Alerts.add("error", "Sign up failed.");
      Alerts.clear();
    })
  };
}])
.controller('LoginCtrl', ['$scope', "$http", "$state", "Auth", "Alerts", function($scope, $http, $state, Auth, Alerts) { //$state.go and $location same. $state uses name of view
  $scope.user = {
    email: '',
    password: ''
  };
  $scope.userLogin = function() {
    $http.post("/api/auth", $scope.user).then(function success(res){
      console.log("Logging " + res);
      Auth.saveToken(res.data.token);
      Alerts.add("success", "You are now logged in! " + res.data.user.email);
      Alerts.clear();
      $state.go("home");
    }, function errer(res){
      console.log("Faaaaaail " + res);
      Alerts.add("error", "Log in failed.");
      Alerts.clear();
    })
  };
}])
.controller("AlertsCtrl", ['$scope', 'Alerts', function($scope, Alerts){
  $scope.alerts= Alerts.get();
}]);
