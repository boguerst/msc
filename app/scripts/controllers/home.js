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

    function groupBy(tableauObjets, prop1, prop2){
      if(!tableauObjets) {
        return {};
      }
      return tableauObjets.reduce(function (acc, obj) {
        var cle = obj[prop1];
        if(!acc[cle]){
          acc[cle] = [];
        }
        acc[cle].push(prop2 ? obj[prop2] : obj);
        return acc;
      }, {});
    }

    $scope.guests = [];
    let guestsRemoved = [];
//    $scope.guests_ = angular.copy($scope.guests);
    ServiceAjax.guests().all(_evtId).then(function(data) {
      let guests = data.data;
      guests.forEach(function(guest) {
        guest.key = guest.firstName + ' ' + guest.name;
        guest.selected = false;
      });
      $scope.guests = guests;

      let guestsMapTable = groupBy(guests, 'table');
      ServiceAjax.tables().getByEvent(_evtId).then(function(data) {
        let tables = data.data;
        let guestsOnTable = [];
        tables.forEach(function(table) {
          table.guests = guestsMapTable ? groupBy(guestsMapTable[table.key], 'seat', 'key') : {};
          if(Object.keys(table.guests).length>0) {
            guestsOnTable = guestsOnTable.concat(guestsMapTable[table.key]);
          }
        });
        $scope.map.tables = tables.concat(guestsOnTable);

        let guests_ = angular.copy($scope.guests);
        guestsOnTable.forEach(function(guest1) {
          guests_ = guests_.filter(function(guest2) {
            return guest2._id != guest1._id;
          });
        });
        $scope.map.guests = guests_;
      }, function(data) {
          console.log('Error: ' + data);
      });
    }, function(data) {
        console.log('Error: ' + data);
    });

    function updateGuests() {
      let guestsMap = groupBy($scope.guests, '_id');

      let tables = angular.copy($scope.map.tables);
      tables.forEach(function(item) {
        if(!item.hasOwnProperty('guests')) { //item is a guest
          if(guestsMap[item._id]) {
            guestsMap[item._id] = item;
          } else {
            tables.splice(tables.indexOf(item), 1);
          }
        }
      });
      $scope.map.tables = tables; //force the change on Angular

      let guests = angular.copy($scope.map.guests);
      guests.forEach(function(item) {
        if(guestsMap[item._id]) {
          guestsMap[item._id] = item;
        } else {
          guests.splice(guests.indexOf(item), 1);
        }
      });
      $scope.map.guests = guests; //force the change on Angular
    }

    function setMap() {
      $('ul.navbar-nav li a[href^="#_"]').click(function(e) {
          e.preventDefault();
          //update the guest list
          updateGuests();
          $(this).tab('show');
      });
      $('a[href="#_map"]').tab('show');

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
            $scope.guests.push(newGuest);
        },
        function (msg) {//$uibModalInstance.dismiss
          console.log(msg);
        }
      );
    };

    $scope.deleteGuest = function(guest) {
    	 $scope.guests.splice($scope.guests.indexOf(guest), 1);
    	 guestsRemoved.push(guest);
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
      var previousTables = angular.copy($scope.map.tables);
      tableStd.key = $scope.map.tables.length+1+'';
      tableStd.category = 'Table'+tableId;
      tableStd.name = tableStd.key + '';
      tableStd.loc = (locX + 2*tableStd.key) + ' ' + (locY + 2*tableStd.key);
      // tableStd.loc = previousTables[previousTables.length-1].loc;
      previousTables.push(angular.copy(tableStd)); // Force the update on the diagram
      $scope.map.tables = previousTables;
    };

    var triggerTime = 0;
    $scope.triggerPosition = function() {
    	var model = $scope.model;
    	var data = model.findNodeDataForKey($scope.guests[0].key);
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

    function saveGuest(guest, toRemove) {
      if(toRemove) {
        ServiceAjax.guests().delete(guest._id).then(function(data) {
          console.log(data);
        }, function(data) {
            console.log('Error: ' + data);
        });
      } else {
        ServiceAjax.guests().set(guest).then(function(data) {
          console.log(data);
        }, function(data) {
            console.log('Error: ' + data);
        });
      }
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
          $scope.map.tables[idx]._id = data.data._id;
        }, function(data) {
          console.log('Error: ' + data);
        });
      }
    }

    $scope.saveMap = function() {
      updateGuests();

      $scope.map.tables.forEach(function(item, idx, tables) {
        if(item.hasOwnProperty('guests')) { //it is a table
          saveTable(item, idx);
        } else {
          saveGuest(item);
        }

        if(idx === tables.length-1) {
          console.log('saved');
        }
      });

      $scope.map.guests.forEach(function(guest) {
        saveGuest(guest);
      });

      guestsRemoved.forEach(function(guest) {
        saveGuest(guest, true);
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

    $scope.guestList = new go.GraphLinksModel($scope.map.guests);

    $scope.model = new go.GraphLinksModel($scope.map.tables);
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
