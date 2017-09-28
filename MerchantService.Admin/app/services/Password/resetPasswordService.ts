/// <reference path="../../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular-route.d.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular-resource.d.ts" />

    interface IResetPasswordService {
        resetUserPassword: (userId) => void;
        getAllUserList: () => void;
    }
    
    class ResetPasswordService implements IResetPasswordService {
        static serviceId = "ResetPasswordService";
        private $resource;
        private $q;
        private $log;
        public resetPassword;
        public userList;

        constructor($resource: ng.resource.IResourceService, $q: ng.IQService, $log: ng.ILogService) {
            this.$resource = $resource;
            this.$q = $q;
            this.$log = $log;
            this.$log.log('Reset Password Services Call');
            this.resetPassword = this.$resource(apiPaths.resetPassword);
            this.userList = this.$resource(apiPaths.getAllUserList);
        }

        resetUserPassword(userId) {
            return this.resetPassword.get({ userId: userId }).$promise;
        }

        getAllUserList() {
            return this.userList.query().$promise;
        }
       
    }

app.service('ResetPasswordService',['$resource', '$q', '$log', ($resource, $q, $log) => {
    return new ResetPasswordService($resource,$q,$log);
}]);