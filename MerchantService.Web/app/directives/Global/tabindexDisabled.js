// Install the angularjs.TypeScript.DefinitelyTyped NuGet package
var TabindexDisabled = (function () {
    function TabindexDisabled() {
        this.restrict = "AE";
        this.link = function (scope, elem) {
            elem.on('focus', 'input:not(.enabled input), select:not(.enabled select)', function (e) {
                if (elem.hasClass('disabled')) {
                    $(e.target).blur();
                }
            });
        };
    }
    return TabindexDisabled;
}());
TabindexDisabled.directiveId = "tabindexDisabled";
app.directive(TabindexDisabled.directiveId, [function () {
        return new TabindexDisabled();
    }
]);
//# sourceMappingURL=tabindexDisabled.js.map