

    interface IstatusService {
        getallStatus: () => void;
        updateStatusDetails: (statusTypeDetails: Model.StatusType) => void;
        saveStatusDetails: (statusTypeDetails:Model.StatusType) => void;
    }
    
    class statusService implements IstatusService {
        public getStatus;
        public updateStatus;
        public saveStatus;
        constructor(private $resource: ng.resource.IResourceService, private $log: ng.ILogService) {
            this.getStatus = this.$resource(apiPaths.getallStatus);
            this.updateStatus = this.$resource(apiPaths.updateStatusDetails, { statusTypeDetails: '@statusTypeDetails' }, { update: { method: "PUT"}});
            this.saveStatus = this.$resource(apiPaths.saveStatusDetails);
        }
        getallStatus() {
            return this.getStatus.query().$promise;
        }
        updateStatusDetails(statusTypeDetails) {
           return this.updateStatus.update(statusTypeDetails).$promise;
        }

        saveStatusDetails(statusTypeDetails) {
            return this.saveStatus.save(statusTypeDetails).$promise;
        }
    }

    app.service("statusService", ['$resource','$log', ($resource,$log) => {
        return new statusService($resource,$log);
    }]);