
interface IspoReceivingControllerrScope extends ng.IScope {
    spoReceiving: any;
    billDiscountDays: any;
    supplierItem: any;
    branchList: any;
    getBranchList: Function;
    getSPO: Function;
    addBill: Function;
    submitBill: Function;
    clearBill: Function;
    deleteBill: Function;
    changePercentageSelection: Function;
    editBill: Function;
    isBillEdit: boolean;
    receivePermission: boolean;
    back: Function;
    tempSupplierDaysLimit: any;
    comment: any;
    receiveSPOItem: Function;
    supplierPO: any;
    branchModel: any;
    purchaseOrderItemList: any;
    isBillPanelVisible: boolean;
    billList: any;
    bill: any;
    receiveSPO: any;
    receivedItemList: any;
    popupMessage: string;
    discountDaysVisible: boolean;
    onChangeTotalDays: Function;
    days: any;
    elementList: any;
    addElement: Function;
    finalReceive: Function;
    removeElement: Function;
    onBillCPChange: Function;
    endReceiveConfirmation: any;
    spoReceivingStatusList: any;
    billAmtExceedError: any;
    ConvertBill: Function;
    checkValidBill: Function;
    billNumberReq: any;
    spoCannotBeReceive: any;
    onReceiveQuantityChange: Function;
    openSPONotSendErrorPopup: Function;
    closeSPONotSendErrorPopup: Function;
    firstTime: boolean;
    isExcessAmount: boolean;
    endReceive: any;
    validAmountError: any;
    deleteConfirmation: any;
    openEndReceiveConfirmationPopup: Function;
    closeEndReceiveConfirmationPopup: Function;
    deleteConfirmMessage: any;
    openCreateSPOPopup: Function;
    closeCreateSPOPopup: Function;
    endReceiving: Function;
    nonTransactionAmountRequired: any;
    saveBillItem: Function;
    openDeleteBillPopup: Function;
    closeDeleteBillPopup: Function;
    billId: number;
    ValidDiscountMessage: any;
    validQuantityError: any;
    validPriceError: any;
}

interface IspoReceivingController {
}

class SpoReceivingController implements IspoReceivingController {
    static controllerId = "SpoReceivingController";
    public spoNotSendErrorPopup;
    public createSPOPopup;
    public endReceiveConfirmationPopup;
    public deleteBillPopup;

    constructor(private $scope: IspoReceivingControllerrScope, private $log: ng.ILocaleService, private spoReceivingService: SpoReceivingService, public ngToast, public $rootScope, public apiPath, public $modal, public $routeParams, public $location) {
        this.$scope.spoReceiving = new Model.SPOReceiving();
        this.$scope.billDiscountDays = new Model.BillDiscountDays();
        this.$scope.supplierItem = new Model.SupplierItem();
        this.$scope.getBranchList = () => this.getBranchList();
        this.$scope.getSPO = () => this.getSPO();
        this.$scope.addBill = () => this.addBill();
        this.$scope.submitBill = () => this.submitBill();
        this.$scope.changePercentageSelection = () => this.changePercentageSelection();
        this.$scope.clearBill = () => this.clearBill();
        this.$scope.deleteBill = (BillId) => this.deleteBill(BillId);
        this.$scope.editBill = (bill) => this.editBill(bill);
        this.$scope.checkValidBill = () => this.checkValidBill();
        this.$scope.endReceive = stringConstants.endReceiving;
        this.$scope.billNumberReq = stringConstants.billNumberReq;
        this.$scope.finalReceive = () => this.finalReceive();
        this.$scope.tempSupplierDaysLimit = [];
        this.$scope.validAmountError = stringConstants.validAmountError;
        this.$scope.nonTransactionAmountRequired = stringConstants.nonTransactionAmountRequired;
        this.$scope.receiveSPOItem = (item) => this.receiveSPOItem(item);
        this.$scope.openEndReceiveConfirmationPopup = () => this.openEndReceiveConfirmationPopup();
        this.$scope.closeEndReceiveConfirmationPopup = () => this.closeEndReceiveConfirmationPopup();
        this.$scope.deleteConfirmMessage = stringConstants.deleteConfirmMessage;
        this.$scope.back = () => this.back();
        this.$scope.branchList = [];
        this.$scope.supplierPO = [];
        this.$scope.branchModel = [];
        this.$scope.billList = [];
        this.$scope.bill = [];
        this.$scope.comment = [];
        this.$scope.isExcessAmount = false;
        this.$scope.receivePermission = true;
        this.$scope.spoReceivingStatusList = [];
        this.$scope.purchaseOrderItemList = [];
        this.$scope.billAmtExceedError = stringConstants.billAmtExceedError;
        this.$scope.isBillPanelVisible = false;
        this.$scope.discountDaysVisible = false;
        this.$scope.receivedItemList = [];
        this.$scope.onBillCPChange = (poItem) => this.onBillCPChange(poItem);
        this.$scope.onReceiveQuantityChange = (poItem) => this.onReceiveQuantityChange(poItem);
        this.$scope.openSPONotSendErrorPopup = () => this.openSPONotSendErrorPopup();
        this.$scope.closeSPONotSendErrorPopup = () => this.closeSPONotSendErrorPopup();
        this.$scope.openCreateSPOPopup = () => this.openCreateSPOPopup();
        this.$scope.closeCreateSPOPopup = () => this.closeCreateSPOPopup();
        this.$scope.endReceiving = () => this.endReceiving();
        this.$scope.saveBillItem = () => this.saveBillItem();
        this.$scope.onChangeTotalDays = (days) => this.onChangeTotalDays(days);
        this.$scope.days = [];
        this.$scope.elementList = [];
        this.$scope.addElement = () => this.addElement();
        this.$scope.removeElement = () => this.removeElement();
        this.$scope.deleteConfirmation = stringConstants.deleteConfirmation;
        this.$scope.spoCannotBeReceive = stringConstants.spoCannotBeReceive;
        this.$scope.isBillEdit = false;
        this.$scope.endReceiveConfirmation = stringConstants.endReceiveConfirmation;
        this.$scope.openDeleteBillPopup = (BillId) => this.openDeleteBillPopup(BillId);
        this.$scope.closeDeleteBillPopup = () => this.closeDeleteBillPopup();
        this.$scope.ValidDiscountMessage = stringConstants.ValidDiscountMessage;
        this.$scope.validQuantityError = stringConstants.validQuantityError;
        this.$scope.validPriceError = stringConstants.validPriceError;
        this.initialize();
    }

    private initialize() {
        if (this.$routeParams.id !== null && this.$routeParams.id !== undefined && this.$routeParams.id !== "") {
            this.getBranchList();
        }
    }

    //used to fetch branchlist - jj
    private getBranchList() {
        let controllerScope = this.$scope;
        let rootScope = this.$rootScope;
        controllerScope.receivePermission = rootScope.merchatSettings.IsAllowedToReceiveSPO;
        rootScope.isLoading = true;
        let promise = this.spoReceivingService.getBranchList();
        promise.then((result) => {
            if (result.length === 0) {

            }
            else {
                for (let i = 0; i < result.length; i++) {
                    controllerScope.branchList.push({ Id: result[i].Id, Name: result[i].Name });
                }
                this.getSPO();
            }
            rootScope.isLoading = false;
        }).catch((error) => {
            if (error.status !== 500) {
                location.replace(this.apiPath);
            }
            rootScope.isLoading = false;
        });
    }

    //USED TO FETCH SPO OF THE GIVEN ID - jj
    private getSPO() {
        let id = this.$routeParams.id;
        let controllerScope = this.$scope;
        let rootScope = this.$rootScope;
        controllerScope.firstTime = true;
        let promise = this.spoReceivingService.getSPO(id);
        promise.then((result) => {
            controllerScope.supplierPO = result.SupplierPOAC;
            controllerScope.bill.IsPercentageDiscount = true;
            this.changePercentageSelection();
            controllerScope.bill.IsPercentageDiscount = false;

            if (controllerScope.supplierPO.IsSend === false) {
                this.openSPONotSendErrorPopup();
            }
            else {
                for (let i = 0; i < controllerScope.supplierPO.SPOBranch.length; i++) {
                    controllerScope.branchModel.push({ Id: controllerScope.supplierPO.SPOBranch[i].Id });
                }
                controllerScope.supplierPO.SupplierProfile = controllerScope.supplierPO.SupplierProfile;
                controllerScope.supplierPO.supplier = controllerScope.supplierPO.SupplierProfile;
                controllerScope.purchaseOrderItemList = result.POItem;
                for (let j = 0; j < result.POItem.length; j++) {
                    for (let n = 0; n < stringConstants.spoReceivingStatusList.length; n++) {
                        controllerScope.purchaseOrderItemList[j].ReceiveQuantity = controllerScope.purchaseOrderItemList[j].ReceiveQuantity;
                        controllerScope.purchaseOrderItemList[j].BillCostPrice = result.POItem[j].BillCostPrice;
                        controllerScope.purchaseOrderItemList[j].ReceiveCostPrice = controllerScope.purchaseOrderItemList[j].ReceiveCostPrice;
                        if (stringConstants.spoReceivingStatusList[n].Id === controllerScope.purchaseOrderItemList[j].SPOReceivingStatus) {
                            controllerScope.purchaseOrderItemList[j].Status = stringConstants.spoReceivingStatusList[n].Name;
                        }
                    }
                }
                if (result.SPOBill.length > 0) {
                    controllerScope.isBillPanelVisible = true;
                    for (let n = 0; n < result.SPOBill.length; n++) {
                        controllerScope.billList.push(result.SPOBill[n]);
                        controllerScope.billList[n].Id = result.SPOBill[n].BillId;
                        if (result.SPOBill[n].IsPercentageDiscount) {
                            controllerScope.billList[n].IsPercentDis = stringConstants.yes;
                        }
                        else {
                            controllerScope.billList[n].IsPercentDis = stringConstants.no;
                        }
                    }
                }
                this.calculateDiscountedCP();
            }
        }).catch((error) => {
        });

    }

    //check bill with same bill number already added
    private checkBillUnique(BillNumber, Id) {
        let controllerScope = this.$scope;
        for (let i = 0; i < controllerScope.billList.length; i++) {
            if (controllerScope.billList[i].BillNumber === BillNumber && controllerScope.billList[i].BillId !== Id) {
                controllerScope.bill.BillNumber = "";
                this.ngToast.create(
                    {
                        className: 'danger',
                        content: stringConstants.UniqueBillNo
                    });
                return false;
            }
        }
        return true;
    }

    //used to show bill panel - jj
    private addBill() {
        let controllerScope = this.$scope;
        controllerScope.isBillPanelVisible = true;
    }

    //save bill - jj
    private submitBill() {
        let controllerScope: any = this.$scope;
        let controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        let status = this.checkBillUnique(controllerScope.bill.BillNumber, controllerScope.bill.Id);
        if (status) {
            if (controllerScope.bill.IsEdit) {
                for (let k = 0; k < controllerScope.billList.length; k++) {
                    if (controllerScope.billList[k].Id === controllerScope.bill.Id) {
                        let spoBill = new Model.SPOReceivingBill();
                        spoBill.Amount = controllerScope.bill.Amount;
                        spoBill.BillComment = controllerScope.bill.BillComment;
                        spoBill.IsPercentageDiscount = controllerScope.bill.IsPercentageDiscount;
                        spoBill.BillNumber = controllerScope.bill.BillNumber;
                        spoBill.Discount = controllerScope.bill.Discount;
                        spoBill.TotalDaysLimit = controllerScope.bill.TotalDaysLimit;
                        spoBill.VerifiedDate = controllerScope.bill.VerifiedDate;
                        spoBill.SPOBillDaysLimit = controllerScope.elementList;
                        spoBill.BillId = controllerScope.bill.Id;
                        spoBill.PurchaseOrderId = this.$routeParams.id;
                        if (controllerScope.billDiscountDays !== undefined && controllerScope.billDiscountDays !== null) {
                            if (controllerScope.billDiscountDays.Days > 0 && controllerScope.billDiscountDays.Discount > 0) {
                                spoBill.BillDaysLimitDiscount = controllerScope.billDiscountDays.Discount;
                                spoBill.Days = controllerScope.billDiscountDays.Days;
                            }
                        }
                        let promise = this.spoReceivingService.addSPOBill(spoBill);
                        promise.then((result) => {
                            if (result !== null && result.Id !== undefined && result.Id > 0) {
                                for (let j = 0; j < controllerScope.billList.length; j++) {
                                    if (controllerScope.billList[j].Id === result.Id) {
                                        spoBill.Id = result.Id;
                                        spoBill.BillId = result.Id;
                                        if (spoBill.IsPercentageDiscount) {
                                            spoBill.IsPercentDis = stringConstants.yes;
                                        }
                                        else {
                                            spoBill.IsPercentDis = stringConstants.no;
                                            spoBill.IsPercentageDiscount = false;
                                        }
                                        let tempList = [];
                                        if (controllerScope.billDiscountDays !== undefined && controllerScope.billDiscountDays !== null) {
                                            if (controllerScope.billDiscountDays.Days > 0 && controllerScope.billDiscountDays.Discount > 0) {
                                                tempList.push({ Days: controllerScope.billDiscountDays.Days, Discount: controllerScope.billDiscountDays.Discount });
                                            }
                                        }
                                        for (let e = 0; e < controllerScope.elementList.length; e++) {
                                            tempList.push(controllerScope.elementList[e]);
                                        }
                                        controllerScope.elementList = [];
                                        controllerScope.elementList = tempList;
                                        spoBill.SPOBillDaysLimit = controllerScope.elementList;
                                        controllerScope.billList[j] = spoBill;
                                    }
                                }
                                this.ngToast.create(stringConstants.BillUpdated);
                                this.calculateDiscountedCP();
                                this.clearBill();
                                controllerRootScope.isLoading = false;
                            }
                            else {
                                controllerRootScope.isLoading = false;
                                this.ngToast.create(
                                    {
                                        className: 'danger',
                                        content: stringConstants.BillUpdateFailed
                                    });
                            }
                        }).catch((error) => {
                            this.ngToast.create(
                                {
                                    className: 'danger',
                                    content: stringConstants.BillUpdateFailed
                                });
                            controllerRootScope.isLoading = false;
                        });
                    }
                }
                controllerScope.bill.IsEdit = false;
            }
            else {
                if (controllerScope.elementList !== undefined && controllerScope.elementList !== null) {
                    if (controllerScope.elementList.length > 0) {
                        controllerScope.bill.SPOBillDaysLimit = controllerScope.elementList;
                    }
                }
                let spoBill = new Model.SPOReceivingBill();
                spoBill.Amount = controllerScope.bill.Amount;
                spoBill.BillComment = controllerScope.bill.BillComment;
                spoBill.IsPercentageDiscount = controllerScope.bill.IsPercentageDiscount;
                spoBill.BillNumber = controllerScope.bill.BillNumber;
                spoBill.Discount = controllerScope.bill.Discount;
                spoBill.TotalDaysLimit = controllerScope.bill.TotalDaysLimit;
                spoBill.VerifiedDate = controllerScope.bill.VerifiedDate;
                spoBill.SPOBillDaysLimit = controllerScope.bill.SPOBillDaysLimit;
                spoBill.PurchaseOrderId = this.$routeParams.id;
                if (controllerScope.billDiscountDays !== undefined && controllerScope.billDiscountDays !== null) {
                    if (controllerScope.billDiscountDays.Days > 0 && controllerScope.billDiscountDays.Discount > 0) {
                        spoBill.BillDaysLimitDiscount = controllerScope.billDiscountDays.Discount;
                        spoBill.Days = controllerScope.billDiscountDays.Days;
                    }
                }
                let promise = this.spoReceivingService.addSPOBill(spoBill);
                promise.then((result) => {
                    if (result !== null && result !== undefined && result.Id > 0) {
                        if (spoBill.IsPercentageDiscount) {
                            spoBill.IsPercentDis = stringConstants.yes;
                        }
                        else {
                            spoBill.IsPercentDis = stringConstants.no;
                        }
                        if (controllerScope.billDiscountDays !== undefined && controllerScope.billDiscountDays !== null) {
                            if (controllerScope.billDiscountDays.Days > 0 && controllerScope.billDiscountDays.Discount > 0) {
                                controllerScope.elementList.push({ Days: controllerScope.billDiscountDays.Days, Discount: controllerScope.billDiscountDays.Discount });
                            }
                        }
                        spoBill.SPOBillDaysLimit = controllerScope.elementList;
                        spoBill.BillId = result.Id;
                        spoBill.Id = result.Id;
                        controllerScope.billList.push(spoBill);
                        this.ngToast.create(stringConstants.BillAdded);
                        controllerRootScope.isLoading = false;
                        this.calculateDiscountedCP();
                        this.clearBill();
                    }
                    else {
                        controllerRootScope.isLoading = false;
                        this.ngToast.create(
                            {
                                className: 'danger',
                                content: stringConstants.BillAddedFailed
                            });
                    }
                }).catch((error) => {
                    this.ngToast.create(
                        {
                            className: 'danger',
                            content: stringConstants.BillAddedFailed
                        });
                    controllerRootScope.isLoading = false;
                });
            }
        }
        else {
            controllerRootScope.isLoading = false;
        }
    }


    //used to check whether bill is valid - jj
    private checkValidBill() {
        let controllerScope = this.$scope;
        let totalDays = 0;
        if (controllerScope.bill.Amount === undefined || controllerScope.bill.Amount === null || !(controllerScope.bill.Amount > 0)) {
            return true;
        }
        else {
            if (!controllerScope.supplierPO.IsCashPO && controllerScope.bill.IsPercentageDiscount) {
                totalDays = totalDays + controllerScope.billDiscountDays.Days;
                if (controllerScope.elementList !== undefined && controllerScope.elementList !== null && controllerScope.elementList.length > 0) {
                    for (let i = 0; i < controllerScope.elementList.length; i++) {
                        totalDays = totalDays + controllerScope.elementList[i].Days;
                    }
                }
                if (totalDays > controllerScope.bill.TotalDaysLimit) {
                    return true;
                }
                else {
                    return false;
                }
            }
        }
    }

    //used to calculate the discounted receiving cost price of the purchase order items - jj
    private calculateDiscountedCP() {
        let controllerScope = this.$scope;
        if (controllerScope.billList.length === 0) {
            for (let i = 0; i < controllerScope.purchaseOrderItemList.length; i++) {
                controllerScope.purchaseOrderItemList[i].ReceiveCostPrice = controllerScope.purchaseOrderItemList[i].BillCostPrice;
                controllerScope.purchaseOrderItemList[i].SPOReceivingStatus = 1;
                controllerScope.purchaseOrderItemList[i].Status = stringConstants.spoReceivingStatusList[1].Name;
            }
        }
        else {
            let weightedPercent = 0;
            let percentDiscount = 0;
            let billCount = 0;
            for (let j = 0; j < controllerScope.billList.length; j++) {
                if (controllerScope.billList[j].Discount !== undefined && controllerScope.billList[j].Discount !== null && controllerScope.billList[j].Discount > 0) {
                    billCount++;
                    if (controllerScope.billList[j].IsPercentageDiscount) {
                        percentDiscount = percentDiscount + controllerScope.billList[j].Discount;
                    }
                    else {
                        percentDiscount = percentDiscount + ((100 * controllerScope.billList[j].Discount) / controllerScope.billList[j].Amount);
                    }
                }
            }
            if (billCount > 0) {
                weightedPercent = percentDiscount / billCount;
            }
            for (let i = 0; i < controllerScope.purchaseOrderItemList.length; i++) {
                if (controllerScope.purchaseOrderItemList[i].BillCostPrice !== undefined && controllerScope.purchaseOrderItemList[i].BillCostPrice !== null && controllerScope.purchaseOrderItemList[i].BillCostPrice > 0) {
                    // i have written this line of code bcoz 
                    //i have to calculate the new receivingcostprice(in ui discouted cp) depending on the billcostprice(in ui receive cp)
                    //i have used ReceivingCostPrice bcoz it's what gets updated n not OrderCostPrice or BillCostPrice
                    controllerScope.purchaseOrderItemList[i].ReceiveCostPrice = controllerScope.purchaseOrderItemList[i].BillCostPrice;
                    if (controllerScope.firstTime) {
                    }
                    else {
                        controllerScope.purchaseOrderItemList[i].SPOReceivingStatus = 1;
                        controllerScope.purchaseOrderItemList[i].Status = stringConstants.spoReceivingStatusList[1].Name;
                    }
                    controllerScope.purchaseOrderItemList[i].ReceiveCostPrice = controllerScope.purchaseOrderItemList[i].ReceiveCostPrice - ((controllerScope.purchaseOrderItemList[i].ReceiveCostPrice * weightedPercent) / 100);
                    controllerScope.purchaseOrderItemList[i].ReceiveCostPrice = this.roundToTow(controllerScope.purchaseOrderItemList[i].ReceiveCostPrice);
                }
                else {
                    controllerScope.purchaseOrderItemList[i].ReceiveCostPrice = 0;
                }
            }
        }
        controllerScope.firstTime = false;
    }


    //clear the bill panel - JJ
    private clearBill() {
        let controllerScope = this.$scope;
        controllerScope.bill.IsEdit = false;
        controllerScope.bill.Discount = "";
        controllerScope.bill = [];
        controllerScope.elementList = [];
        controllerScope.days = [];
        if (controllerScope.billDiscountDays !== null || controllerScope.billDiscountDays !== undefined) {
            controllerScope.billDiscountDays = new Model.BillDiscountDays();
        }
        controllerScope.discountDaysVisible = false;
        controllerScope.receiveSPO.$setPristine();
        controllerScope.receiveSPO.$setValidity();
        controllerScope.receiveSPO.$setUntouched();
    }

    //delete bill from grid
    private deleteBill(BillId) {
        let controllerScope = this.$scope;
        let controllerRootScope = this.$rootScope;
        this.closeDeleteBillPopup();
        controllerRootScope.isLoading = true;
        let promise = this.spoReceivingService.deleteSPOBill(BillId);
        promise.then((result) => {
            if (result !== null && result !== undefined && result.status === true) {
                let tempList = controllerScope.billList;
                controllerScope.billList = [];
                for (let i = 0; i < tempList.length; i++) {
                    if (tempList[i].BillId === BillId) {
                    }
                    else {
                        controllerScope.billList.push(tempList[i]);
                    }
                }
                this.ngToast.create(stringConstants.BillDeleted);
                this.calculateDiscountedCP();
                controllerRootScope.isLoading = false;
            }
            else {
                controllerRootScope.isLoading = false;
                this.ngToast.create(
                    {
                        className: 'danger',
                        content: stringConstants.BillDeletedFailed
                    });
            }
            controllerRootScope.isLoading = false;
        }).catch((error) => {
            this.ngToast.create(
                {
                    className: 'danger',
                    content: stringConstants.BillDeletedFailed
                });
            controllerRootScope.isLoading = false;
        });
    }


    //delete bill from grid- jj
    private editBill(bill) {
        let controllerScope = this.$scope;
        let templist = [];
        if (bill.BillId === controllerScope.bill.Id) {
        }
        else {
            controllerScope.bill.Id = bill.Id;
            controllerScope.bill.Id = bill.BillId;
            controllerScope.bill.BillNumber = bill.BillNumber;
            controllerScope.bill.Amount = bill.Amount;
            controllerScope.bill.Discount = bill.Discount;
            controllerScope.bill.IsPercentageDiscount = bill.IsPercentageDiscount;
            controllerScope.bill.BillComment = bill.BillComment;

            controllerScope.bill.TotalDaysLimit = bill.TotalDaysLimit;
            if (bill.SPOBillDaysLimit) {
                templist = bill.SPOBillDaysLimit;
                controllerScope.discountDaysVisible = true;
            }
            else {
                controllerScope.discountDaysVisible = false;
            }
            controllerScope.bill.IsEdit = true;
            bill.IsEdit = true;
            controllerScope.isBillEdit = true;

            if (bill.TotalDaysLimit > 0) {
                this.onChangeTotalDays(bill.TotalDaysLimit);
            }

            for (let i = 0; i < templist.length; i++) {
                controllerScope.billDiscountDays.Days = templist[i].Days;
                controllerScope.billDiscountDays.Discount = templist[i].Discount;
                break;
            }
            controllerScope.elementList = [];
            for (let i = 1; i < templist.length; i++) {
                controllerScope.elementList.push({ Days: templist[i].Days, Discount: templist[i].Discount });
            }
        }
    }




    //used to receive spo item
    private receiveSPOItem(item) {
        let controllerScope = this.$scope;
        item.PurchaseOrderId = this.$routeParams.id;
        if (item.SPOReceivingStatus === 0) {
            this.ngToast.create(stringConstants.AlreadyItemReceived);
        }
        else {
            if (item.ReceiveQuantity === undefined || item.ReceiveQuantity === "" || item.ReceiveQuantity === null || item.ReceiveQuantity <= 0) {
                this.ngToast.create(
                    {
                        className: 'danger',
                        content: stringConstants.NotReceiveQuantity.replace(/{ReceiveQuantity}/, item.ReceiveQuantity)
                    });
            }
            else {
                if (item.ReceiveCostPrice === undefined || item.ReceiveCostPrice === "" || item.ReceiveCostPrice === null || item.ReceiveCostPrice <= 0) {
                    this.ngToast.create(
                        {
                            className: 'danger',
                            content: stringConstants.NotReceiveCostPrice.replace(/{ReceiveCostPrice}/, item.ReceiveCostPrice)
                        });
                }
                else {
                    let controllerRootScope = this.$rootScope;
                    controllerRootScope.isLoading = true;
                    let promise = this.spoReceivingService.receiveSPOItem(item);
                    promise.then((result) => {
                        if (result.status === 0 || result.status === 1 || result.status === 2) {
                            item.SPOReceivingStatus = result.status;
                            if (item.SPOReceivingStatus === 0) {
                                if (item.OrderQuantity > item.ReceiveQuantity) {
                                    item.SPOReceivingStatus = 2;
                                    this.ngToast.create(stringConstants.ItemReceivedPartially);
                                }
                                else {
                                    this.ngToast.create(stringConstants.ItemReceived);
                                }
                            }
                            else if (item.SPOReceivingStatus === 1) {
                                this.ngToast.create(stringConstants.ItemNotReceived);
                            }

                            for (let i = 0; i < stringConstants.spoReceivingStatusList.length; i++) {
                                if (stringConstants.spoReceivingStatusList[i].Id === item.SPOReceivingStatus) {
                                    item.Status = stringConstants.spoReceivingStatusList[i].Name;
                                    item.SPOReceivingStatus = stringConstants.spoReceivingStatusList[i].Id;
                                }
                            }
                        }
                        else if (result.status === 300) {
                            this.ngToast.create(
                                {
                                    className: 'danger',
                                    content: stringConstants.itemNotReceived.replace(/{ItemName}/, item.ItemNameEn)
                                });
                        }
                        else if (result.status === 400) {
                            this.ngToast.create(
                                {
                                    className: 'danger',
                                    content: stringConstants.workFlowNotCreated
                                });
                        }
                        else if (result.status === 401) {
                            this.ngToast.create(
                                {
                                    className: 'danger',
                                    content: stringConstants.itemNotReceived.replace(/{ItemName}/, item.ItemNameEn)
                                });
                        }
                        else {
                            this.ngToast.create(
                                {
                                    className: 'danger',
                                    content: stringConstants.ItemNotReceived
                                });
                        }

                        controllerRootScope.isLoading = false;
                    }).catch((error) => {
                        this.ngToast.create(
                            {
                                className: 'danger',
                                content: stringConstants.ItemNotReceived
                            });
                        controllerRootScope.isLoading = false;
                    });
                }
            }
        }
    }




    //used to redirect to Supplier Purchase Order WorkList - jj
    private back() {
        let x = this;
        x.$location.path("/SupplierPOWorkList/");
    }


    //used to calculate Discounted Received Cost Price
    private onBillCPChange(poItem) {
        let controllerScope = this.$scope;
        poItem.SPOReceivingStatus = 1;
        let totalQuantity = 0;
        poItem.Status = stringConstants.spoReceivingStatusList[1].Name;
        controllerScope.firstTime = true;
        this.calculateDiscountedCP();
    }


    //used to whether received quantity more than requested quantity
    private onReceiveQuantityChange(poItem) {
        let controllerScope = this.$scope;
        poItem.ReceiveQuantity = Math.round(poItem.ReceiveQuantity);
        if (poItem.ReceiveQuantity === undefined || poItem.ReceiveQuantity === "" || poItem.ReceiveQuantity === null || poItem.ReceiveQuantity <= 0) {
            poItem.SPOReceivingStatus = 1;
            poItem.Status = stringConstants.spoReceivingStatusList[1].Name;
        }
        else {
            if (poItem.OrderQuantity < poItem.ReceiveQuantity) {
                poItem.ReceiveQuantity = poItem.OrderQuantity;
                controllerScope.popupMessage = stringConstants.ReceivingQtyNotMoreThanOrderedQty;
                this.openCreateSPOPopup();
            }
            else if (poItem.OrderQuantity > poItem.ReceiveQuantity) {
                if (poItem.SPOReceivingStatus === 1) {
                }
                else {
                    poItem.SPOReceivingStatus = 2;
                    poItem.Status = stringConstants.spoReceivingStatusList[2].Name;
                }
            }
        }
        this.calculateDiscountedCP();
    }

    //used to open SPONotSendErrorPopup
    private openSPONotSendErrorPopup() {
        let controllerScope = this.$scope;
        this.spoNotSendErrorPopup = this.$modal.open({
            templateUrl: 'SPONotSendErrorPopup',
            backdrop: 'static',
            keyboard: true,
            scope: this.$scope,
        });
    }

    //used to close SPONotSendErrorPopup
    private closeSPONotSendErrorPopup() {
        this.spoNotSendErrorPopup.dismiss('cancel');
        this.back();
    }

    //used to open CreateSPOPopup - jj
    private openCreateSPOPopup() {
        let controllerScope = this.$scope;
        this.createSPOPopup = this.$modal.open({
            templateUrl: 'CreateSPOPopup',
            backdrop: 'static',
            keyboard: true,
            scope: this.$scope,
        });
    }

    //used to close CreateSPOPopup - jj
    private closeCreateSPOPopup() {
        this.createSPOPopup.dismiss('cancel');
    }


    //used to open EndReceiveConfirmationPopup - jj
    private openEndReceiveConfirmationPopup() {
        let controllerScope = this.$scope;
        controllerScope.popupMessage = stringConstants.AfterReceivingProcessMsg;
        this.endReceiveConfirmationPopup = this.$modal.open({
            templateUrl: 'EndReceiveConfirmationPopup',
            backdrop: 'static',
            keyboard: true,
            scope: this.$scope,
        });
    }

    //used to close EndReceiveConfirmationPopup - jj
    private closeEndReceiveConfirmationPopup() {
        this.endReceiveConfirmationPopup.dismiss('cancel');
    }


    //used to submit details to database - jj
    private endReceiving() {
        let controllerScope = this.$scope;
        let controllerRootScope = this.$rootScope;
        this.closeEndReceiveConfirmationPopup();
        let billTotal = 0;
        let itemTotalAmount = 0;
        let status = 0;
        let templist = [];
        for (let j = 0; j < controllerScope.purchaseOrderItemList.length; j++) {
            if (controllerScope.purchaseOrderItemList[j].SPOReceivingStatus === 1) {
                if (controllerScope.purchaseOrderItemList[j].IsIcrGenerated) {
                    status = 1;
                    break;
                }
            }
            else {
                itemTotalAmount = itemTotalAmount + (controllerScope.purchaseOrderItemList[j].ReceiveQuantity * controllerScope.purchaseOrderItemList[j].ReceiveCostPrice);
            }
        }
        if (status === 1) {
            itemTotalAmount = 0;
            controllerScope.popupMessage = stringConstants.EndReceivingNotPerformed;
            this.openCreateSPOPopup();
        }
        else {
            itemTotalAmount = this.roundToTow(itemTotalAmount);
            for (let i = 0; i < controllerScope.billList.length; i++) {
                billTotal = parseFloat("" + billTotal) + parseFloat("" + controllerScope.billList[i].Amount);
            }
            billTotal = this.roundToTow(billTotal);
            let difference = 0;
            if (billTotal > itemTotalAmount) {
                difference = billTotal - itemTotalAmount;
                controllerScope.isExcessAmount = true;
            }
            else {
                controllerScope.isExcessAmount = false;
                difference = itemTotalAmount - billTotal;
            }
            if (!controllerScope.isExcessAmount) {
                if (billTotal === itemTotalAmount) {
                    this.finalReceive();
                }
                else {
                    controllerScope.popupMessage = stringConstants.AmountofBillNotMatched;
                    this.openCreateSPOPopup();
                }
            }
            else {
                controllerScope.popupMessage = stringConstants.BillAmountDifference.replace(/{difference}/, difference.toString());
                this.openEndReceiveConfirmationPopup();
            }
        }
    }


    private finalReceive() {
        let controllerScope = this.$scope;
        let controllerRootScope = this.$rootScope;
        this.closeEndReceiveConfirmationPopup();
        controllerRootScope.isLoading = true;
        controllerScope.spoReceiving.SPOBill = this.ConvertBill(controllerScope.billList);
        controllerScope.spoReceiving.PurchaseOrderId = controllerScope.supplierPO.Id;
        let Comment = controllerScope.comment.Comment;
        if (Comment === null && Comment === undefined) {
            Comment = ".";
        }
        controllerScope.spoReceiving.Comment = Comment;
        let promise = this.spoReceivingService.endReceiving(controllerScope.spoReceiving);
        promise.then((result) => {
            if (result !== null && result !== undefined) {
                if (result.status) {
                    this.ngToast.create(stringConstants.ReceivedSuccessfully);
                    this.back();
                }
                else {
                    this.ngToast.create(
                        {
                            className: 'danger',
                            content: stringConstants.ReceivingFailed
                        });
                }
            }
            else {
                this.ngToast.create(
                    {
                        className: 'danger',
                        content: stringConstants.ReceivingFailed
                    });
            }
            controllerRootScope.isLoading = false;
        }).catch((error) => {
            this.ngToast.create(
                {
                    className: 'danger',
                    content: stringConstants.ReceivingFailed
                });
            controllerRootScope.isLoading = false;
        });
    }

    //used to Open DeleteBillPopup-jj
    private openDeleteBillPopup(BillId) {
        let controllerScope = this.$scope;
        this.deleteBillPopup = this.$modal.open({
            templateUrl: 'DeleteBillConfirmation',
            backdrop: 'static',
            keyboard: true,
            scope: this.$scope,
        });
        controllerScope.billId = BillId;
    }


    //used to close DeleteBillPopup-jj
    private closeDeleteBillPopup() {
        this.deleteBillPopup.dismiss('cancel');
    }


    //called when the TotalDaysLimit changes and
    private onChangeTotalDays(days) {
        let controllerScope = this.$scope;
        controllerScope.days = [];
        if (days === 0) {
            controllerScope.elementList = [];
            controllerScope.billDiscountDays = new Model.BillDiscountDays();
        }
        else {
            for (let i = 0; i < days; i++) {
                controllerScope.days[i] = { Id: i + 1, Days: i + 1 };
            }
        }
    }


    //used to dynamically add dropdown and textbox 
    private addElement() {
        let controllerScope = this.$scope;
        controllerScope.elementList.push({
        });
    }

    //used to dynamically remove dropdown and textbox 
    private removeElement() {
        let lastItem = this.$scope.elementList.length - 1;
        this.$scope.elementList.splice(lastItem);
    }


    //used to save the receiving details of SPO but not performing End Receiving - jj
    private saveBillItem() {
        let controllerScope = this.$scope;
        let controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        controllerScope.spoReceiving.POItem = controllerScope.purchaseOrderItemList;
        controllerScope.spoReceiving.SPOBill = this.ConvertBill(controllerScope.billList);
        controllerScope.spoReceiving.SupplierPOAC = controllerScope.supplierPO;
        controllerScope.spoReceiving.PurchaseOrderId = controllerScope.spoReceiving.SupplierPOAC.Id;
        let promise = this.spoReceivingService.saveSPOBillItem(controllerScope.spoReceiving);
        promise.then((result) => {
            if (result !== null && result !== undefined) {
                if (result.status) {
                    this.ngToast.create(stringConstants.SavedSuccessfully);
                    this.back();
                }
                else {
                    this.ngToast.create(
                        {
                            className: 'danger',
                            content: stringConstants.SavedFailed
                        });
                }
            }
            else {
                this.ngToast.create(
                    {
                        className: 'danger',
                        content: stringConstants.SavedFailed
                    });
            }
            controllerRootScope.isLoading = false;

        }).catch((error) => {
            this.ngToast.create(
                {
                    className: 'danger',
                    content: stringConstants.SavedFailed
                });
            controllerRootScope.isLoading = false;
        });
    }


    private ConvertBill(billList) {
        let controllerScope = this.$scope;
        let temp = [];
        for (let i = 0; i < billList.length; i++) {
            if (billList[i].TotalDaysLimit > 0) {
                temp.push({
                    BillNumber: billList[i].BillNumber, Amount: billList[i].Amount, BillComment: billList[i].BillComment,
                    Discount: billList[i].Discount, IsPercentageDiscount: billList[i].IsPercentageDiscount,
                    TotalDaysLimit: billList[i].TotalDaysLimit, SPOBillDaysLimit: billList[i].SPOBillDaysLimit
                });
            }
            else {
                temp.push({
                    BillNumber: billList[i].BillNumber, Amount: billList[i].Amount,
                    Discount: billList[i].Discount, IsPercentageDiscount: billList[i].IsPercentageDiscount, BillComment: billList[i].BillComment
                });
            }
        }
        return temp;
    }

    private changePercentageSelection() {
        let controllerScope = this.$scope;
        if (controllerScope.bill.IsPercentageDiscount) {
            if (controllerScope.supplierPO.DiscountDays !== undefined && controllerScope.supplierPO.DiscountDays !== null && controllerScope.supplierPO.DiscountDays.length > 0) {
                controllerScope.tempSupplierDaysLimit = controllerScope.supplierPO.DiscountDays;
                controllerScope.discountDaysVisible = true;
            }
            if (controllerScope.supplierPO.TotalDaysLimit > 0) {
                controllerScope.bill.TotalDaysLimit = controllerScope.supplierPO.TotalDaysLimit;
                this.onChangeTotalDays(controllerScope.supplierPO.TotalDaysLimit);
            }
            for (let i = 0; i < controllerScope.tempSupplierDaysLimit.length; i++) {
                controllerScope.billDiscountDays.Days = controllerScope.tempSupplierDaysLimit[i].Days;
                controllerScope.billDiscountDays.Discount = controllerScope.tempSupplierDaysLimit[i].Discount;
                break;
            }
            controllerScope.elementList = [];
            for (let i = 1; i < controllerScope.tempSupplierDaysLimit.length; i++) {
                controllerScope.elementList.push({ Days: controllerScope.tempSupplierDaysLimit[i].Days, Discount: controllerScope.tempSupplierDaysLimit[i].Discount });
            }
        }
        else {
            controllerScope.bill.TotalDaysLimit = 0;
            controllerScope.billDiscountDays = [];
            controllerScope.elementList = [];
        }
    }

    //Method to Round value upto 2 decimal digits
    private roundToTow(value) {
        if (value !== null && value !== undefined) {
            return (Math.round((value + 0.00001) * 100) / 100);
        }
        return value;
    }
}

app.controller(SpoReceivingController.controllerId, ['$scope', '$log', 'SpoReceivingService', 'ngToast', '$rootScope', 'apiPath', '$modal', '$routeParams', '$location', ($scope, $log, SpoReceivingService, ngToast, $rootScope, apiPath, $modal, $routeParams, $location) => {
    return new SpoReceivingController($scope, $log, SpoReceivingService, ngToast, $rootScope, apiPath, $modal, $routeParams, $location);
}]);

