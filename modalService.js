grabOnRentApp.service('modalService', [ '$modal', function($modal) {
	var modalDefaults = {
		backdrop : true,
		keyboard : true,
		modalFade : true,
		templateUrl : "html/modal.html"
	};

	var modalOptions = {
		closeButtonText : 'Ok',
		headerText : 'Error Message',
		bodyText : []
	};

	this.showModal = function(customModalDefaults, customModalOptions) {
		if (!customModalDefaults){
				customModalDefaults = {};
			}	
		//customModalDefaults.backdrop = 'static';
		return this.show(customModalDefaults, customModalOptions);
	};

	this.show = function(customModalDefaults, customModalOptions) {
		
		var tempModalDefaults = {};
		var tempModalOptions = {};

		angular.extend(tempModalDefaults, modalDefaults, customModalDefaults);
		angular.extend(tempModalOptions, modalOptions, customModalOptions);
		
		if (!tempModalDefaults.controller) {
			tempModalDefaults.controller = function($scope, $modalInstance) {
				$scope.modalOptions = tempModalOptions;
				$scope.modalOptions.close = function(result) {
//					$modalInstance.dismiss('cancel');
					$modalInstance.close(result);
				};
				
			};
		}

		return $modal.open(tempModalDefaults).result;
	};
} ]);