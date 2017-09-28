// Install the angularjs.TypeScript.DefinitelyTyped NuGet package


interface ItabindexDisabled extends ng.IDirective {
}

interface ItabindexDisabledScope extends ng.IScope {
}



class TabindexDisabled implements ItabindexDisabled {
    static directiveId: string = "tabindexDisabled";
    restrict: string = "AE";

    constructor() { }

    link = (scope, elem) => {

        elem.on('focus', 'input:not(.enabled input), select:not(.enabled select)', (e) => {
            if (elem.hasClass('disabled')) {
                $(e.target).blur();
            }
        });
    }
}

app.directive(TabindexDisabled.directiveId, [() =>
    new TabindexDisabled()
]);
