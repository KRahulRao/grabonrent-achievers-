grabOnRentApp.controller('headerController', ['$scope','loginModal', function($scope,loginModal){
	$scope.signUp=function(){
		var modalOptions = {
						            closeButtonText: 'Cancel',
						            headerText: 'Login',
						            actionButtonText: 'Submit',
						            bodyText: '',
						 };

						 loginModal.showModal({}, modalOptions);
	};

	$scope.login=function(){
		alert("Login");
	};
	
}]);