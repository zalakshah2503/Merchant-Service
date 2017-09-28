/// <reference path="../../app.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular-resource.d.ts" />
var NavigationMenu = (function () {
    function NavigationMenu($rootScope, $timeout, adminName) {
        var _this = this;
        this.$rootScope = $rootScope;
        this.$timeout = $timeout;
        this.adminName = adminName;
        this.restrict = "A";
        this.link = function (scope, elem, attrs) {
            if (_this.adminName === "SuperAdmin")
                _this.$rootScope.IsAdmin = true;
            else {
                elem.removeClass('hide');
                _this.$rootScope.IsAdmin = false;
            }
            _this.$rootScope.$on("$routeChangeSuccess", function () {
                //get current URL
                var url = window.location.href;
                var tagLink;
                var link = url.split('/')[4];
                var timer = _this.$timeout(function () {
                    if (link === null || link === undefined || link === "") {
                        elem.find('li').removeClass('active');
                        elem.find('ul.collapse').removeClass('in');
                        angular.element("#dashboard").addClass("active");
                    }
                    //for each a tag find href
                    elem.find('a').each(function () {
                        tagLink = $(this).attr("href");
                        if (tagLink === null || tagLink === undefined || tagLink === "") { }
                        else {
                            //for set active menu
                            if (tagLink === "#" + link) {
                                $(this).parents('ul.nav').find('li').removeClass('active');
                                $(this).parents('ul.nav').find('ul.collapse').removeClass('in');
                                $(this).parent('li').addClass("active");
                                if ($(this).parent('li').parent('ul.collapse').hasClass('nav-second-level')) {
                                    $(this).parent('li').parent('ul.nav-second-level').addClass('in');
                                    $(this).parent('li').parents('ul.nav-second-level').css('height', 'auto');
                                    $(this).parent('li').parent('ul.nav-second-level').parent('li').addClass('active');
                                }
                                else {
                                    $(this).parent('li').siblings('li').removeClass('active');
                                }
                            }
                            else {
                                //for add active class to company menu
                                if (link === "AddCompany" || link === "EditCompany") {
                                    elem.find('li#Manage-Company').siblings('li').removeClass('active');
                                    elem.find('li#Manage-Company').addClass('active');
                                }
                                else if (link === "AddBranch") {
                                    elem.find('li#Manage-Branch').siblings('li').removeClass('active');
                                    elem.find('li#Manage-Branch').addClass('active');
                                }
                                else if (link === "AddUser") {
                                    elem.find('li#Manage-User').siblings('li').removeClass('active');
                                    elem.find('li#Manage-User').addClass('active');
                                    elem.find('li#Manage-User').parent('ul.collapse').addClass('in');
                                    elem.find('li#Manage-User').parent('ul.collapse').css('height', 'auto');
                                    elem.find('li#Manage-User').parent('ul.collapse').parent('li').addClass('active');
                                }
                                else if (link === "EditWorkFlow") {
                                    elem.find('li#Work-Flow').siblings('li').removeClass('active');
                                    elem.find('li#Work-Flow').addClass('active');
                                }
                            }
                        }
                    });
                }, 400);
            });
            //for set scrollbar position
            elem.find('li').click(function () {
                angular.element('html,body').animate({ scrollTop: 0 }, 100);
            });
        };
    }
    return NavigationMenu;
}());
NavigationMenu.directiveId = "navigationMenu";
app.directive(NavigationMenu.directiveId, ['$rootScope', '$timeout', 'adminName', function ($rootScope, $timeout, adminName) {
        return new NavigationMenu($rootScope, $timeout, adminName);
    }
]);
//# sourceMappingURL=navigationMenu.js.map