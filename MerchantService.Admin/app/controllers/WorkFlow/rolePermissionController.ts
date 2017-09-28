// Install the angularjs.TypeScript.DefinitelyTyped NuGet package


    interface IRolePermissionControllerScope extends ng.IScope {
        getAllRolePermissionlist: Function;
        roleCollection: any;
        itemsPerPage: number;
        currentPage: number;
        maxSize: number;
        totalCollection: any;
        totalItems: any;
        addNewRoleAndPermission: Function;
        getAllPermissionsList: Function;
        permissionCollection: any;
        getAllRoleList: Function;
        roleList: any;
        saveRoleAndPermissionDetails: Function;
        permissionDetails: any;
        roleDetails: any;
        checkRoleAndPermission: Function;
        errorMessage: string;
        permissionErrorErrorMessageDisplay: boolean;
        isAddRoleAndPermissionButtonDisabled: boolean;
        editRoelAndPermission: Function;
        editRoelAndPermissionDetails: Function;
        isAdminRoleDisabled: boolean;
    }

    interface IRolePermissionController {
      
    }

    class RolePermissionController implements IRolePermissionController {
        static controllerId = "RolePermissionController";

        constructor(private $scope: IRolePermissionControllerScope, private $log: ng.ILogService, private rolePermissionService: RolePermissionService, public $rootScope, public $location: ng.ILocationService, public $routeParams, public $modal,private apiPath) {
            this.$scope.permissionDetails = new Model.Permission();
            this.$scope.getAllRolePermissionlist = () => this.getAllRolePermissionlist();
            this.$scope.itemsPerPage = 10;
            this.$scope.currentPage = 1;
            this.$scope.maxSize = 10;
            this.$scope.totalCollection = [];
            this.$scope.roleCollection = [];
            let rolePage = this.$scope.$watch("currentPage + itemPerCurrentPage", () => {
                this.$scope.totalCollection = [];
                let begin = ((this.$scope.currentPage - 1) * this.$scope.itemsPerPage),
                    end = begin + this.$scope.itemsPerPage;
                this.$scope.totalCollection = this.$scope.roleCollection.slice(begin, end);
            });
            this.$scope.addNewRoleAndPermission = () => this.addNewRoleAndPermission();
            this.$scope.getAllPermissionsList = () => this.getAllPermissionsList();
            this.$scope.permissionCollection = [];
            this.$scope.getAllRoleList = () => this.getAllRoleList();
            this.$scope.roleList = [];
            this.$scope.saveRoleAndPermissionDetails = (permission: Model.Permission,roleId: any) => this.saveRoleAndPermissionDetails(permission, roleId);
            this.$scope.roleDetails = new Model.Role();
            this.$scope.checkRoleAndPermission = (roleId: number) => this.checkRoleAndPermission(roleId);
            this.$scope.errorMessage = "";
            this.$scope.permissionErrorErrorMessageDisplay = false;
            this.$scope.isAddRoleAndPermissionButtonDisabled = false;
            this.$scope.editRoelAndPermission = (roleId : number) => this.editRoelAndPermission(roleId);
            this.$scope.isAdminRoleDisabled = false;
            this.inialization();
        }
        private inialization() {

            if (this.$routeParams.id !== null && this.$routeParams.id !== undefined && this.$routeParams.id !== "") {
                this.editRoelAndPermissionDetails();
            } else {
                this.getAllPermissionsList();
            }
                this.getAllRoleList();
        }
        private getAllRolePermissionlist() {
            let controllerScope = this.$scope;
            let controllerRootScope = this.$rootScope;
            controllerRootScope.isLoading = true;
            controllerScope.roleCollection = [];
            let rolelist = controllerScope.roleCollection;
            let promise = this.rolePermissionService.getAllRolePermissionlist();
            promise.then((result) => {
                this.$log.log("get all role permissions successfully.");
                if (result.length === 0) {
                    controllerScope.errorMessage = stringConstants.errorMessage;
                    controllerScope.permissionErrorErrorMessageDisplay = true;
                    controllerRootScope.isLoading = false;
                }
                else {
                    for (let i = 0; i < result.length; i++) {
                        rolelist.push(result[i]);
                    }
                    let that = this;
                    let begin = ((that.$scope.currentPage - 1) * that.$scope.itemsPerPage),
                        end = begin + that.$scope.itemsPerPage;
                    controllerScope.totalCollection = rolelist.slice(begin, end);
                    /* init pagination with $scope.list */
                    controllerScope.totalItems = controllerScope.roleCollection.length;
                    controllerRootScope.isLoading = false;
                }
            }).catch((error) => {
                this.$log.log(error);
                if (error.status === 500) {
                    //it shown "no record found" error messsage.
                    controllerScope.errorMessage = stringConstants.errorMessage;
                    controllerScope.permissionErrorErrorMessageDisplay = true;
                    controllerRootScope.isLoading = false;
                }
                else {
                    //if user is not authenticated that time it will redirect to the login page.
                    location.replace(this.apiPath);
                }
            });
        }

        private addNewRoleAndPermission() {
            this.$location.path("/AddRolesandPermissions");
        }

        private getAllPermissionsList() {
            let controllerScope = this.$scope;
            let controllerRootScope = this.$rootScope;
            controllerRootScope.isLoading = true;
            controllerScope.permissionCollection = [];
            let permissionList = controllerScope.permissionCollection;
            let promise = this.rolePermissionService.getAllPermissionsList();
            promise.then((result) => {
                this.$log.log("get all permissions list successfully.");
                if (result.length === 0) {
                    controllerScope.errorMessage = stringConstants.errorMessage;
                    controllerScope.permissionErrorErrorMessageDisplay = true;
                    controllerRootScope.isLoading = false;
                }
                else {
                    for (let i = 0; i < result.length; i++) {
                        permissionList.push(result[i]);
                        controllerRootScope.isLoading = false;
                    }
                }      
            }).catch((error) => {
                this.$log.log(error);
                if (error.status === 500) {
                    //it shown "no record found" error messsage.
                    controllerScope.errorMessage = stringConstants.errorMessage;
                    controllerScope.permissionErrorErrorMessageDisplay = true;
                    controllerRootScope.isLoading = false;
                }
                else {
                    //if user is not authenticated that time it will redirect to the login page.
                    location.replace(this.apiPath);
                }
            });
        }

        private getAllRoleList() {
            let controllerScope = this.$scope;
            let controllerRootScope = this.$rootScope;
            controllerScope.roleList = [];
            let roleCollection = controllerScope.roleList;
            let promise = this.rolePermissionService.getAllRoleList();
            promise.then((result) => {
                this.$log.log("get all role list successfully.");
                if (result.length === 0) {
                    controllerScope.errorMessage = stringConstants.errorMessage;
                    controllerScope.permissionErrorErrorMessageDisplay = true;
                    controllerScope.isAddRoleAndPermissionButtonDisabled = true;
                }
                else {
                    for (let i = 0; i < result.length; i++) {
                        roleCollection.push(result[i]);
                    }
                }
            }).catch((error) => {
                this.$log.log(error);
                if (error.status === 500) {
                    //it shown "no record found" error messsage.
                    controllerScope.errorMessage = stringConstants.errorMessage;
                    controllerScope.permissionErrorErrorMessageDisplay = true;
                }
                else {
                    //if user is not authenticated that time it will redirect to the login page.
                    location.replace(this.apiPath);
                }
            });
        }

        private saveRoleAndPermissionDetails(permission,roleId) {
            let controllerScope = this.$scope;
            let controllerRootScope = this.$rootScope;
            controllerScope.permissionDetails = permission;
           controllerScope.permissionDetails.RoleId = roleId.Id;
            controllerRootScope.isLoading = true;
            let promise = this.rolePermissionService.saveRoleAndPermissionDetails(controllerScope.permissionDetails);
            promise.then((result) => {
                this.$log.log("save role and permission successfully.");
                controllerRootScope.isLoading = true;
                this.$location.path("/RolesandPermissions");
            }).catch((error) => {
                this.$log.log(error);        
                    //if user is not authenticated that time it will redirect to the login page.
                    location.replace(this.apiPath);
            });
        }

        private checkRoleAndPermission(roleId) {
            let controllerScope = this.$scope;
            let controllerRootScope = this.$rootScope;
            controllerRootScope.isLoading = true;
            controllerScope.permissionCollection = [];
            let permissionList = controllerScope.permissionCollection;
            let promise = this.rolePermissionService.checkRoleAndPermission(roleId);
            promise.then((result) => {
                this.$log.log("check role and permission", result);
                for (let i = 0; i < result.length; i++) {
                    permissionList.push(result[i]);
                    controllerRootScope.isLoading = false;
                }
            }).catch((error) => {
                this.$log.log(error);        
                //if user is not authenticated that time it will redirect to the login page.
                location.replace(this.apiPath);
            });
           
        }

        private editRoelAndPermission(roleId) {
            this.$location.path("/EditRolesandPermissions/" + roleId);
        }

        private editRoelAndPermissionDetails() {
            let roleId = this.$routeParams.id;
            let controllerScope = this.$scope;
            controllerScope.isAdminRoleDisabled = true;
            let controllerRootScope = this.$rootScope;
            controllerRootScope.isLoading = true;
            controllerScope.permissionCollection = [];
            let permissionList = controllerScope.permissionCollection;
            let promise = this.rolePermissionService.checkRoleAndPermission(roleId);
            promise.then((result) => {
                this.$log.log("check role and permission", result);
                controllerScope.roleDetails.Id = roleId;
                for (let i = 0; i < result.length; i++) {
                    permissionList.push(result[i]);
                    controllerRootScope.isLoading = false;
                }
            }).catch((error) => {
                this.$log.log(error);        
                //if user is not authenticated that time it will redirect to the login page.
                location.replace(this.apiPath);
            });
        }
    }

    app.controller(RolePermissionController.controllerId, ['$scope', '$log', 'RolePermissionService', '$rootScope', '$location', '$routeParams', '$modal','apiPath', ($scope, $log, rolePermissionService,$rootScope, $location, $routeParams, $modal, apiPath) => {
        return new RolePermissionController($scope, $log, rolePermissionService, $rootScope, $location, $routeParams, $modal, apiPath);
    }]);
