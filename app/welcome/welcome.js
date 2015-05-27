'use strict';

angular.module('myApp.welcome', ['ngRoute','ngAnimate','ui.bootstrap'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/welcome', {
    templateUrl: 'welcome/welcome.html',
    controller: 'WelcomeCtrl'
  });
}])


.controller('WelcomeCtrl', ['$scope','$firebase','CommonProp', function($scope,$firebase,CommonProp) {
	$scope.username = CommonProp.getUser();
	var firebaseObj = new Firebase("https://yyear.firebaseio.com/Articles");
  var sync = $firebase(firebaseObj);
  $scope.articles = sync.$asArray();

  $scope.editPost = function(id) {
    var firebaseObj = new Firebase("https://yyear.firebaseio.com/Articles/" + id);
    var syn = $firebase(firebaseObj);
    $scope.postToUpdate = syn.$asObject();
    $('#editModal').modal();      // triggers the modal pop up
  };



  $scope.update = function() {
    var fb = new Firebase("https://yyear.firebaseio.com/Articles/" + $scope.postToUpdate.$id);
    var article = $firebase(fb);
    article.$update({
      title: $scope.postToUpdate.title,
      privacyLevel: $scope.postToUpdate.privacyLevel,
      post: $scope.postToUpdate.post,
      emailId: $scope.postToUpdate.emailId
    }).then(function(ref) {
      $('#editModal').modal('hide');
    }, function(error) {
      console.log("Error:", error);
    });
  };

  $scope.confirmDelete = function(id) {
    var fb = new Firebase("https://yyear.firebaseio.com/Articles/" + id);
    var article = $firebase(fb);
    $scope.postToDelete = article.$asObject();
    $('#deleteModal').modal();
  };

  $scope.deletePost = function() {
    var fb = new Firebase("https://yyear.firebaseio.com/Articles/" + $scope.postToDelete.$id);
    var article = $firebase(fb);
    article.$remove().then(function(ref) {
      $('#deleteModal').modal('hide');
    }, function(error) {
      console.log("Error:", error);
    });
  };

  $scope.AddPost = function(){
    console.log("This was called.");

    var title = $scope.article.title;
    var privacyLevel = $scope.article.privacyLevel;
    var post = $scope.article.post;

    var firebaseObj = new Firebase("https://yyear.firebaseio.com/Articles");
    var fb = $firebase(firebaseObj);

    fb.$push({ title: title, privacyLevel: privacyLevel, post: post,emailId: CommonProp.getUser() }).then(function(ref) {
      console.log(ref); 
    //$location.path('/welcome');
  }).then(function(ref) {
    $scope.article = null 
    $('#createModal').modal('hide');
  }, function(error) {
    console.log("Error:", error);
  });
};

}])
.controller('AppCtrl', function ($modal) {
        var app = this;

        app.closeAlert = function () {
            app.reason = null;
        };

        app.open = function () {
            var modalInstance = $modal.open({
                templateUrl: 'partials/wizard.html',
                controller: 'ModalCtrl',
                controllerAs: 'modal'
            });

            modalInstance.result
                .then(function (data) {
                    app.closeAlert();
                    app.summary = data;
                }, function (reason) {
                    app.reason = reason;
                });
        };
    })
    .controller('ModalCtrl', function ($modalInstance) {
        var modal = this;

        modal.steps = ['one', 'two', 'three'];
        modal.step = 0;
        modal.wizard = {tacos: 2};

        modal.isFirstStep = function () {
            return modal.step === 0;
        };

        modal.isLastStep = function () {
            return modal.step === (modal.steps.length - 1);
        };

        modal.isCurrentStep = function (step) {
            return modal.step === step;
        };

        modal.setCurrentStep = function (step) {
            modal.step = step;
        };

        modal.getCurrentStep = function () {
            return modal.steps[modal.step];
        };

        modal.getNextLabel = function () {
            return (modal.isLastStep()) ? 'Submit' : 'Next';
        };

        modal.handlePrevious = function () {
            modal.step -= (modal.isFirstStep()) ? 0 : 1;
        };

        modal.handleNext = function () {
            if (modal.isLastStep()) {
                $modalInstance.close(modal.wizard);
            } else {
                modal.step += 1;
            }
        };

        modal.dismiss = function(reason) {
            $modalInstance.dismiss(reason);
        };
    });





