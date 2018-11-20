'use strict';

/**
 * @ngdoc function
 * @name mscApp.controller:aboutusCtrl
 * @description
 * # aboutusCtrl
 * Controller of the mscApp
 */
angular.module('mscApp')
  .controller('aboutusCtrl', function () {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    /*------------------------------------------
        = GOOGLE MAP
    -------------------------------------------*/
    function map() {
      var locations = [
          ['Club PAD de Bonanjo',  4.029837 , 9.687983,1],
          ['Cathédrale Saint Pierre et Paul', 4.044632, 9.692685,2],
          ['Espace Perenco(En face Palais de justice)', 4.043685, 9.687057,3],
      ];

      var map = new google.maps.Map(document.getElementById('map'), {
        center: new google.maps.LatLng( 4.074742, 9.673119),
        zoom: 12,
        scrollwheel: false,
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
          }
        })(marker, i));
      }
    };
    if ($(".map").length) {
      map();
    }
  });
