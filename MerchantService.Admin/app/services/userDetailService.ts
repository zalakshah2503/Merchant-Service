/// <reference path="../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../scripts/typings/angularjs/angular-route.d.ts" />
/// <reference path="../../scripts/typings/angularjs/angular-resource.d.ts" />

interface IUserDetailService {
    saveUser: (resource) => void;  
    getBranchList: () => void;  
    getUsersList: () => void;
    deleteUser: (id) => void;
    getUserById: (userId) => void;
    getRoleList: () => void;
  
}
class UserDetailService implements IUserDetailService {
    static serviceId = "UserDetailService";
    private $resource;
    private $q;
    private $log;
    public saveUserDetail;
    public getUser;
    public getBranch;
    public getRole;
    public getUserFromId;
    public deleteUserById;
    public getRandomEmpId;
    

    constructor($resource: ng.resource.IResourceService, $q: ng.IQService, $log: ng.ILogService) {

        this.$resource = $resource;
        this.$q = $q;
        this.$log = $log;
        this.$log.log('userDetailService Call');
        this.saveUserDetail = this.$resource(apiPaths.saveUserDetailPath);
        this.getBranch = this.$resource(apiPaths.getBranchList, {}, { query: { method: 'GET', isArray: true } });
        this.getRole = this.$resource(apiPaths.getRoleList);
        this.getUser = this.$resource(apiPaths.getUserList);
        this.getUserFromId = this.$resource(apiPaths.getUserById);
        this.deleteUserById = this.$resource(apiPaths.deleteUser, {}, { query: { method: 'GET', isArray: false } });
       
    }

    // used save user detail to database - jj
    saveUser(resource: Model.UserDetail) {
        return this.saveUserDetail.save(resource).$promise;
    }

    //used to fetch branch list from database - jj
    getBranchList() {
        return this.getBranch.query().$promise;
    }

    // used to fetch list of roles from database- jj
    getRoleList() {
        return this.getRole.query().$promise;
    }

    // used to fetch list of users from database- jj
    getUsersList() {
        return this.getUser.query().$promise;
    }

    // used to delete user with the given id- jj
    deleteUser(id) {
        return this.deleteUserById.query({ id: id }).$promise;
    }

    // used to fetch user with the given id- jj
    getUserById(userId) {
        return this.getUserFromId.get({ userId: userId }).$promise;
    }
   
}

app.service('UserDetailService', ['$resource', '$q', '$log', ($resource, $q, $log) => {
    return new UserDetailService($resource, $q, $log);
}]);  