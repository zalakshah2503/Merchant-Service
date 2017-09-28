/// <reference path="../../app.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular-resource.d.ts" />

interface IautoFocus extends ng.IDirective {
}

interface IautoFocusScope extends ng.IScope {
}

class AutoFocus implements IautoFocus {
    static directiveId: string = "autoFocus";
    restrict: string = "A";

    constructor(public $timeout, public $parse) { }

    link = (scope, elem, attrs) => {
        //for set autofocus which attributes value is true

        let model = this.$parse(attrs.autoFocus);
        scope.$watch(model, function (autofocus) {
            if (autofocus)
                setTimeout(function () {
                }, 100);
        });
    }
}

app.directive(AutoFocus.directiveId, ['$timeout', '$parse', ($timeout, $parse) =>
    new AutoFocus($timeout, $parse)
]);
