var statusService = (function () {
    function statusService($resource, $log) {
        this.$resource = $resource;
        this.$log = $log;
        this.getStatus = this.$resource(apiPaths.getallStatus);
        this.updateStatus = this.$resource(apiPaths.updateStatusDetails, { statusTypeDetails: '@statusTypeDetails' }, { update: { method: "PUT" } });
        this.saveStatus = this.$resource(apiPaths.saveStatusDetails);
    }
    statusService.prototype.getallStatus = function () {
        return this.getStatus.query().$promise;
    };
    statusService.prototype.updateStatusDetails = function (statusTypeDetails) {
        return this.updateStatus.update(statusTypeDetails).$promise;
    };
    statusService.prototype.saveStatusDetails = function (statusTypeDetails) {
        return this.saveStatus.save(statusTypeDetails).$promise;
    };
    return statusService;
}());
app.service("statusService", ['$resource', '$log', function ($resource, $log) {
        return new statusService($resource, $log);
    }]);
//# sourceMappingURL=statusService.js.map