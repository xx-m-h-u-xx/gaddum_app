(function () {
    'use strict';

    angular
        .module('gaddum.mood')
        .factory('moodSelectModal', moodSelectModal);//rename genModal
    moodSelectModal.$inject = ['$ionicModal', '$rootScope', '$timeout'];
    function moodSelectModal($ionicModal, $rootScope, $timeout) {
        var $scope = $rootScope.$new(),
            myModalInstanceOptions = {
                scope: null,
                focusFirstInput: true,
                controller: 'moodSelectModalController as mc',
                animation: 'slide-in-down'

            };
        $scope.$on("modal.hidden", function (modal) {

            close();

        });
        var modalSave = null;
        var parmeter = null;

        var myModal = {
            open: open,
            close: close,
            getParams: getParams,
            callback: callback
        };
        return myModal;

        function open(params, fnCallbackOk, fnCallbackCancel) {
            var service = this;
            parmeter = params;
            $scope.fnCallbackOk = fnCallbackOk;
            $scope.fnCallbackCancel = fnCallbackCancel;
            $ionicModal.fromTemplateUrl(
                'js/directives/mood/moodSelect.modal/moodSelect.modal.html',
                myModalInstanceOptions
            ).then(function (modalInstance) {
                modalSave = modalInstance;
                service.close = function () {
                    closeAndRemove(modalInstance);

                };
                service.modalInstance = modalInstance;
                return service.modalInstance.show();
            });

        }
        function getParams() {
            return parmeter;
        }
        function callback(emotion) {
            $scope.fnCallbackOk(emotion);

        }
        function close() {
            if (modalSave) {
                // if(!modalSave._isShown){
                $timeout(function () {
                    modalSave.remove();
                    modalSave = null;
                    $scope.fnCallbackCancel();
                }, 500);
            }
            // }
        }
        function closeAndRemove(modalInstance) {
            return modalInstance.hide()
                .then(function () {
                    return modalInstance.remove();
                });
        };
    }
})();

