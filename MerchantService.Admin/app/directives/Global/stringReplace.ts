/// <reference path="../../app.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular.d.ts" />

interface IstringReplace extends ng.IDirective {

}

interface IstringReplaceScope extends ng.IScope {

}

class StringReplace implements IstringReplace {
    static directiveId: string = "stringReplace";
    restrict: string = "AE";

    constructor(private $log: ng.ILogService, private $interpolate: ng.IInterpolateService, public lang, public stringConstant, public defaultLanguage) {
    }

    link = (scope: IstringReplaceScope, element, attrs) => {
        let directive = this;
      
        let viewTest;
        if (directive.stringConstant[directive.lang][attrs.stringReplace] === null || directive.stringConstant[directive.lang][attrs.stringReplace] === undefined) {
            viewTest = directive.$interpolate(directive.stringConstant[directive.defaultLanguage][attrs.stringReplace]);
        }
        else {
            viewTest = directive.$interpolate(directive.stringConstant[directive.lang][attrs.stringReplace]);
        }
        let str = viewTest(scope.$parent);
        element.html(str);
    }
}

app.directive(StringReplace.directiveId, ['$log', '$interpolate', 'lang', 'stringConstant', 'defaultLanguage', ($log, $interpolate, lang, stringConstant, defaultLanguage) => {
    return new StringReplace($log, $interpolate, lang, stringConstant, defaultLanguage);
}]);
