'use strict';

angular.module('mscApp')
.service('Session', function ($window) {
  this.create = function (sessionId, userId, userRole, userFirstName) {
    /*this.id = sessionId;
    this.userId = userId;
    this.userRole = userRole;*/

    $window.sessionStorage.setItem('userId', userId);
    $window.sessionStorage.setItem('role', userRole);
    $window.sessionStorage.setItem('firstName', userFirstName);
  };
  this.destroy = function () {
    $window.sessionStorage.clear();
  };
  this.userId = function() {
    return $window.sessionStorage.getItem('userId');
  };
  this.role = function() {
    return $window.sessionStorage.getItem('role');
  };
  this.firstName = function() {
    return $window.sessionStorage.getItem('firstName');
  };
  this.setEventId = function(evtId) {
    $window.sessionStorage.setItem('eventId', evtId);
  };
  this.eventId = function() {
    return $window.sessionStorage.getItem('eventId');
  };
  this.setEventName = function(evtName) {
    $window.sessionStorage.setItem('eventName', evtName);
  };
  this.eventName = function() {
    return $window.sessionStorage.getItem('eventName');
  };
  this.setStep = function(step) {
    $window.sessionStorage.setItem('step', step);
  };
  this.step = function() {
    return $window.sessionStorage.getItem('step');
  };
});
