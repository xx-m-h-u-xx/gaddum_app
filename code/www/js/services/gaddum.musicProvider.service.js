// as per https://trello.com/c/tWfwgXbh/7-musicproviderservice
(function(){
  'use strict';

  angular
    .module('gaddum.streaming', [])
    .factory('gaddum.musicProvider.service', gaddumMusicProviderService);

  gaddumMusicProviderService.$inject = [
    '$http',
    '$injector',
  ];
  function gaddumMusicProviderService(
    $http,
    $injector
  ) {
    var service = {
      musicProvider: undefined,
      musicProviders: ["gaddumMusicProviderSpotifyService"],
      getSupportedServiceProviders: function getSupportedServiceProviders() {
        return( service.musicProviders );
      },
      setSupportedServiceProvider: function setSupportedServiceProvider( musicProviderName ){
        // dynamic injection: see http://next.plnkr.co/edit/iVblEU?p=preview&utm_source=legacy&utm_medium=worker&utm_campaign=next&preview, https://stackoverflow.com/questions/13724832/angularjs-runtime-dependency-injection
        for(var i in service.musicProviders ) {
          if( service.musicProviders.hasOwnProperty( i ) ) {
            service.musicProvider = $injector.get( musicProviderName );
            service.musicProvider.init();
          }
        }
      },
      login: function signIn(){
        service.musicProvider.signIn();
      },
      isLoggedIn: function isLoggedIn(){
      },
      logout: function logout(){

      },
      seekTracks: function seekTracks(x){
        // callbacks
      },
      setTracks: function setTracks(x){
        // callbacks
      },
      importAllPlaylists: function importAllPlaylists(x) {

      },
      getTrackInfo: function getTrackInfo(x) {

      },
      getSupportedGenres: function getSupportedGenres() {
        // promise
      },
      setGenres: function setGenres(x) {

      },
      getGenres: function getGenres(x) {

      } /*,

      state: {
        ready: false,
        playing: false
      },
      song: {
        title: "THIS IS A TITLE",
        artist: "THIS IS AN ARTIST"
      }*/
    };

    service.init = function init() {
      service.ready = true;
      service.playing = false;
    };

    service.init();

    return service;

  }

})();