'use strict';

/**
 * @ngdoc function
 * @name mscApp.controller:MyspaceCtrl
 * @description
 * # MyspaceCtrl
 * Controller of the mscApp
 */
angular.module('mscApp')
  .controller('MyspaceCtrl', function ($scope, USER_ROLES, FLOW_STEPS, ServiceAjax, $location, $uibModal, Session) {
    Session.setStep(FLOW_STEPS.myspace);
    $scope.setCurrentUser();

    $scope.events = [];
    $scope.EVENTSTATES = {
      ALL: 1,
      INPROGRESS: 2,
      DONE: 3
    };
    $scope.eventState = $scope.EVENTSTATES.ALL;

    $scope.newEvent = {};
    $scope.newEvent.startDate = new Date();
    ServiceAjax.rooms().all().then(function(data) {
      $scope.rooms = data.data;
      $scope.newEvent.where = $scope.rooms[0]._id;
    }, function(data) {
      console.log('Error: ' + data);
    });

    if($scope.currentUser.role === USER_ROLES.owner) {
      ServiceAjax.events().getBy($scope.currentUser._id).then(function(data) {
        $scope.events = data.data;
      });
    } else {
      ServiceAjax.events().getByOnwer($scope.currentUser._id).then(function(data) {
        $scope.events = data.data;

    $scope.$$postDigest(function(){
//      console.log('postDigest', jQuery('strong').text());
      map();
    });
      });
    }

    $scope.createEvent = function(event) {
      event.by = $scope.currentUser._id;
      ServiceAjax.events().create(event).then(function(data) {
        event = data.data;

        var mail = {};
        mail.contactEmail = event.bookerEmail;
        mail.contactMsg = event._id;
        mail.contactSubject = $scope.currentUser.firstName;

        ServiceAjax.contacts().sendMail(mail).then(function(){
          console.log('Sending done');

          if(event){
            var modalInstance = $uibModal.open({
              templateUrl: '../../views/infoPopup.html',
              controller: 'infoPopupCtrl',
              resolve: {
                event: function () {
                  return event;
                }
              }
            });

            modalInstance.result.then(
              function () { //$uibModalInstance.close
                console.log($scope.newEvent);
                $scope.newEvent = {};
                $scope.newEvent.startDate = new Date().toISOString().slice(0,10);
              },
              function () {//$uibModalInstance.dismiss
              }
            );
          }
        });

        ServiceAjax.rooms().get(event.where).then(function(data) {
          event.where = data.data.name;
          $scope.events.push(event);
        }, function(data) {
          console.log('Error: ' + data);
        });
      }, function(data) {
        console.log('Error: ' + data);
      });
    };

    $scope.addEvent = function(event) {
      event.owner = $scope.currentUser._id;
      ServiceAjax.events().set(event).then(function(data) {
        event = data.data;
        if($scope.events.findIndex(function(evt) { return evt._id === event._id; }) === -1) {
          ServiceAjax.rooms().get(event.where).then(function(data) {
            event.where = data.data.name;
            $scope.events.push(event);
          }, function(data) {
            console.log('Error: ' + data);
          });
        }
      });
    };

    $scope.goToRoom = function(event) {
      /*if($scope.isRoomManager) {
          return;
      }*/
      Session.setEventId(event._id);
      Session.setEventName(event.name);
      $location.path('/home');
    };

    /*****************/

    $('#myTabs a').click(function (e) {
      e.preventDefault();
      $(this).tab('show');
      $scope.$apply();
    });

    function map() {
      var locations = [
          ['Club PAD de Bonanjo',  4.029837 , 9.687983,1],
          ['Cathédrale Saint Pierre et Paul', 4.044632, 9.692685,2],
          ['Espace Perenco(En face Palais de justice)', 4.043685, 9.687057,3],
      ];

      var map = new google.maps.Map(document.getElementById('map500'), {
        center: new google.maps.LatLng( 4.074742, 9.673119),
        zoom: 10,
        scrollwheel: true,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      });

      var infowindow = new google.maps.InfoWindow();

      var marker, i;

      for (i = 0; i < locations.length; i++) {
        marker = new google.maps.Marker({
          position: new google.maps.LatLng(locations[i][1], locations[i][2]),
          map: map,
          icon:'../../images/map-marker.png'
        });

        google.maps.event.addListener(marker, 'click', (function(marker, i) {
          return function() {
            infowindow.setContent(locations[i][0]);
            infowindow.open(map, marker);
          };
        })(marker, i));
      }
    };
    /*$scope.$on('viewContentLoaded', function(){
      if ($(".map").length) {
        map();
      }
    });*/

    /*var try_ = function() {
      if (!$("#map500").length) {
        window.requestAnimationFrame(try_);
      }else {
//        $("#element").do_some_stuff();
        map();
       }
    };
    try_();

    /*****************/

    // configuration datePicker
    $scope.event = { startDate : null };
    $scope.today = function() {
      $scope.event.startDate = new Date();
    };
    $scope.today();

    $scope.clear = function() {
      $scope.event.startDate = null;
    };

    // Disable weekend selection
    function disabled() {
      // var date = data.date,
      // mode = data.mode;
      // return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
    }

    $scope.dateOptions = {
      dateDisabled: disabled,
      formatYear: 'yy',
      maxDate: new Date(2020, 5, 22),
      minDate: new Date(),
      startingDay: 1
    };

    $scope.popup = { opened: false };
    $scope.open = function() {
      $scope.popup.opened = true;
    };

    /*****************/

    $scope.sendMail = function(){
      ServiceAjax.contacts().sendMail().then(function(){
        console.log('Sending done');
      });
    };
});
