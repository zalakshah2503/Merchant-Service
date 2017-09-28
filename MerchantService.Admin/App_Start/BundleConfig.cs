using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Optimization;

namespace MerchantService.Admin.App_Start
{
    public class BundleConfig
    {
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                        "~/Scripts/jquery-{version}.js"));

            bundles.Add(new ScriptBundle("~/bundles/jqueryval").Include(
                      "~/Scripts/jquery.validate*"));

            // Use the development version of Modernizr to develop with and learn from. Then, when you're
            // ready for production, use the build tool at http://modernizr.com to pick only the tests you need.
            bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
                        "~/Scripts/modernizr-*"));

            bundles.Add(new ScriptBundle("~/bundles/bootstrap").Include(
                      "~/Scripts/bootstrap.js"
                     ));
            bundles.Add(new ScriptBundle("~/bundles/angular").Include(

                       "~/Scripts/angular.min.js",
                       "~/Scripts/angular-resource.min.js",
                       "~/Scripts/angular-route.min.js",
                       "~/Scripts/angular-animate.min.js",
                       "~/Scripts/angular-sanitize.min.js",
                       "~/Scripts/ngToast.min.js",
                       "~/Scripts/angular-messages.js",
                       "~/Scripts/angular-toggle-switch.min.js",
                       "~/Scripts/select.min.js",
                       "~/Scripts/timepickerpop.js",
                       "~/Scripts/mask.js"
                     ));
            bundles.Add(new ScriptBundle("~/bundles/app").Include(
                      "~/app/app.js"
                     ));


            bundles.Add(new ScriptBundle("~/bundles/controller").Include(
                      "~/app/controllers/roleController.js",
                      "~/app/controllers/userDetailController.js",
                      "~/app/controllers/Globalization/globalizationController.js",
                      "~/app/controllers/Password/resetPasswordController.js",
                      "~/app/controllers/Company/companyController.js",
                      "~/app/controllers/Branch/branchController.js",
                      "~/app/controllers/UserAccess/manageUserAccessController.js",
                      "~/app/controllers/WorkFlow/rolePermissionController.js",
                      "~/app/controllers/ChartController.js",
                      "~/app/controllers/WorkFlow/statusController.js",
                      "~/app/controllers/WorkFlow/workFlowController.js",
                      "~/app/controllers/IncidentReport/IncidentReportController.js",
                       "~/app/controllers/WorkFlow/dynamicWorkFlowController.js"
                     ));
            bundles.Add(new ScriptBundle("~/bundles/service").Include(
                      "~/app/services/roleService.js",
                       "~/app/services/userDetailService.js",
                        "~/app/services/Globalization/globalizationService.js",
                        "~/app/services/Password/resetPasswordService.js",
                         "~/app/services/Company/companyService.js",
                         "~/app/services/Branch/branchDetailService.js",
                         "~/app/services/UserAccess/manageUserAccessService.js",
                         "~/app/services/WorkFlow/rolePermissionService.js",
                         "~/app/services/WorkFlow/statusService.js",
                         "~/app/services/WorkFlow/workFlowService.js",
                         "~/app/services/IncidentReport/IncidentReportService.js"
                     ));

            bundles.Add(new ScriptBundle("~/bundles/directive").Include(
                      "~/app/directives/Global/googlePlaces.js",
                      "~/app/directives/sidebar/navigationMenu.js",
                      "~/app/directives/Global/autoFocus.js",
                       "~/app/directives/Global/treeSteps.js",
                        "~/app/directives/Global/splitter.js",
                        "~/app/directives/Global/stringReplace.js"
                    ));


            bundles.Add(new ScriptBundle("~/bundles/model").Include(
                      "~/app/models/role.js",
                        "~/app/models/userDetail.js",
                       "~/app/models/companyDetail.js",
                       "~/app/models/branchDetail.js",
                       "~/app/models/systemSetting.js",
                       "~/app/models/UserAccess/UserAccessDetail.js",
                       "~/app/models/WorkFlow/permission.js",
                       "~/app/models/WorkFlow/statusType.js",
                       "~/app/models/WorkFlow/workFlow.js",
                       "~/app/models/IncidentReport/IncidentReportModel.js",
                       "~/app/models/balanceBarcodeConfiguration.js",
                       "~/app/models/balanceBarcodeSection.js",
                       "~/app/models/companyBarcodeConfiguration.js",
                       "~/app/models/normalBarcode.js"
                     ));

            bundles.Add(new ScriptBundle("~/bundles/constants").Include(
                     "~/app/keyValuePair.js",
                     "~/app/appConstant.js"
                    ));

            bundles.Add(new ScriptBundle("~/bundles/themejs").Include(
                      "~/Content/Theme/js/ui-bootstrap-tpls.min.js",
                      "~/Content/Theme/js/loading-bar.min.js",
                      "~/Content/Theme/js/ocLazyLoad.min.js",
                      "~/Content/Theme/js/metisMenu.min.js",
                      "~/Content/Theme/js/sb-admin-2.js",
                      "~/Scripts/ng-google-chart.js"

                     ));
            bundles.Add(new StyleBundle("~/Content/css").Include(
                      "~/Content/bootstrap.css",
                      "~/Content/ngToast.min.css",
                      "~/Content/select.min.css"
                      ));

            bundles.Add(new StyleBundle("~/Content/Theme/themecss").Include(
                        "~/Content/Theme/css/main.css",
                        "~/Content/Theme/css/sb-admin-2.css",
                        "~/Content/Theme/css/timeline.css",
                        "~/Content/Theme/css/metisMenu.min.css",
                        "~/Content/Theme/css/loading-bar.min.css",
                        "~/Content/Theme/css/font-awesome.min.css",
                        "~/Content/angular-toggle-switch-bootstrap.css",
                        "~/Content/angular-toggle-switch.css"
                        ));

            bundles.Add(new StyleBundle("~/splittercss").Include(
                       "~/Scripts/splitter/css/jquery-wijmo.css",
                       "~/Scripts/splitter/css/jquery.wijmo-pro.all.3.20153.83.min.css"
                        ));

            bundles.Add(new StyleBundle("~/Content/Maincss").Include(
                      "~/Content/Style.css"));

            BundleTable.EnableOptimizations = false;
        }
    }
}