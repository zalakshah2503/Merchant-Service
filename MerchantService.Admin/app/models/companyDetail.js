var Model;
(function (Model) {
    var CompanyDetail = (function () {
        function CompanyDetail() {
            this.CPOConfigurations = new Array();
            var newObj = new Model.CPOAdditionalCost();
            newObj.AdditionalCostType = "Delivery";
            newObj.Id = 1;
            this.CPOConfigurations.push(newObj);
            newObj = new Model.CPOAdditionalCost();
            newObj.AdditionalCostType = "Cooling";
            newObj.Id = 2;
            this.CPOConfigurations.push(newObj);
        }
        return CompanyDetail;
    }());
    Model.CompanyDetail = CompanyDetail;
    var CPOAdditionalCost = (function () {
        function CPOAdditionalCost() {
        }
        return CPOAdditionalCost;
    }());
    Model.CPOAdditionalCost = CPOAdditionalCost;
})(Model || (Model = {}));
//# sourceMappingURL=companyDetail.js.map