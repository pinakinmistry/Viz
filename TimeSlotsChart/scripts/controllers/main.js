'use strict';
angular.module('app.controllers')
  .controller('MainCtrl', function ($scope, Settings) {
    $scope.settings = Settings.get();
});

