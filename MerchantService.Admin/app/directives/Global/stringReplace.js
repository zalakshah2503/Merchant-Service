/// <reference path="../../app.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular.d.ts" />
var StringReplace = (function () {
    function StringReplace($log, $interpolate, lang, stringConstant, defaultLanguage) {
        var _this = this;
        this.$log = $log;
        this.$interpolate = $interpolate;
        this.lang = lang;
        this.stringConstant = stringConstant;
        this.defaultLanguage = defaultLanguage;
        this.restrict = "AE";
        this.link = function (scope, element, attrs) {
            var directive = _this;
            var viewTest;
            if (directive.stringConstant[directive.lang][attrs.stringReplace] === null || directive.stringConstant[directive.lang][attrs.stringReplace] === undefined) {
                viewTest = directive.$interpolate(directive.stringConstant[directive.defaultLanguage][attrs.stringReplace]);
            }
            else {
                viewTest = directive.$interpolate(directive.stringConstant[directive.lang][attrs.stringReplace]);
            }
            var str = viewTest(scope.$parent);
            element.html(str);
        };
    }
    return StringReplace;
}());
StringReplace.directiveId = "stringReplace";
app.directive(StringReplace.directiveId, ['$log', '$interpolate', 'lang', 'stringConstant', 'defaultLanguage', function ($log, $interpolate, lang, stringConstant, defaultLanguage) {
        return new StringReplace($log, $interpolate, lang, stringConstant, defaultLanguage);
    }]);
//# sourceMappingURL=stringReplace.js.map