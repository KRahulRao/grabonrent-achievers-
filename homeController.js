grabOnRentApp.controller('homeController', ['$scope', '$http', function( $scope, $http ){
	fetchAllBikesData();

	var arr = [];
	function fetchAllBikesData(){
		$scope.bikes=[];
		$http.get('http:localhost:4000/fetchAllBikes').then( function ( response ) {
			console.log("fetchAllBikesData", response);
			 $scope.bikes = response.data;
		}); 
	}

	$scope.Name="Hi This is Home Page";
	$scope.searchDetails = {
			fromDate : "",
			toDate : "",
			selectedfromTimeSlot:"",
			selectedToTimeSlot:""

	};
	$scope.records = [{
        id: 1,
        value: "6:30",
    }, {
        id: 2,
        value: "7:00",
    }, {
        id: 3,
        value: "7:30",
    },{
        id: 4,
        value: "8:30",
    }];   
	$scope.searchBikes=function(){
		console.log($scope.searchDetails);
	}
}]);