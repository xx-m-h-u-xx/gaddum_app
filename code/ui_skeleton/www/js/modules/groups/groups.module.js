(function() {
  'use strict';

  angular
    .module('groups', [
      'ui.router',
      'ngAnimate',
    ])
    .config(function($stateProvider, $urlRouterProvider) {
      $stateProvider
        .state('groupsList', {
          cache: false,
          url: '/main/groups'
        });
    });
})();
