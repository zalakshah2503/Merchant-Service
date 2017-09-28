/// <reference path="../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../scripts/typings/angularjs/angular-route.d.ts" />
/// <reference path="../../scripts/typings/angularjs/angular-resource.d.ts" />
/// <reference path="../services/roleservice.ts" />


interface IRoleControllerScope extends ng.IScope {
    role: Model.Role;
    addRole: Function;
    roleList: any;
    getRoleList: Function;
    isAdd: boolean;
    addNewRole: Function;
    isAddRolePanelVisible: boolean;
    cancelRole: Function;
    editRole: Function;
    roleRequired: any;
    submitted: boolean;
    isRoleNameExist: boolean;
    roleNameExist: any;
    isLoading: boolean;
    isRoleListGridVisible: boolean;
    deleteRole: Function;
    roleNotDeleted: any;
    deleteError: boolean;

    openDeleteRolePopup: Function;
    closeDeleteRolePopup: Function;

    checkCompanyCreated: Function;
    isCompanyCreated: boolean;
}
interface IRoleController {

}
class RoleController implements IRoleController {
    static controllerId = "RoleController";
    public deleteRolePopup;

    constructor(private $scope: IRoleControllerScope, private $log: ng.ILogService, private roleService: RoleService, private ngToast, private $rootScope, public $modal) {
        this.$scope.role = new Model.Role();
        this.$scope.addRole = () => this.addRole();
        this.$scope.roleList = [];
        this.$scope.getRoleList = () => this.getRoleList();
        this.$scope.addNewRole = () => this.addNewRole();
        this.$scope.cancelRole = () => this.cancelRole();
        this.$scope.editRole = (id, roleName, roleNameSl) => this.editRole(id, roleName, roleNameSl);
        this.$scope.roleRequired = stringConstants.roleRequired;
        this.$scope.roleNameExist = stringConstants.roleNameExist;
        this.$scope.isRoleListGridVisible = true;
        this.$scope.deleteRole = (id) => this.deleteRole(id);
        this.$scope.roleNotDeleted = stringConstants.roleNotDeleted;
        this.$scope.deleteError = false;
        this.$scope.checkCompanyCreated =()=> this.checkCompanyCreated();

        this.$scope.openDeleteRolePopup = (role) => this.openDeleteRolePopup(role);
        this.$scope.closeDeleteRolePopup = () => this.closeDeleteRolePopup();
        this.$scope.isCompanyCreated = true;
        this.initialization();
    }

    private initialization() {
        this.checkCompanyCreated();
    }
    
    private checkCompanyCreated() {
        let controllerScope = this.$scope;
        let promise = this.roleService.CheckCompanyCreatedOrNot();
        promise.then((result) => {
            if (result.CompanyId === 0) {
                controllerScope.isCompanyCreated = true;
            }
            else {
                controllerScope.isCompanyCreated = false;
            }
        }).catch((error) => {

        });
    }

    ///display add role panel
    public addNewRole() {
        let scope = this.$scope;
        scope.isAdd = true;
        scope.isAddRolePanelVisible = true;
        scope.isRoleListGridVisible = false;
    }

    ///clear role textbox and close add role panel
    public cancelRole() {
        let scope = this.$scope;
        scope.role = new Model.Role();
        scope.isAddRolePanelVisible = false;
        scope.isRoleListGridVisible = true;
        scope.submitted = false;
        scope.isRoleNameExist = false;
        this.$rootScope.isLoading = false;
    }

    ///add role in database
    public addRole() {
        let scope = this.$scope;
        this.$rootScope.isLoading = true;
        let promise = this.roleService.saveRoleInfo(scope.role);
        promise.then((result) => {
            if (result.isRoleNameExist !== undefined && result.isRoleNameExist !== null) {

                scope.isRoleNameExist = true;
                this.$rootScope.isLoading = false;
                return;
            }
            if (scope.isAdd) {

                scope.roleList.push({ Id: result.Id, RoleName: result.RoleName, RoleNameSl: result.RoleNameSl });
                this.cancelRole();
                this.ngToast.create(stringConstants.roleAdded);
            }
            else {

                for (let i = 0; i < scope.roleList.length; i++) {
                    if (result.Id === scope.roleList[i].Id) {
                        scope.roleList[i].RoleName = result.RoleName;
                        scope.roleList[i].RoleNameSl = result.RoleNameSl;
                        this.cancelRole();
                        this.ngToast.create(stringConstants.roleUpdated);
                    }

                }
            }


        }).catch((error) => {

            if (error.status === 0 || error.status === 500) {

            }
             
            else {
                location.replace('/');
            }
            //  scope.isLoading = false;
            this.$log.log(error);
            });
        this.$rootScope.isLoading = false;
    }
    
    ///bind data for edit role
    public editRole(id, roleName, roleNameSl) {
        let scope = this.$scope;
        scope.isAdd = false;
        scope.isAddRolePanelVisible = true;
        scope.isRoleListGridVisible = false;
        scope.role.Id = id;
        scope.role.RoleName = roleName;
        scope.role.RoleNameSl = roleNameSl;

    }

    //get role list
    public getRoleList() {
        let scope = this.$scope;
        this.$rootScope.isLoading = true;
        let promise = this.roleService.getRoleList();
        promise.then((result) => {
            for (let i = 0; i < result.length; i++) {
                scope.roleList.push({ Id: result[i].Id, RoleName: result[i].RoleName, RoleNameSl: result[i].RoleNameSl  });

            }
            this.$rootScope.isLoading = false;
        }).catch((error) => {
            this.$log.log(error);
            this.$rootScope.isLoading = false;

        });
    }

    private deleteRole(id) {
        let controllerScope = this.$scope;
        this.$rootScope.isLoading = true;
        let promise = this.roleService.deleteRole(id);
        promise.then((result) => {
            let i = 0;
            if (result.DeleteError === "error") {
                controllerScope.deleteError = true;
                this.ngToast.create("Role Cannot Be Deleted");
            }
            else if (result.DeleteError === "") {
                this.ngToast.create("Role Deleted");
            }
            else {
                controllerScope.deleteError = true;
                this.ngToast.create(result.DeleteError);
            }
            this.$rootScope.isLoading = false;
            this.closeDeleteRolePopup();
            window.location.assign('#ManageRole');
        }).catch((error) => {
            this.$log.log(error);
            this.$rootScope.isLoading = false;
        });
    }



    private openDeleteRolePopup(role) {
        let controllerScope = this.$scope;
        this.deleteRolePopup = this.$modal.open({
            templateUrl: 'DeleteRolePopup',
            backdrop: 'static',
            keyboard: true,
            scope: this.$scope,
        });
        controllerScope.role = role;
    }

    private closeDeleteRolePopup() {
        this.deleteRolePopup.dismiss('cancel');
    }
}

app.controller(RoleController.controllerId, ['$scope', '$log', 'RoleService', 'ngToast', '$rootScope', '$modal', ($scope, $log, roleService, ngToast, $rootScope, $modal) => {

    return new RoleController($scope, $log, roleService, ngToast, $rootScope, $modal);

}]);  