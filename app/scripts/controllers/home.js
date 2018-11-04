'use strict';

/**
 * @ngdoc function
 * @name mscApp.controller:HomeCtrl
 * @description
 * # HomeCtrl
 * Controller of the mscApp
 */
angular.module('mscApp')
  .controller('HomeCtrl', function ($rootScope, $scope, FLOW_STEPS, ServiceAjax, $location, Session, $routeParams, $uibModal) {
  	$scope.setStep(FLOW_STEPS.main);
    $scope.setCurrentUser();

    // var _evtId = $routeParams.evtId;
    var _evtId = Session.eventId();
    if(!_evtId) {
    	$location.path('/myspace');
        return;
    }
	  $scope.evtName = Session.eventName();
    $scope.isPlanView = true;

    $scope.titles = [
    	{'_id':1, 'label':'Monsieur'},
    	{'_id':2, 'label':'Madame'}
    ];

    $scope.map = {'guests': [], 'tables': []};

    $scope.guests = [];
    $scope.guestsOrigin = angular.copy($scope.guests);
    ServiceAjax.guests().all(_evtId).then(function(data) {
        var guests = data.data;
        guests.forEach(function(guest) {
        	guest.key = guest.firstName + ' ' + guest.name;
        	guest.selected = false;
        });
        $scope.guests = guests;
        $scope.guestsOrigin = angular.copy($scope.guests);

        $scope.map.guests = guests;
    }, function(data) {
        console.log('Error: ' + data);
    });

    $scope.tables = [];
    ServiceAjax.tables().getByEvent(_evtId).then(function(data) {
        var tables = data.data;
        tables.forEach(function(table) {
        	table.guests = {};
        });
        $scope.tables = tables;

        $scope.map.tables = tables;
    }, function(data) {
        console.log('Error: ' + data);
    });

    function setMap() {
      $('#myTabs a').click(function (e) {
        e.preventDefault();
        $(this).tab('show');
        $scope.isPlanView = $('.nav-tabs .active').text() === 'Orga Salle';
        $scope.$apply();

        // currentTab = e.target.hash;
      });

      $('a[href="#map"]').tab('show');

      // trigger the selection on the dropdow "Add table"
      $('.dropdown-submenu a').on('click', function(e) {
          $(this).next('ul').toggle();
          e.stopPropagation();
          e.preventDefault();
      });
    }
    setMap();

    /* ******* methods ******** */

    /* ******* guest ******** */

    // add a new guest
    $scope.addGuest = function() {
	    var modalInstance = $uibModal.open({
        templateUrl: '../../views/newGuestPopup.html',
        controller: 'newGuestPopupCtrl',
        resolve: {
          parameters: function () {
            return {titles: $scope.titles, guestList: $scope.guests, eventId: _evtId};
          }
        }
      });

      modalInstance.result.then(
        function (newGuest) { //$uibModalInstance.close
            console.log(newGuest);
            $scope.guestList.addNodeData(newGuest);
            $scope.guestsOrigin.push(newGuest);
        },
        function (msg) {//$uibModalInstance.dismiss
          console.log(msg);
        }
      );
    };

    $scope.deleteGuest = function(guest) {
    	// $scope.guests.splice($scope.guests.indexOf(guest),1);
    	// $scope.guestList.removeNodeData(guest._id);

    	$scope.map.guests = $scope.map.guests.slice($scope.guests.indexOf(guest));
    	// $scope.$apply();

    	/*ServiceAjax.guests().delete(guest._id).then(function() {
            $scope.guests.splice($scope.guests.indexOf(guest),1);
        }, function(data) {
            console.log('Error: ' + data);
        });*/
    };

    $scope.selectedGuests = [];
    $scope.isSelectedAllGuests = false;
    $scope.toggleAllGuests = function(isSelectedAllGuests) {
    	$scope.guests.forEach(function(guest) {
			guest.selected = isSelectedAllGuests;
    	});

    	$scope.isSelectedAllGuests = isSelectedAllGuests;
    };

	  /* ******* table ******** */

    var locX = 364.5, locY = 223.5;
    var tableStd = {'guests':{}, 'evtId': _evtId};
    $scope.addTable = function(tableId) {
      var previousTables = angular.copy($scope.tables);
      tableStd.key = $scope.tables.length+1+'';
      tableStd.category = 'Table'+tableId;
      tableStd.name = tableStd.key + '';
      tableStd.loc = (locX + 2*tableStd.key) + ' ' + (locY + 2*tableStd.key);
      // tableStd.loc = previousTables[previousTables.length-1].loc;
      previousTables.push(angular.copy(tableStd));
      $scope.tables = previousTables;
      $scope.map.tables = $scope.tables;
    };

    var triggerTime = 0;
    $scope.triggerPosition = function() {
    	var model = $scope.model;
    	var data = model.findNodeDataForKey($scope.guestsOrigin[0].key);
    	if(!data) {
    		model = $scope.guestList;
        data = model.findNodeDataForKey($scope.guests[0].key);
        if(!data) {
          return;
        }
    	}

    	triggerTime++;
      if(triggerTime === 10) {
        triggerTime = 0;
        return;
      }

    	setTimeout(function(){ model.setDataProperty(data, 'fill', 'green'); }, 100);
    	setTimeout(function(){ model.setDataProperty(data, 'fill', 'blanchedalmond'); }, 200);
    	setTimeout($scope.triggerPosition, 200);
    };

    function saveGuest(guest) {
    	ServiceAjax.guests().set(guest).then(function(data) {
			  console.log(data);
      }, function(data) {
          console.log('Error: ' + data);
      });
    }

    function saveTable(table, idx) {
      if(table._id) {
        ServiceAjax.tables().set(table).then(function(data) {
          console.log(data);
        }, function(data) {
            console.log('Error: ' + data);
        });
      } else {
        ServiceAjax.tables().create(table).then(function(data) {
          console.log(data);
          $scope.tables[idx]._id = data.data._id;
        }, function(data) {
            console.log('Error: ' + data);
        });
      }
    }

    $scope.saveMap = function() {
    	console.log('save me');
      $scope.tables.forEach(function(item, idx, tables) {
        if(item.hasOwnProperty('guests')) {
          saveTable(item, idx);
        } else {
          saveGuest(item);
        }

        if(idx === tables.length-1) {
          console.log('saved');
        }
      });
    };

    $scope.isFullScreen = false;
    $scope.goFullScreen = function(elt) {
      $scope.isFullScreen = true;
      elt = elt || document.getElementById('myFlexDiv');
        if (elt.mozRequestFullScreen) {
        elt.mozRequestFullScreen();
        } else if (elt.webkitRequestFullScreen) {
        elt.webkitRequestFullScreen();
        }
        $scope.displayMode = 'DMBack';
      $scope.isFullScreen = false;
    };

    /* ******* watches ******** */

    $scope.$watch('map.guests', function(new_, old_) {
      if (new_ !== old_) {
        $scope.guestList = new go.GraphLinksModel(new_);
      }
    });

    $scope.$watch('map.tables', function(new_, old_) {
      if (new_ !== old_) {
        $scope.model = new go.GraphLinksModel(new_);
      }
    });

      /* ******* godiagram.js  ********* */

    $scope.guestList = new go.GraphLinksModel($scope.guests);

    $scope.model = new go.GraphLinksModel($scope.tables);
    $scope.model.selectedNodeData = null;
    $scope.replaceModel = function() {
      $scope.model = new go.GraphLinksModel(
        [
          { key: 11, name: 'zeta', color: 'red' },
          { key: 12, name: 'eta', color: 'green' }
        ],
        [
          { from: 11, to: 12 }
        ]
      );
    };
});
