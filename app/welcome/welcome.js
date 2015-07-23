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
      eventLoc: $scope.postToUpdate.eventLoc,
      eventDate: $scope.postToUpdate.eventDate,
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
    var eventLoc = $scope.article.eventLoc;
    var eventDate = $scope.article.eventDate;
    var post = $scope.article.post;

    var firebaseObj = new Firebase("https://yyear.firebaseio.com/Articles");
    var fb = $firebase(firebaseObj);

    fb.$push({ title: title, 
      privacyLevel: privacyLevel, 
      eventLoc: eventLoc, 
      eventDate: eventDate, 
      post: post,emailId: 
      CommonProp.getUser() }).then(function(ref) {
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

.controller('MapController', function($scope){
  google.maps.event.addDomListener(window, "load", function(){

    var geocoder = new google.maps.Geocoder();
     geocoder.geocode( { "address": $scope.article.eventLoc }, function(results, status) {
         if (status == google.maps.GeocoderStatus.OK && results.length > 0) {
             var location = results[0].geometry.location;
             $scope.myMap.panTo(location);
         }
    });

    var myLatLng = new google.maps.LatLng(43.7182412,-79.378058);
    var mapOptions = {
      center: myLatLng,
      zoom: 11,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    var map = new google.maps.Map(document.getElementById("map"), mapOptions);

    navigator.geolocation.getCurrentPosition(function(pos){
      map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
    });

    $scope.map = map;

  });

});





