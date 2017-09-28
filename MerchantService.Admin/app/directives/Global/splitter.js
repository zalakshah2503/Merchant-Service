app.directive('splitter', function ($compile) {
    return {
        restrict: "AE",
        scope: { steps: '=' },
        link: function ($scope, elm, attrs) {
            $scope.expanded = function (e) { $("#hsplitter").wijsplitter("refresh"); },
            $scope.collapsed = function (e) { $("#hsplitter").wijsplitter("refresh"); },
            $scope.sized = function (e) { $("#hsplitter").wijsplitter("refresh"); }
            //$("#hsplitter").wijsplitter({
            //    panel1: { minSize: 350 },
            //    fullSplit: false,
            //    collapsed: false,
            //    scrollBars: "visible"
            //});
        }
     
    };
});