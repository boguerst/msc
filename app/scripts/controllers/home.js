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
  	Session.setStep(FLOW_STEPS.main);
    $scope.setCurrentUser();

    let evtId = Session.eventId();
    if(!evtId) {
    	$location.path('/myspace');
      return;
    }
	  $scope.event = {};
	  ServiceAjax.events().get(evtId).then(function(data) {
      $scope.event = data.data;
      ServiceAjax.rooms().get($scope.event.where).then(function(data) {
        $scope.event.where = data.data.address;
      }, function(data) {
        console.log('Error: ' + data);
      });
      ServiceAjax.users().get($scope.event.owner).then(function(data) {
        $scope.event.owner = data.data.lastName + ' ' + data.data.firstName;
      }, function(data) {
        console.log('Error: ' + data);
      });
    });

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
    ServiceAjax.guests().all(evtId).then(function(data) {
      let guests = data.data;
      guests.forEach(function(guest) {
        guest.key = guest.firstName + ' ' + guest.name;
        guest.selected = false;
      });
      $scope.guests = guests;

      let guestsMapTable = groupBy(guests, 'table');
      ServiceAjax.tables().getByEvent(evtId).then(function(data) {
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
            return guest2._id !== guest1._id;
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
    let file;
    $(function() {
      // We can attach the `fileselect` event to all file inputs on the page
      $(document).on('change', ':file', function() {
        var input = $(this),
            numFiles = input.get(0).files ? input.get(0).files.length : 1,
            label = input.val().replace(/\\/g, '/').replace(/.*\//, '');
        input.trigger('fileselect', [numFiles, label]);
        file = input.get(0).files[0];
      });

      // We can watch for our custom `fileselect` event like this
      $(document).ready( function() {
        $(':file').on('fileselect', function(event, numFiles, label) {
            let input = $(this).parents('.input-group').find(':text');
            let log = numFiles > 1 ? numFiles + ' files selected' : label;
            if(input.length) {
              input.val(log);
            } else {
              if(log) {
                this.alert(log);
              }
            }
        });
      });
    });
    $scope.import = function() {
      if(file) {
        let reader = new FileReader();
        reader.readAsArrayBuffer(file);
        reader.onload = function() {
//          let data = new Uint8Array(reader.result);
//          var wb = XLSX.read(data, {type: 'array'});
//
//          var htmlstr = XLSX.write(wb, {sheet: 'sheet', type:'binary', bookType: 'html'});
//          $('#wrapper')[0].innerHTML += htmlstr;
          $('#importModal').modal('hide');
        };
        reader.onerror = function() {
          this.alert('Fichier non supporté');
        };
        reader.onabort = function() {
          this.alert('Fichier non supporté');
        };
      }
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
      maxDate: new Date(2025, 5, 22),
//      minDate: new Date(),
      startingDay: 1
    };

    $scope.popup = { opened: false };
    $scope.open = function() {
      $scope.popup.opened = true;
    };

    /* ******* guest ******** */
    $scope.addGuest = function() {
	    let modalInstance = $uibModal.open({
        templateUrl: '../../views/newGuestPopup.html',
        controller: 'newGuestPopupCtrl',
        resolve: {
          parameters: function () {
            return {titles: $scope.titles, guestList: $scope.guests, eventId: evtId};
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

    $scope.selectedGuests = [];
    $scope.isSelectedAllGuests = false;
    $scope.toggleAllGuests = function(isSelectedAllGuests) {
    	$scope.guests.forEach(function(guest) {
			guest.selected = isSelectedAllGuests;
    	});

    	$scope.isSelectedAllGuests = isSelectedAllGuests;
    };

	  /* ******* table ******** */
    let locX = 364.5, locY = 223.5;
    let tableStd = {'guests':{}, 'evtId': evtId};
    $scope.addTable = function(tableId) {
      let previousTables = angular.copy($scope.map.tables);
      tableStd.key = $scope.map.tables.length+1+'';
      tableStd.category = 'Table'+tableId;
      tableStd.name = tableStd.key + '';
      tableStd.loc = (locX + 2*tableStd.key) + ' ' + (locY + 2*tableStd.key);
      // tableStd.loc = previousTables[previousTables.length-1].loc;
      previousTables.push(angular.copy(tableStd)); // Force the update on the diagram
      $scope.map.tables = previousTables;
    };

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

    let triggerTime = 0;
    $scope.triggerPosition = function() {
    	let model = $scope.model;
    	let data = model.findNodeDataForKey($scope.guests[0].key);
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

    $('#myHomeTabs a').click(function (e) {
      e.preventDefault();
      $(this).tab('show');
//      $scope.isPlanView = $('.nav-tabs .active').text() === "Orga Salle";
      $scope.$apply();
    });

    /* ******* screen ******** */
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
