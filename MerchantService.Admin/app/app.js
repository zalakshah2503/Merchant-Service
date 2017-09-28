/// <reference path="../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../scripts/typings/angularjs/angular-route.d.ts" />
/// <reference path="../scripts/typings/angularjs/angular-resource.d.ts" />
var apiPaths = {
    saveRoleInfo: 'api/Role/SaveRole',
    getRoleList: 'api/Role/GetRoleList',
    deleteRole: 'api/Role/DeleteRole',
    getBranchList: 'api/branch/getBranch',
    saveUserDetailPath: 'api/UserDetail/addUserDetail',
    getUserList: 'api/UserDetail/getUserList',
    // getRandomEmployeeId: 'api/UserDetail/getEmployeeId',
    getUserById: 'api/UserDetail/getUserById',
    deleteUser: 'api/UserDetail/deleteUser',
    resetPassword: 'api/UserDetail/resetUserPassword',
    getAllUserList: 'api/UserDetail/getAllUserList',
    getModuleList: 'api/Globalization/GetModuleList',
    getLabelList: 'api/Globalization/GetLabelListById',
    addListOfLabel: 'api/Globalization/SaveListOfLabel',
    addCompanyDetail: 'api/Company/addCompanyDetail',
    getAllCompanyDetail: 'api/Company/getAllCompanyDetail',
    getCompanyDetailsById: 'api/Company/getCompanyDetailsById',
    updateCompanyDetail: 'api/Company/updateCompanyDetail',
    getAllLanguage: 'api/Company/getAllLanguage',
    deleteCompanyDetails: 'api/Company/deleteCompanyDetails',
    addBranchDetails: 'api/Branch/addBranchDetail',
    updateBranchDetails: 'api/Branch/updateBranchDetail',
    getBranchById: 'api/Branch/getBranchById',
    deleteBranchDetails: 'api/Branch/deleteBranch',
    getAdditionalServiceList: 'api/additionalServices/getAdditionalServicesList',
    getUserAccessList: 'api/UserAccess/GetUserAccessListbyId',
    updateUserAccessDetail: 'api/UserAccess/UpdateUserAccessDetail',
    getUserAccessByRoleId: 'api/UserAccess/GetUserAccessPageByRoleId',
    getSystemSetting: 'api/Company/getSystemSetting',
    addSystemSetting: 'api/Company/addSystemSetting',
    getAllRolePermissionlist: 'api/RolePermission/getAllRolePermissionlist',
    getAllPermissionsList: 'api/RolePermission/getAllPermissionsList',
    getCompanyByUserId: 'api/Company/GetCompanyDetailByUserId',
    getAllRoleList: 'api/RolePermission/getAllRoleList',
    saveRoleAndPermissionDetails: 'api/RolePermission/saveRoleAndPermissionDetails',
    roleAndPermission: 'api/RolePermission/checkRoleAndPermission',
    getallStatus: 'api/WorkFlow/getallStatus',
    updateStatusDetails: 'api/WorkFlow/updateStatusDetails',
    saveStatusDetails: 'api/WorkFlow/saveStatusDetails',
    getAllWorkFlowName: 'api/WorkFlow/getAllWorkFlowName',
    checkPermissionRole: 'api/WorkFlow/checkPermissionRole',
    addWorkFlowDetails: 'api/WorkFlow/addWorkFlowDetails',
    saveWorkFlowDetails: 'api/WorkFlow/saveWorkFlowDetails',
    getAllWorkFlowList: 'api/workFlow/getAllWorkFlowList',
    getAllCurrencyDetail: 'api/Company/getAllCurrencyDetail',
    getAllWorkFlowAcionList: 'api/workFlow/getAllWorkFlowAcionList',
    getWorkFlowDetailsForTreeViewByActivityId: 'api/WorkFlow/getWorkFlowDetailsForTreeViewByActivityId',
    editWorkFlowInformationById: 'api/WorkFlow/editWorkFlowInformationById',
    editWorkFlowPermission: 'api/WorkFlow/editWorkFlowPermission',
    // getChildPermission:'api/WorkFlow/getChildPermission'
    //getAllCurrencyDetail: 'api/Company/getAllCurrencyDetail',
    getOprationList: 'api/ManageIncident/getOprationList',
    submitIncidentReport: 'api/ManageIncident/insertIncidentReport',
    getIncidnetReport: 'api/ManageIncident/getIncidentReportList',
    getAllActivityList: 'api/WorkFlow/getAllActivityList',
    getWorkFlowDetailTreeViewByActivityId: 'api/WorkFlow/getWorkFlowTreeViewByActivityId',
    deleteWorkFlowInformation: 'api/WorkFlow/deleteWorkFlowInformation',
    getvariableListByActivityId: 'api/WorkFlow/getAttributeListByActivityId',
    deleteConditionalOperator: 'api/WorkFlow/deleteConditionalOperator',
    workFLowNameAlreadyExistOrNot: 'api/WorkFlow/workFLowNameAlreadyExistOrNot',
    getAllWorkFlowNameList: 'api/WorkFlow/getAllWorkFlowNameList',
    getAllBoolenOperatorListByActivityId: 'api/WorkFlow/getAllBoolenOperatorListByActivityId',
    updateIncidentReport: 'api/ManageIncident/updateIncidentReport'
};
var app = angular.module('app', [
    // Angular modules 
    'ngResource',
    'ngRoute',
    'ui.bootstrap',
    'toggle-switch',
    'ngToast',
    'ui.select',
    'ngMessages',
    'googlechart',
    'ngSanitize',
    'timepickerPop' // ui select 
]);
app.config(['$routeProvider', function ($routeProvider) {
        $routeProvider
            .when('/', {
            templateUrl: '/Templates/AdminDashboard.html'
        })
            .when('/dashboard', {
            templateUrl: '/Templates/AdminDashboard.html'
        }).when('/ManageRole', {
            templateUrl: '/Templates/ManageRole.html'
        }).when('/AddUser', {
            templateUrl: '/Templates/AddUser.html'
        }).when('/AddUser/:id', {
            templateUrl: '/Templates/AddUser.html'
        }).when('/ManageSystemSetting', {
            templateUrl: '/Templates/ManageSystemSetting.html'
        }).when('/SystemConstant', {
            templateUrl: '/Templates/SystemConstant.html'
        }).when('/ManageCompany', {
            templateUrl: '/Templates/ManageCompany.html'
        }).when('/ManageUser', {
            templateUrl: '/Templates/ManageUser.html'
        }).when('/ManageIncidentReport', {
            templateUrl: '/Templates/ManageIncidentReport.html'
        })
            .when('/Globalization', {
            templateUrl: '/Templates/Globalization/Globalization.html'
        }).when('/ResetPassword', {
            templateUrl: '/Templates/ResetPassword.html'
        }).when('/ManageUserAccess', {
            templateUrl: '/Templates/UserAccess/ManageUserAccess.html'
        }).when('/ManageBranch', {
            templateUrl: '/Templates/ManageBranch.html'
        }).when('/AddCompany', {
            templateUrl: '/Templates/AddCompany.html'
        }).when('/EditCompany/:id', {
            templateUrl: '/Templates/EditCompanyDetail.html'
        }).when('/AddBranch', {
            templateUrl: '/Templates/AddBranch.html'
        }).when('/AddBranch/:id', {
            templateUrl: '/Templates/AddBranch.html'
        }).when('/RolesandPermissions', {
            templateUrl: '/Templates/Workflow/RolesandPermissions.html'
        }).when('/AddRolesandPermissions', {
            templateUrl: '/Templates/Workflow/AddRolesandPermission.html'
        }).when('/EditRolesandPermissions/:id', {
            templateUrl: '/Templates/Workflow/AddRolesandPermission.html'
        }).when('/Status', {
            templateUrl: '/Templates/Workflow/Status.html'
        }).when('/WorkFlow', {
            templateUrl: '/Templates/Workflow/WorkFlow.html'
        }).when('/WorkFlowList', {
            templateUrl: '/Templates/Workflow/ManageWorkFlow.html'
        }).when('/AddWorkFlow', {
            templateUrl: '/Templates/Workflow/AddWorkFlow.html'
        }).when('/EditWorkFlow/:id', {
            templateUrl: '/Templates/Workflow/AddWorkFlow.html'
        });
    }
]);
//# sourceMappingURL=app.js.map