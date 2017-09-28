/// <reference path="../../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular-route.d.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular-resource.d.ts" />
var ResetPasswordService = (function () {
    function ResetPasswordService($resource, $q, $log) {
        this.$resource = $resource;
        this.$q = $q;
        this.$log = $log;
        this.$log.log('Reset Password Services Call');
        this.resetPassword = this.$resource(apiPaths.resetPassword);
        this.userList = this.$resource(apiPaths.getAllUserList);
    }
    ResetPasswordService.prototype.resetUserPassword = function (userId) {
        return this.resetPassword.get({ userId: userId }).$promise;
    };
    ResetPasswordService.prototype.getAllUserList = function () {
        return this.userList.query().$promise;
    };
    return ResetPasswordService;
}());
ResetPasswordService.serviceId = "ResetPasswordService";
app.service('ResetPasswordService', ['$resource', '$q', '$log', function ($resource, $q, $log) {
        return new ResetPasswordService($resource, $q, $log);
    }]);
//# sourceMappingURL=resetPasswordService.js.map