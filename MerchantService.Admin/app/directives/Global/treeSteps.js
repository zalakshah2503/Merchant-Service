app.directive('tree', function ($compile) {
    return {
        restrict: "E",
        scope: { steps: '=' },
        template:
            '<p class="green-step red-step blue-step">{{ steps.name }}' +
            '<a title="Edit" class="pull-right pointer" name="action-edit"><i class="fa fa-edit step-edit"></i></a>' +
            '<br/><label class="m-r-40">From: <span class="font-normal">User1</span></label> <label>To: <span class="font-normal">User2</span></label> ' +
            '<br/><label>Status: <span class="font-normal">Pending</span></label>' +
            '</p>' +
            '<ul>' +
                '<li ng-repeat="child in steps.children">' +
                    '<tree steps="child"></tree>' +
                '</li>' +
            '</ul>',
        compile: function (tElement, tAttr) {
            var contents = tElement.contents().remove();
            var compiledContents;
            return function (scope, iElement, iAttr) {
                if (!compiledContents) {
                    compiledContents = $compile(contents);
                }
                compiledContents(scope, function (clone, scope) {
                    iElement.append(clone);
                });
            };
        }      
    };
});