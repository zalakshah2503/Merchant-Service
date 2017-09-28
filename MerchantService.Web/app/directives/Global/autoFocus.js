/// <reference path="../../app.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular-resource.d.ts" />
var AutoFocus = (function () {
    function AutoFocus($timeout, $parse) {
        var _this = this;
        this.$timeout = $timeout;
        this.$parse = $parse;
        this.restrict = "A";
        this.link = function (scope, elem, attrs) {
            //for set autofocus which attributes value is true
            var model = _this.$parse(attrs.autoFocus);
            scope.$watch(model, function (autofocus) {
                if (autofocus)
                    setTimeout(function () {
                        //elem[0].focus();
                    }, 100);
            });
        };
    }
    return AutoFocus;
}());
AutoFocus.directiveId = "autoFocus";
app.directive(AutoFocus.directiveId, ['$timeout', '$parse', function ($timeout, $parse) {
        return new AutoFocus($timeout, $parse);
    }
]);
//# sourceMappingURL=autoFocus.js.map