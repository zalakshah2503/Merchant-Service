
    interface IstatusControllerScope extends ng.IScope {
        getallStatus: Function;
        statusCollection: any;
        statusErrorErrorMessageDisplay: boolean;
        addNewStatus: Function;
        itemsPerPage: number;
        currentPage: number;
        maxSize: number;
        totalCollection: any;
        totalItems: any;
        errorMessage: string;
        editStatus: Function;
        newStatusPanel: boolean;
        isFocusIn: boolean;
        cancelStatusDetails: Function;
        statusTypeDetails: any;
        updateStatusDetails: Function;
        isUpdateStatus: boolean;
        isStatusNameExist: boolean;
        statusErrorMessage: string;
        saveStatusDetails: Function;
    }

    interface IstatusController {
      
    }

    class statusController implements IstatusController {
        static controllerId = "statusController";

        constructor(private $scope: IstatusControllerScope, private $log: ng.ILogService, private statusService: statusService, public $rootScope, public $location: ng.ILocationService, public $routeParams, public $modal, private apiPath) {
            this.$scope.getallStatus = () => this.getallStatus();
            this.$scope.statusCollection = [];
            this.$scope.statusErrorErrorMessageDisplay = false;
            this.$scope.addNewStatus = () => this.addNewStatus();
            this.$scope.itemsPerPage = 15;
            this.$scope.currentPage = 1;
            this.$scope.maxSize = 10;
            this.$scope.errorMessage = "";
            var status = this.$scope.$watch("currentPage + itemPerCurrentPage", () => {
                this.$scope.totalCollection = [];
                var begin = ((this.$scope.currentPage - 1) * this.$scope.itemsPerPage),
                    end = begin + this.$scope.itemsPerPage;
                this.$scope.totalCollection = this.$scope.statusCollection.slice(begin, end);
            });
            this.$scope.statusTypeDetails = new Model.StatusType();
            this.$scope.editStatus = (statusId: number) => this.editStatus(statusId);
            this.$scope.newStatusPanel = false;
            this.$scope.isFocusIn = true;
            this.$scope.cancelStatusDetails = () => this.cancelStatusDetails();
            this.$scope.updateStatusDetails = (statusType: Model.StatusType) => this.updateStatusDetails(statusType);
            this.$scope.isUpdateStatus = false;
            this.$scope.isStatusNameExist = false;
            this.$scope.statusErrorMessage = "";
            this.$scope.saveStatusDetails = (statusType:Model.StatusType) => this.saveStatusDetails(statusType);
        }

        private getallStatus() {
            var controllerScope = this.$scope;
            var controllerRootScope = this.$rootScope;
            controllerRootScope.isLoading = true;
            controllerScope.statusCollection = [];
            var statusCollection = controllerScope.statusCollection;
            var promise = this.statusService.getallStatus();
            promise.then((result) => {
                if (result.length == 0){
                    controllerScope.errorMessage = stringConstants.errorMessage;
                    controllerScope.statusErrorErrorMessageDisplay = true;
                    controllerRootScope.isLoading = false;
                }
                else {
                    for (var i = 0; i < result.length; i++) {
                        statusCollection.push(result[i]);
                    }
                    var that = this;
                    var begin = ((that.$scope.currentPage - 1) * that.$scope.itemsPerPage),
                        end = begin + that.$scope.itemsPerPage;
                    controllerScope.totalCollection = statusCollection.slice(begin, end);
                    /* init pagination with $scope.list */
                    controllerScope.totalItems = controllerScope.statusCollection.length;
                    controllerRootScope.isLoading = false;
                }
            }).catch((error) => {
                this.$log.log(error);
                if (error.status == 500) {
                    //it shown "no record found" error messsage.
                    controllerScope.errorMessage = stringConstants.errorMessage;
                    controllerScope.statusErrorErrorMessageDisplay = true;
                    controllerRootScope.isLoading = false;
                }
                else {
                    //if user is not authenticated that time it will redirect to the login page.
                    location.replace(this.apiPath);
                }
            });;
        }

        private addNewStatus() {
            var controllerScope = this.$scope;
            controllerScope.newStatusPanel = true;
        }

        private editStatus(statusId) {
            var controllerScope = this.$scope;
            for (var i = 0; i < controllerScope.statusCollection.length; i++) {
             
                if (controllerScope.statusCollection[i].StatusId == statusId) {
                    controllerScope.newStatusPanel = true;
                    controllerScope.isUpdateStatus = true;
                    controllerScope.statusTypeDetails = controllerScope.statusCollection[i];
                    break;
                }
            }
        }

        private cancelStatusDetails() {
            var controllerScope: any = this.$scope;
            controllerScope.newStatusPanel = false;
            controllerScope.isUpdateStatus = false;
            controllerScope.status.$setPristine();
            controllerScope.status.$setValidity();
            controllerScope.status.$setUntouched();
        }

        private updateStatusDetails(statusType) {
            var controllerScope = this.$scope;
            var contollerRootScope = this.$rootScope;
            contollerRootScope.isLoading = true;
            var promise = this.statusService.updateStatusDetails(statusType);
            promise.then((result) => {
                this.$log.log("update status successfully");
                controllerScope.newStatusPanel = false;
                controllerScope.statusTypeDetails = new Model.StatusType();
                for (var i = 0; i < controllerScope.totalCollection.length; i++) {

                    if (controllerScope.statusCollection[i].StatusId == result.StatusId) {
                        controllerScope.newStatusPanel = false;
                        controllerScope.isUpdateStatus = false;
                        controllerScope.statusCollection[i].Name = result.Name;
                        break;
                    }
                }
                contollerRootScope.isLoading = false;
            }).catch((error) => {
                if (error.data == "") {
                    //if user is not authenticated that time it will redirect to the login page.
                    location.replace(this.apiPath);
                } else {
                    controllerScope.isStatusNameExist = true;
                    controllerScope.statusErrorMessage = error.data.ExceptionMessage;
                    }
                    contollerRootScope.isLoading = false;
                    this.$log.log(error);
            });
        }

        private saveStatusDetails(statusType) {
            var controllerScope = this.$scope;
            var contollerRootScope = this.$rootScope;
            contollerRootScope.isLoading = true;
            var promise = this.statusService.saveStatusDetails(statusType);
            promise.then((result) => {
                this.$log.log("save status successfully.");
                contollerRootScope.isLoading = false;
                controllerScope.newStatusPanel = false;
                controllerScope.isUpdateStatus = false;
                this.getallStatus();
            }).catch((error) => {
                if (error.data == "") {
                    //if user is not authenticated that time it will redirect to the login page.
                    location.replace(this.apiPath);
                } else {
                    controllerScope.isStatusNameExist = true;
                    controllerScope.statusErrorMessage = error.data.ExceptionMessage;
                }
                contollerRootScope.isLoading = false;
                this.$log.log(error);
            });

        }
    }

    app.controller(statusController.controllerId, ['$scope', '$log', 'statusService', '$rootScope', '$location', '$routeParams', '$modal', 'apiPath', ($scope, $log, statusService, $rootScope, $location, $routeParams, $modal, apiPath) => {
        return new statusController($scope, $log, statusService, $rootScope, $location, $routeParams, $modal, apiPath);
    }]);