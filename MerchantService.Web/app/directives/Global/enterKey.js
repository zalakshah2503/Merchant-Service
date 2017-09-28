app.directive("enterKey",['$rootScope' ,function ($rootScope) {
    return {
        restrict: 'AE',
        link: function (scope, element) {
            element.bind("keydown keypress", function (event) {
                if (event.which === 13) {
                    $rootScope.$broadcast("addIssueInventoryRecord",scope.issueInventoryDetails);
                }
            });
        }
    }
}]);

//angular.module('test', []).directive('onEnter', function () {
//    return {
//        scope: { onEnter: 'expression' },
//        link: function (scope, element) {
//            element.bind("keydown keypress", function (event) {
//                if (event.which === 13) {
//                    scope.onEnter();
//                    scope.$apply();
//                }
//            });
//        }
//    }
//});