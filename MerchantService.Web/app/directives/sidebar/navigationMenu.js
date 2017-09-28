/// <reference path="../../app.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular-resource.d.ts" />
var NavigationMenu = (function () {
    function NavigationMenu($rootScope, $timeout, listOfAccessPages, $location, authenticationPath, userAccessService, inventoryHubServices) {
        var _this = this;
        this.$rootScope = $rootScope;
        this.$timeout = $timeout;
        this.listOfAccessPages = listOfAccessPages;
        this.$location = $location;
        this.authenticationPath = authenticationPath;
        this.userAccessService = userAccessService;
        this.inventoryHubServices = inventoryHubServices;
        this.restrict = "A";
        this.link = function (scope, elem, attrs) {
            var tagLink;
            var accessLink = _this.listOfAccessPages.listOfPageList;
            var isAdmin = _this.listOfAccessPages.isAdmin;
            var i;
            _this.$rootScope.$on("$routeChangeSuccess", function () {
                //get current URL
                var pageLink = elem.find('a');
                var url = window.location.href;
                var link = url.split('/')[4];
                if (accessLink === null || accessLink === undefined) {
                    _this.$location.path(_this.authenticationPath);
                }
                var timer = _this.$timeout(function () {
                    //scope.setAllMenu();
                    //for each a tag find href
                    pageLink.each(function () {
                        tagLink = $(this).attr("href");
                        if (tagLink === null || tagLink === undefined || tagLink === "") { }
                        else {
                            //for set active menu                    
                            if (tagLink === "#" + link) {
                                $(this).parents('ul.nav').find('li').removeClass('active');
                                $(this).parents('ul.nav').find('ul.collapse').removeClass('in');
                                $(this).parent('li').addClass("active");
                                if ($(this).parent('li').parent('ul.collapse').hasClass('nav-third-level')) {
                                    $(this).parent('li').addClass('active');
                                    $(this).parent('li').parents('ul.nav-second-level').addClass('in');
                                    $(this).parent('li').parents('ul.nav-second-level').css('height', 'auto');
                                    $(this).parent('li').parents('ul.nav-second-level').parent('li').addClass('active');
                                    $(this).parent('li').parent('ul.nav-third-level').addClass('in');
                                    $(this).parent('li').parent('ul.nav-third-level').parent('li').addClass('active');
                                }
                                else {
                                    $(this).parent('li').parent('ul.collapse').addClass('in');
                                    $(this).parent('li').parent('ul.collapse').css('height', 'auto');
                                    $(this).parent('li').parent('ul.collapse').parent('li').addClass('active');
                                }
                            }
                            else {
                                //for add active class to customer profile  menu
                                if (link === "AddNewCustomer" || link === "CustomerDetails") {
                                    elem.find('li#customer-link').siblings('li').removeClass('active');
                                    elem.find('li#customer-link').addClass('active');
                                    elem.find('li#customer-link').parent('ul').addClass('in');
                                    elem.find('li#customer-link').parent('ul').parent('li').addClass('active');
                                }
                                else if (link === "AddNewItem" || link === "AddSubItem" || link === "EditNewItem" || link === "EditSubItem") {
                                    elem.find('li#Item-profile-link').siblings('li').removeClass('active');
                                    elem.find('li#Item-profile-link').addClass('active');
                                    elem.find('li#Item-profile-link').parent('ul').addClass('in');
                                    elem.find('li#Item-profile-link').parent('ul').parent('li').addClass('active');
                                }
                                else if (link === "SupplierPOWorkList" || link === "SupplierPODetails" || link === "SupplierPO") {
                                    elem.find('li#SPO-link').siblings('li').removeClass('active');
                                    elem.find('li#SPO-link').addClass('active');
                                    elem.find('li#SPO-link').parent('ul').addClass('in');
                                    elem.find('li#SPO-link').parent('ul').parent('li').addClass('active');
                                }
                                else if (link === "SupplierReturnRequestDetails") {
                                    elem.find('li#supplier-return-worklist-link').siblings('li').removeClass('active');
                                    elem.find('li#supplier-return-worklist-link').addClass('active');
                                    elem.find('li#supplier-return-worklist-link').parent('ul').addClass('in');
                                    elem.find('li#supplier-return-worklist-link').parent('ul').parent('li').addClass('active');
                                }
                                else if (link === "CustomerPO" || link === "CustomerPOWorkList" || link === "CustomerPODetail" || link === "CustomerPOPayment") {
                                    elem.find('li#CPO-link').siblings('li').removeClass('active');
                                    elem.find('li#CPO-link').addClass('active');
                                    elem.find('li#CPO-link').parent('ul').addClass('in');
                                    elem.find('li#CPO-link').parent('ul').parent('li').addClass('active');
                                }
                                else if (link === "InventoryMonitorDetails" || link === "InventoryInvestigation") {
                                    elem.find('li#inventory-worklist').siblings('li').removeClass('active');
                                    elem.find('li#inventory-worklist').addClass('active');
                                    elem.find('li#inventory-worklist').parent('ul').addClass('in');
                                    elem.find('li#inventory-worklist').parent('ul').parent('li').addClass('active');
                                }
                                else if (link === "ItemDestructionDetails") {
                                    elem.find('li#item-destruction-worklist').siblings('li').removeClass('active');
                                    elem.find('li#item-destruction-worklist').addClass('active');
                                    elem.find('li#item-destruction-worklist').parent('ul').addClass('in');
                                    elem.find('li#item-destruction-worklist').parent('ul').parent('li').addClass('active');
                                }
                                else if (link === "InventoryRecorder") {
                                    elem.find('li#inventory-recorder').siblings('li').removeClass('active');
                                    elem.find('li#inventory-recorder').addClass('active');
                                    elem.find('li#inventory-recorder').parent('ul').addClass('in');
                                    elem.find('li#inventory-recorder').parent('ul').parent('li').addClass('active');
                                }
                                else if (link === "InventoryMonitor") {
                                    elem.find('li#inventory-monitor').siblings('li').removeClass('active');
                                    elem.find('li#inventory-monitor').addClass('active');
                                    elem.find('li#inventory-monitor').parent('ul').addClass('in');
                                    elem.find('li#inventory-monitor').parent('ul').parent('li').addClass('active');
                                }
                                else if (link === "InventoryTransferDetails") {
                                    elem.find('li#inventory-transfer-worklist-link').siblings('li').removeClass('active');
                                    elem.find('li#inventory-transfer-worklist-link').addClass('active');
                                    elem.find('li#inventory-transfer-worklist-link').parent('ul').addClass('in');
                                    elem.find('li#inventory-transfer-worklist-link').parent('ul').parent('li').addClass('active');
                                }
                                else if (link === "IncidentReportDetail") {
                                    elem.find('li#item-incident-report-link').siblings('li').removeClass('active');
                                    elem.find('li#item-incident-report-link').addClass('active');
                                    elem.find('li#item-incident-report-link').parent('ul').addClass('in');
                                    elem.find('li#item-incident-report-link').parent('ul').parent('li').addClass('active');
                                }
                                else if (link === "SessionClosingVarification") {
                                    elem.find('li#session-worklist-link').siblings('li').removeClass('active');
                                    elem.find('li#session-worklist-link').addClass('active');
                                    elem.find('li#session-worklist-link').parent('ul').addClass('in');
                                    elem.find('li#session-worklist-link').parent('ul').parent('li').addClass('active');
                                }
                            }
                        }
                    });
                }, 200);
            });
            // for set scrollbar position
            elem.find('li').click(function () {
                scope.scrollTop();
            });
            scope.scrollTop = function () {
                angular.element('html,body').animate({ scrollTop: 0 }, 100);
            };
        };
        this.initialization(listOfAccessPages);
    }
    NavigationMenu.prototype.initialization = function (listOfAccessPages) {
    };
    return NavigationMenu;
}());
NavigationMenu.directiveId = "navigationMenu";
app.directive(NavigationMenu.directiveId, ['$rootScope', '$timeout', 'listOfAccessPages', '$location', 'authenticationPath', 'UserAccessService', 'inventoryHubServices', function ($rootScope, $timeout, listOfAccessPages, $location, authenticationPath, UserAccessService, inventoryHubServices) {
        return new NavigationMenu($rootScope, $timeout, listOfAccessPages, $location, authenticationPath, UserAccessService, inventoryHubServices);
    }
]);
//# sourceMappingURL=navigationMenu.js.map