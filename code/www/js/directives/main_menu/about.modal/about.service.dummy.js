(function () {
  'use strict;'

  angular
    .module('gaddum.main_ui')
    .factory('aboutService', aboutService)
    ;

  aboutService.$inject = [
    
  ];
  function aboutService(
    
  ) {

   
      function appVersion(){
          return "0.0.1Dummy"
      }
      function componentsLicenses(){
          return "we got these things called licenses?"
      }
      function projectPersonnel(){
          return "Kei Gibbings, J.T, D.M, L.C"
      }
      function gaddumLink(){
          return "gaddum Link Here"
      }
    var service = {
        appVersion:appVersion,
        componentsLicenses:componentsLicenses,
        projectPersonnel:projectPersonnel,
        gaddumLink:gaddumLink
    };

    return service;
  }
})();
