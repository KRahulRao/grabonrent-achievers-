grabOnRentApp.service('loginModal', ['$modal',
    function ($modal) {

        var modalDefaults = {
            backdrop: true,
            keyboard: true,
            modalFade: true,
            templateUrl: "html/logn.html"
        };

        var modalOptions = {
            closeButtonText: '',
            actionButtonText: '',
            headerText: '',
            bodyText:''
        };

        this.showModal = function (customModalDefaults, customModalOptions) {
            if (!customModalDefaults) customModalDefaults = {};
            customModalDefaults.backdrop = 'static';
            return this.show(customModalDefaults, customModalOptions);
        };
        
        
        this.show = function (customModalDefaults, customModalOptions) {
        	var tempModalDefaults = {};
            var tempModalOptions = {};

           angular.extend(tempModalDefaults, modalDefaults, customModalDefaults);

            angular.extend(tempModalOptions, modalOptions, customModalOptions);

            if (!tempModalDefaults.controller) {
                tempModalDefaults.controller = function ($scope, $modalInstance) {
         
                       
                    $scope.modalOptions = tempModalOptions;
                    $scope.modalOptions.submitForm = function (result) {
                        $modalInstance.close(result);
                    };
                    $scope.modalOptions.close = function (result) {
                        $modalInstance.dismiss('cancel');
                    };
                };
            }

            return $modal.open(tempModalDefaults).result;
        };

    }]);