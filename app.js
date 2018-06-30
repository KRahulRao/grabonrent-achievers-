var grabOnRentApp = angular.module("grabOnRentApp", [ 'ngResource','ui.bootstrap', 'ui.router','ngTextTruncate','720kb.datepicker']);


grabOnRentApp.config(function($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('home');

    $stateProvider

        // HOME STATES AND NESTED VIEWS ========================================
        .state('home', {
            url: '/home',
            templateUrl: 'html/home.html'
        })

        // ABOUT PAGE AND MULTIPLE NAMED VIEWS =================================
        .state('about', {
            url: '/about',
            templateUrl: 'html/about.html'    
        })
        .state('contact', {
            url: '/contact',
            templateUrl: 'html/contact.html'    
        })
        .state('carrer', {
            url: '/carrer',
            templateUrl: 'html/carrer.html'    
        });

});

/*grabOnRentApp.config([ 'KeepaliveProvider', 'IdleProvider',
		function(KeepaliveProvider, IdleProvider) {
			IdleProvider.idle(1800);
			IdleProvider.timeout(10);
			KeepaliveProvider.interval(10);
		} ]);*/

/*grabOnRentApp.factory('Scopes', function($rootScope) {
	var mem = {};
	return {
		store : function(key, value) {
			mem[key] = value;
		},
		get : function(key) {
			return mem[key];
		}
	};
});*/

grabOnRentApp.directive('popoverClose', function($timeout) {
	return {
		scope : {
			excludeClass : '@'
		},
		link : function(scope, element, attrs) {
			var trigger = document.getElementsByClassName('trigger');
			function closeTrigger(i) {
				$timeout(function() {
					angular.element(trigger[0]).triggerHandler('click')
							.removeClass('trigger');
				});
			}
			element.on('click', function(event) {
				var etarget = angular.element(event.target);
				var tlength = trigger.length;

				if (!etarget.hasClass('trigger')
						&& !etarget.hasClass(scope.excludeClass)) {
					for ( var i = 0; i < tlength; i++) {
						closeTrigger(i)
					}
				}
			});
		}
	};
});
grabOnRentApp.directive('popoverElem', function() {
	return {
		link : function(scope, element, attrs) {
			element.on('click', function() {
				element.addClass('trigger');
			});
		}
	};
});

grabOnRentApp
		.filter(
				'truncate',
				function() {
					return function(text, length, end) {
						if (isNaN(length))
							length = 50;
						if (end === undefined)
							end = "...";
						if (text === undefined || text === null || text === "") {
							return '-';
						} else if (text.length <= length
								|| text.length - end.length <= length) {
							return text;
						} else {
							return String(text).substring(0,
									length - end.length)
									+ end;
						}

					};
				});
grabOnRentApp.filter('replaceSpace', function() {
	return function(input) {
		if (input) {
			return input.replace('_', ' ');
		}
	};
});

grabOnRentApp.filter('filterNull', function() {
	return function(data) {
		if (data === null || data.Message === " ")
			return '-';
		else
			return data;
	};
});

grabOnRentApp.directive('fileModel', [ '$parse', function($parse) {
	return {
		restrict : 'A',
		link : function(scope, element, attrs) {
			var model = $parse(attrs.fileModel);
			var modelSetter = model.assign;

			element.bind('change', function() {
				scope.$apply(function() {
					modelSetter(scope, element[0].files[0]);
				});
			});
		}
	};
} ]);

grabOnRentApp.service('fileUpload', [ '$http', function($http) {
	this.uploadFileToUrl = function(file, uploadUrl) {
		var fd = new FormData();
		fd.append('file', file);
		$http.post(uploadUrl, fd, {
			transformRequest : angular.identity,
			headers : {
				'Content-Type' : undefined
			}
		}).success(function() {
		}).error(function() {
		});
	};
} ]);

grabOnRentApp.filter('sizeConversion',
		function() {
			return function(bytes) {
				if (bytes == 0)
					return '0 Byte';
				var k = 1000;
				var sizes = [ 'Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB',
						'ZB', 'YB' ];
				var i = Math.floor(Math.log(bytes) / Math.log(k));
				return parseFloat((bytes / Math.pow(k, i))) + ' ' + sizes[i];
			};
		});

grabOnRentApp
		.directive(
				'uiBreadcrumbs',
				function($interpolate, $state, Scopes, $rootScope, appConstants) {
					return {
						restrict : 'E',
						templateUrl : function(elem, attrs) {
							return attrs.templateUrl || templateUrl;
						},
						scope : {
							displaynameProperty : '@',
							abstractProxyProperty : '@?'
						},
						link : function(scope) {
							scope.breadcrumbs = [];
							scope.home = function() {

								$state.go('main.home', {}, {
									location : false
								});
								var claimCtrlScope = Scopes
										.get(appConstants.claimController);
								var filterCtrlScope = Scopes
										.get(appConstants.filterController);
								if (filterCtrlScope.selectedMode == 'Tile') {
									claimCtrlScope.showMode(1);
								} else {
									claimCtrlScope.showMode(2);
								}
								$rootScope.$broadcast('resetHome');

							};
							if ($state.$current.name !== '') {
								updateBreadcrumbsArray();
							}
							scope.$on('$stateChangeSuccess', function() {
								updateBreadcrumbsArray();
							});

							function updateBreadcrumbsArray() {
								var workingState;
								var displayName;
								var breadcrumbs = [];
								var currentState = $state.$current;
								while (currentState && currentState.name !== '') {
									workingState = getWorkingState(currentState);
									if (workingState
											&& workingState != 'main.home') {
										displayName = getDisplayName(workingState);

										if (displayName !== false
												&& !stateAlreadyInBreadcrumbs(
														workingState,
														breadcrumbs)) {
											breadcrumbs.push({
												displayName : displayName,
												route : workingState.name
											});
										}
									}
									currentState = currentState.parent;
								}
								breadcrumbs.reverse();
								scope.breadcrumbs = breadcrumbs;
							}

							function getWorkingState(currentState) {
								var proxyStateName;
								var workingState = currentState;
								if (currentState.abstract === true) {
									if (typeof scope.abstractProxyProperty !== 'undefined') {
										proxyStateName = getObjectValue(
												scope.abstractProxyProperty,
												currentState);
										if (proxyStateName) {
											workingState = $state
													.get(proxyStateName);
										} else {
											workingState = false;
										}
									} else {
										workingState = false;
									}
								}
								return workingState;
							}

							function getDisplayName(currentState) {
								var interpolationContext;
								var propertyReference;
								var displayName;

								if (!scope.displaynameProperty) {
									return currentState.name;
								}
								propertyReference = getObjectValue(
										scope.displaynameProperty, currentState);

								if (propertyReference === false) {
									return false;
								} else if (typeof propertyReference === 'undefined') {
									return currentState.name;
								} else {
									interpolationContext = (typeof currentState.locals !== 'undefined') ? currentState.locals.globals
											: currentState;
									displayName = $interpolate(
											propertyReference)(
											interpolationContext);
									return displayName;
								}
							}

							function getObjectValue(objectPath, context) {
								var i;
								var propertyArray = objectPath.split('.');
								var propertyReference = context;

								for (i = 0; i < propertyArray.length; i++) {
									if (angular
											.isDefined(propertyReference[propertyArray[i]])) {
										propertyReference = propertyReference[propertyArray[i]];
									} else {
										return undefined;
									}
								}
								return propertyReference;
							}

							function stateAlreadyInBreadcrumbs(state,
									breadcrumbs) {
								var i;
								var alreadyUsed = false;
								for (i = 0; i < breadcrumbs.length; i++) {
									if (breadcrumbs[i].route === state.name) {
										alreadyUsed = true;
									}
								}
								return alreadyUsed;
							}

						}
					};
				});

grabOnRentApp.directive('stRatio', function() {
	return {
		link : function(scope, element, attr) {
			var ratio = +(attr.stRatio);

			element.css('width', ratio + '%');

		}
	};
});

var secretEmptyKey = '[$empty$]';
grabOnRentApp.directive('focusMe', function($timeout, $parse) {
	return {
		// scope: true, // optionally create a child scope
		link : function(scope, element, attrs) {
			var model = $parse(attrs.focusMe);
			scope.$watch(model, function(value) {
				if (value === true) {
					$timeout(function() {
						element[0].focus();
					});
				}
			});
		}
	};
});

grabOnRentApp.directive('emptyTypeahead', function() {
	return {
		require : 'ngModel',
		link : function(scope, element, attrs, modelCtrl) {
			modelCtrl.$parsers.unshift(function(inputValue) {
				var value = (inputValue ? inputValue : secretEmptyKey);
				modelCtrl.$viewValue = value;
				return value;
			});

			modelCtrl.$parsers.push(function(inputValue) {
				return inputValue === secretEmptyKey ? '' : inputValue;
			});
		}
	};
});
grabOnRentApp.directive('customDatepicker',function($compile){
        return {
            replace:true,
            scope: {
                ngModel: '=',
                dateOptions: '='
            },
            link: function($scope, $element, $attrs, $controller){
                var $button = $element.find('button');
                var $input = $element.find('input');
                $button.on('click',function(){
                    if($input.is(':focus')){
                        $input.trigger('blur');
                    } else {
                        $input.trigger('focus');
                    }
                });
            }    
        };
    });