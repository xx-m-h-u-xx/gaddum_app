(function () {
  'use strict';

  console.log("Gaddum Player Controller");


  angular
    .module('gaddum.player')
    .controller('gaddumPlayerController', gaddumPlayerController);

  gaddumPlayerController.$inject = [
    '$q',
    '$state',
    '$scope',
    '$rootScope',
    '$timeout',
    'playerService',
    'EventIdentifier',
    'TrackInfo',
    'GenericTrack'
  ];

  function gaddumPlayerController(
    $q,
    $state,
    $scope,
    $rootScope,
    $timeout,
    playerService,
    EventIdentifier,
    TrackInfo,
    GenericTrack
  ) {
    var gpc = {};
    gpc.state = {
      ready: false,
      show: false,
      hasTrack: false,
      busy: false,
      playing:false
    };
    gpc.marquee = {
      "scroller": "",
      "width":"0%",
      "track_skip_warning": true
    };
    gpc.cloud = {
      "show":false,
      "throbing":false
    }




    function onControlOK() {
      console.log("control OK.");
      
      // use this opportunity to put a busy spinner up, while we wait for an event
    }

    function onControlError(error) {
      console.log("control error. Track: " + error.message());
      gpc.state.playing = false;
    }

    function onTrackNew(trackInfo) {
      console.log("new track: " + trackInfo.getName());
      console.log(" - artist:" + trackInfo.getArtist());
      gpc.marquee.scroller = trackInfo.getName() +" • "+ trackInfo.getArtist() +" • "+ trackInfo.getAlbum() ;
      // gpc.marquee.artistname = trackInfo.getArtist();
      // gpc.marquee.albumName = trackInfo.getAlbum();
      gpc.state.hasTrack = true;
      gpc.state.playing = true;
      gpc.marquee.track_skip_warning = false;
    }



    function onTrackPaused(trackInfo) {
      console.log("track paused: " + trackInfo.getName());
      gpc.state.playing = false;
    }

    function onTrackEnd() {
      console.log("track ended.");
      gpc.state.hasTrack = false;
      gpc.marquee.width = "0%";
      gpc.state.playing = false;
      gpc.marquee.scroller="Waiting For Track"
    }


    function onTrackProgressPercent(progress) {
      //console.log("progress: "+ progress);
      gpc.marquee.width= progress.getProgressPercent()+"%";

      gpc.marquee.track_skip_warning = progress.isWarning();

    }

    function onTrackError(error) {
      console.log("track error: " + error);

    }

    function onLoggedIn(){
      console.log("logged in");
      $rootScope.$broadcast("player:ready", true);
      gpc.state.ready = true;
    }

    function onLoggedOut(){
      console.log("logged out");
      $rootScope.$broadcast("player:ready", false);
      gpc.state.ready = false;
    }

    function onInternetDown(){
      console.log("no internet");
      gpc.state.hasTrack = false;
      playerService.asyncControlPause().then(function(){
        onControlOK();
        gpc.state.playing = false;
      },
        onControlError
      );
      gpc.cloud.show = true;
      $timeout(function(){
        gpc.cloud.throbbing = true;
        $timeout(function(){
          var cloud = document.getElementById("cloud");
          gpc.cloud.throbbing = false;
          cloud.classList.add("playerCloudLeave");
          cloud.classList.remove("playerCloud");
          $timeout(function(){
            gpc.cloud.show =false;
            cloud.classList.remove("playerCloudLeave");
            $timeout(function(){
              cloud.classList.add("playerCloud");
            },100);
          },250);
        },3000);
      },500);
    }

    function onInternetUp(){
      console.log("internet available");
    }

    function onPlaylistNew(){
      console.log("new playlist: controls disabled / spinner until we get track...");
      gpc.marquee.scroller="Waiting For Track"
      playerService.asyncControlPlay(); 
    }

    function onPlaylistEnd(){
      console.log("end of playlist");
      gpc.state.hasTrack = false;
      gpc.state.playing = false;
      gpc.marquee.scroller = "";
    }

    function onPlaylistNone(){
      console.log("no playlist");
    }

    function asyncHandleEvent(event) {


      var deferred = $q.defer();

      $timeout(
        function () {


          switch (event.getId()) {
            case EventIdentifier.TRACK_NEW: // a new track has been queued
              onTrackNew(event.getPayload());
              break;
            case EventIdentifier.TRACK_PAUSED:// the playing of the selected track has been paused
              onTrackPaused(event.getPayload());
              break;
            case EventIdentifier.TRACK_PROGRESS_PERCENT: // progress through selected track
              onTrackProgressPercent(event.getPayload());
              break;
            case EventIdentifier.TRACK_END: // track ended. Obvs.
              onTrackEnd(event.getPayload());
              break;
            case EventIdentifier.TRACK_ERROR: // an error has occured playing the track / the track is not available.
              onTrackError(event.getPayload());
              break;
            case EventIdentifier.LOGGED_IN: // we are now logged in
              onLoggedIn();
              break;  
            case EventIdentifier.LOGGED_OUT: // we are now logged out
              onLoggedOut();
              break;
            case EventIdentifier.INTERNET_DOWN: // internet connection lost
              onInternetDown(event.getPayload());
              break;
            case EventIdentifier.INTERNET_UP: // internet connection found
              onInternetUp(event.getPayload());
              break;
            case EventIdentifier.PLAYLIST_NEW: // a new playlist is available
              onPlaylistNew();
              break;  
            case EventIdentifier.PLAYLIST_END: // no more tracks available in playlist.
              onPlaylistEnd();
              break;    
              case EventIdentifier.PLAYLIST_NONE: // no playlist has been loaded
              onPlaylistNone();
              break;    
    };

        });

      return deferred.promise;

    }

    gpc.handleBackPress = function handleBackPress() {
      playerService.asyncControlSkipPrev().then(function(){
        onControlOK();
        gpc.state.playing = true;
      },
        onControlError
      );
    };
    gpc.handlePausePress = function handlePausePress() {
      playerService.asyncControlPause().then(function(){
        onControlOK();
        gpc.state.playing = false;
      },
        onControlError
      );
    };
    gpc.handlePlayPress = function handlePlayPress() {
      playerService.asyncControlPlay().then(function(){
        onControlOK();
        gpc.state.playing = true;
      },
        onControlError
      );
    };
    gpc.handleNextPress = function handleNextPress() {
      playerService.asyncControlSkipNext().then(function(){
        onControlOK();
        gpc.state.playing = true;
      },
        onControlError
      );
    };


    function initialise() {
      playerService.initialise(asyncHandleEvent);
    }

    $scope.$on('player:ready',function(event,data) {
      console.log("gaddum.player - ready = ",data);
      gpc.state.show = data?true:false;
    });

    initialise();

    gpc.hack = setInterval(function(){
      //console.log("gpc.state.playing="+String(gpc.state.playing)+" gpc.state.hasTrack="+String(gpc.state.hasTrack) );
    },1000);

    return gpc;
  }
})();
