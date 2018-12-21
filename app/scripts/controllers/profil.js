'use strict';

/**
 * @ngdoc function
 * @name mscApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the mscApp
 */
angular.module('mscApp')
.controller('ProfilCtrl', function ($rootScope, $scope, $location, ServiceAjax, Session, FLOW_STEPS) {
	$scope.isUpdate = false;
//	Session.setStep(FLOW_STEPS.profil);

  ServiceAjax.users().get(Session.userId()).then(function(data) {
    $scope.user = data.data;
  }, function(data) {
    console.log('Error: ' + data.data);
  });

	$scope.submitModification = function(user) {
		ServiceAjax.users().update(user)
			.then(function(data) {
				$scope.isUpdate = false;
				$rootScope.loggedUser = data.data;
				$location.path('/profil');
			}, function(data) {
				console.log('Error: ' + data.data);
			});
	};
});
