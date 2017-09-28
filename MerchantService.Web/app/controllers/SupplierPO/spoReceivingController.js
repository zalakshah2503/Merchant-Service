var SpoReceivingController = (function () {
    function SpoReceivingController($scope, $log, spoReceivingService, ngToast, $rootScope, apiPath, $modal, $routeParams, $location) {
        var _this = this;
        this.$scope = $scope;
        this.$log = $log;
        this.spoReceivingService = spoReceivingService;
        this.ngToast = ngToast;
        this.$rootScope = $rootScope;
        this.apiPath = apiPath;
        this.$modal = $modal;
        this.$routeParams = $routeParams;
        this.$location = $location;
        this.$scope.spoReceiving = new Model.SPOReceiving();
        this.$scope.billDiscountDays = new Model.BillDiscountDays();
        this.$scope.supplierItem = new Model.SupplierItem();
        this.$scope.getBranchList = function () { return _this.getBranchList(); };
        this.$scope.getSPO = function () { return _this.getSPO(); };
        this.$scope.addBill = function () { return _this.addBill(); };
        this.$scope.submitBill = function () { return _this.submitBill(); };
        this.$scope.changePercentageSelection = function () { return _this.changePercentageSelection(); };
        this.$scope.clearBill = function () { return _this.clearBill(); };
        this.$scope.deleteBill = function (BillId) { return _this.deleteBill(BillId); };
        this.$scope.editBill = function (bill) { return _this.editBill(bill); };
        this.$scope.checkValidBill = function () { return _this.checkValidBill(); };
        this.$scope.endReceive = stringConstants.endReceiving;
        this.$scope.billNumberReq = stringConstants.billNumberReq;
        this.$scope.finalReceive = function () { return _this.finalReceive(); };
        this.$scope.tempSupplierDaysLimit = [];
        this.$scope.validAmountError = stringConstants.validAmountError;
        this.$scope.nonTransactionAmountRequired = stringConstants.nonTransactionAmountRequired;
        this.$scope.receiveSPOItem = function (item) { return _this.receiveSPOItem(item); };
        this.$scope.openEndReceiveConfirmationPopup = function () { return _this.openEndReceiveConfirmationPopup(); };
        this.$scope.closeEndReceiveConfirmationPopup = function () { return _this.closeEndReceiveConfirmationPopup(); };
        this.$scope.deleteConfirmMessage = stringConstants.deleteConfirmMessage;
        this.$scope.back = function () { return _this.back(); };
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
        this.$scope.onBillCPChange = function (poItem) { return _this.onBillCPChange(poItem); };
        this.$scope.onReceiveQuantityChange = function (poItem) { return _this.onReceiveQuantityChange(poItem); };
        this.$scope.openSPONotSendErrorPopup = function () { return _this.openSPONotSendErrorPopup(); };
        this.$scope.closeSPONotSendErrorPopup = function () { return _this.closeSPONotSendErrorPopup(); };
        this.$scope.openCreateSPOPopup = function () { return _this.openCreateSPOPopup(); };
        this.$scope.closeCreateSPOPopup = function () { return _this.closeCreateSPOPopup(); };
        this.$scope.endReceiving = function () { return _this.endReceiving(); };
        this.$scope.saveBillItem = function () { return _this.saveBillItem(); };
        this.$scope.onChangeTotalDays = function (days) { return _this.onChangeTotalDays(days); };
        this.$scope.days = [];
        this.$scope.elementList = [];
        this.$scope.addElement = function () { return _this.addElement(); };
        this.$scope.removeElement = function () { return _this.removeElement(); };
        this.$scope.deleteConfirmation = stringConstants.deleteConfirmation;
        this.$scope.spoCannotBeReceive = stringConstants.spoCannotBeReceive;
        this.$scope.isBillEdit = false;
        this.$scope.endReceiveConfirmation = stringConstants.endReceiveConfirmation;
        this.$scope.openDeleteBillPopup = function (BillId) { return _this.openDeleteBillPopup(BillId); };
        this.$scope.closeDeleteBillPopup = function () { return _this.closeDeleteBillPopup(); };
        this.$scope.ValidDiscountMessage = stringConstants.ValidDiscountMessage;
        this.$scope.validQuantityError = stringConstants.validQuantityError;
        this.$scope.validPriceError = stringConstants.validPriceError;
        this.initialize();
    }
    SpoReceivingController.prototype.initialize = function () {
        if (this.$routeParams.id !== null && this.$routeParams.id !== undefined && this.$routeParams.id !== "") {
            this.getBranchList();
        }
    };
    //used to fetch branchlist - jj
    SpoReceivingController.prototype.getBranchList = function () {
        var _this = this;
        var controllerScope = this.$scope;
        var rootScope = this.$rootScope;
        controllerScope.receivePermission = rootScope.merchatSettings.IsAllowedToReceiveSPO;
        rootScope.isLoading = true;
        var promise = this.spoReceivingService.getBranchList();
        promise.then(function (result) {
            if (result.length === 0) {
            }
            else {
                for (var i = 0; i < result.length; i++) {
                    controllerScope.branchList.push({ Id: result[i].Id, Name: result[i].Name });
                }
                _this.getSPO();
            }
            rootScope.isLoading = false;
        }).catch(function (error) {
            if (error.status !== 500) {
                location.replace(_this.apiPath);
            }
            rootScope.isLoading = false;
        });
    };
    //USED TO FETCH SPO OF THE GIVEN ID - jj
    SpoReceivingController.prototype.getSPO = function () {
        var _this = this;
        var id = this.$routeParams.id;
        var controllerScope = this.$scope;
        var rootScope = this.$rootScope;
        controllerScope.firstTime = true;
        var promise = this.spoReceivingService.getSPO(id);
        promise.then(function (result) {
            controllerScope.supplierPO = result.SupplierPOAC;
            controllerScope.bill.IsPercentageDiscount = true;
            _this.changePercentageSelection();
            controllerScope.bill.IsPercentageDiscount = false;
            if (controllerScope.supplierPO.IsSend === false) {
                _this.openSPONotSendErrorPopup();
            }
            else {
                for (var i = 0; i < controllerScope.supplierPO.SPOBranch.length; i++) {
                    controllerScope.branchModel.push({ Id: controllerScope.supplierPO.SPOBranch[i].Id });
                }
                controllerScope.supplierPO.SupplierProfile = controllerScope.supplierPO.SupplierProfile;
                controllerScope.supplierPO.supplier = controllerScope.supplierPO.SupplierProfile;
                controllerScope.purchaseOrderItemList = result.POItem;
                for (var j = 0; j < result.POItem.length; j++) {
                    for (var n = 0; n < stringConstants.spoReceivingStatusList.length; n++) {
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
                    for (var n = 0; n < result.SPOBill.length; n++) {
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
                _this.calculateDiscountedCP();
            }
        }).catch(function (error) {
        });
    };
    //check bill with same bill number already added
    SpoReceivingController.prototype.checkBillUnique = function (BillNumber, Id) {
        var controllerScope = this.$scope;
        for (var i = 0; i < controllerScope.billList.length; i++) {
            if (controllerScope.billList[i].BillNumber === BillNumber && controllerScope.billList[i].BillId !== Id) {
                controllerScope.bill.BillNumber = "";
                this.ngToast.create({
                    className: 'danger',
                    content: stringConstants.UniqueBillNo
                });
                return false;
            }
        }
        return true;
    };
    //used to show bill panel - jj
    SpoReceivingController.prototype.addBill = function () {
        var controllerScope = this.$scope;
        controllerScope.isBillPanelVisible = true;
    };
    //save bill - jj
    SpoReceivingController.prototype.submitBill = function () {
        var _this = this;
        var controllerScope = this.$scope;
        var controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        var status = this.checkBillUnique(controllerScope.bill.BillNumber, controllerScope.bill.Id);
        if (status) {
            if (controllerScope.bill.IsEdit) {
                var _loop_1 = function (k) {
                    if (controllerScope.billList[k].Id === controllerScope.bill.Id) {
                        var spoBill_1 = new Model.SPOReceivingBill();
                        spoBill_1.Amount = controllerScope.bill.Amount;
                        spoBill_1.BillComment = controllerScope.bill.BillComment;
                        spoBill_1.IsPercentageDiscount = controllerScope.bill.IsPercentageDiscount;
                        spoBill_1.BillNumber = controllerScope.bill.BillNumber;
                        spoBill_1.Discount = controllerScope.bill.Discount;
                        spoBill_1.TotalDaysLimit = controllerScope.bill.TotalDaysLimit;
                        spoBill_1.VerifiedDate = controllerScope.bill.VerifiedDate;
                        spoBill_1.SPOBillDaysLimit = controllerScope.elementList;
                        spoBill_1.BillId = controllerScope.bill.Id;
                        spoBill_1.PurchaseOrderId = this_1.$routeParams.id;
                        if (controllerScope.billDiscountDays !== undefined && controllerScope.billDiscountDays !== null) {
                            if (controllerScope.billDiscountDays.Days > 0 && controllerScope.billDiscountDays.Discount > 0) {
                                spoBill_1.BillDaysLimitDiscount = controllerScope.billDiscountDays.Discount;
                                spoBill_1.Days = controllerScope.billDiscountDays.Days;
                            }
                        }
                        var promise = this_1.spoReceivingService.addSPOBill(spoBill_1);
                        promise.then(function (result) {
                            if (result !== null && result.Id !== undefined && result.Id > 0) {
                                for (var j = 0; j < controllerScope.billList.length; j++) {
                                    if (controllerScope.billList[j].Id === result.Id) {
                                        spoBill_1.Id = result.Id;
                                        spoBill_1.BillId = result.Id;
                                        if (spoBill_1.IsPercentageDiscount) {
                                            spoBill_1.IsPercentDis = stringConstants.yes;
                                        }
                                        else {
                                            spoBill_1.IsPercentDis = stringConstants.no;
                                            spoBill_1.IsPercentageDiscount = false;
                                        }
                                        var tempList = [];
                                        if (controllerScope.billDiscountDays !== undefined && controllerScope.billDiscountDays !== null) {
                                            if (controllerScope.billDiscountDays.Days > 0 && controllerScope.billDiscountDays.Discount > 0) {
                                                tempList.push({ Days: controllerScope.billDiscountDays.Days, Discount: controllerScope.billDiscountDays.Discount });
                                            }
                                        }
                                        for (var e = 0; e < controllerScope.elementList.length; e++) {
                                            tempList.push(controllerScope.elementList[e]);
                                        }
                                        controllerScope.elementList = [];
                                        controllerScope.elementList = tempList;
                                        spoBill_1.SPOBillDaysLimit = controllerScope.elementList;
                                        controllerScope.billList[j] = spoBill_1;
                                    }
                                }
                                _this.ngToast.create(stringConstants.BillUpdated);
                                _this.calculateDiscountedCP();
                                _this.clearBill();
                                controllerRootScope.isLoading = false;
                            }
                            else {
                                controllerRootScope.isLoading = false;
                                _this.ngToast.create({
                                    className: 'danger',
                                    content: stringConstants.BillUpdateFailed
                                });
                            }
                        }).catch(function (error) {
                            _this.ngToast.create({
                                className: 'danger',
                                content: stringConstants.BillUpdateFailed
                            });
                            controllerRootScope.isLoading = false;
                        });
                    }
                };
                var this_1 = this;
                for (var k = 0; k < controllerScope.billList.length; k++) {
                    _loop_1(k);
                }
                controllerScope.bill.IsEdit = false;
            }
            else {
                if (controllerScope.elementList !== undefined && controllerScope.elementList !== null) {
                    if (controllerScope.elementList.length > 0) {
                        controllerScope.bill.SPOBillDaysLimit = controllerScope.elementList;
                    }
                }
                var spoBill_2 = new Model.SPOReceivingBill();
                spoBill_2.Amount = controllerScope.bill.Amount;
                spoBill_2.BillComment = controllerScope.bill.BillComment;
                spoBill_2.IsPercentageDiscount = controllerScope.bill.IsPercentageDiscount;
                spoBill_2.BillNumber = controllerScope.bill.BillNumber;
                spoBill_2.Discount = controllerScope.bill.Discount;
                spoBill_2.TotalDaysLimit = controllerScope.bill.TotalDaysLimit;
                spoBill_2.VerifiedDate = controllerScope.bill.VerifiedDate;
                spoBill_2.SPOBillDaysLimit = controllerScope.bill.SPOBillDaysLimit;
                spoBill_2.PurchaseOrderId = this.$routeParams.id;
                if (controllerScope.billDiscountDays !== undefined && controllerScope.billDiscountDays !== null) {
                    if (controllerScope.billDiscountDays.Days > 0 && controllerScope.billDiscountDays.Discount > 0) {
                        spoBill_2.BillDaysLimitDiscount = controllerScope.billDiscountDays.Discount;
                        spoBill_2.Days = controllerScope.billDiscountDays.Days;
                    }
                }
                var promise = this.spoReceivingService.addSPOBill(spoBill_2);
                promise.then(function (result) {
                    if (result !== null && result !== undefined && result.Id > 0) {
                        if (spoBill_2.IsPercentageDiscount) {
                            spoBill_2.IsPercentDis = stringConstants.yes;
                        }
                        else {
                            spoBill_2.IsPercentDis = stringConstants.no;
                        }
                        if (controllerScope.billDiscountDays !== undefined && controllerScope.billDiscountDays !== null) {
                            if (controllerScope.billDiscountDays.Days > 0 && controllerScope.billDiscountDays.Discount > 0) {
                                controllerScope.elementList.push({ Days: controllerScope.billDiscountDays.Days, Discount: controllerScope.billDiscountDays.Discount });
                            }
                        }
                        spoBill_2.SPOBillDaysLimit = controllerScope.elementList;
                        spoBill_2.BillId = result.Id;
                        spoBill_2.Id = result.Id;
                        controllerScope.billList.push(spoBill_2);
                        _this.ngToast.create(stringConstants.BillAdded);
                        controllerRootScope.isLoading = false;
                        _this.calculateDiscountedCP();
                        _this.clearBill();
                    }
                    else {
                        controllerRootScope.isLoading = false;
                        _this.ngToast.create({
                            className: 'danger',
                            content: stringConstants.BillAddedFailed
                        });
                    }
                }).catch(function (error) {
                    _this.ngToast.create({
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
    };
    //used to check whether bill is valid - jj
    SpoReceivingController.prototype.checkValidBill = function () {
        var controllerScope = this.$scope;
        var totalDays = 0;
        if (controllerScope.bill.Amount === undefined || controllerScope.bill.Amount === null || !(controllerScope.bill.Amount > 0)) {
            return true;
        }
        else {
            if (!controllerScope.supplierPO.IsCashPO && controllerScope.bill.IsPercentageDiscount) {
                totalDays = totalDays + controllerScope.billDiscountDays.Days;
                if (controllerScope.elementList !== undefined && controllerScope.elementList !== null && controllerScope.elementList.length > 0) {
                    for (var i = 0; i < controllerScope.elementList.length; i++) {
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
    };
    //used to calculate the discounted receiving cost price of the purchase order items - jj
    SpoReceivingController.prototype.calculateDiscountedCP = function () {
        var controllerScope = this.$scope;
        if (controllerScope.billList.length === 0) {
            for (var i = 0; i < controllerScope.purchaseOrderItemList.length; i++) {
                controllerScope.purchaseOrderItemList[i].ReceiveCostPrice = controllerScope.purchaseOrderItemList[i].BillCostPrice;
                controllerScope.purchaseOrderItemList[i].SPOReceivingStatus = 1;
                controllerScope.purchaseOrderItemList[i].Status = stringConstants.spoReceivingStatusList[1].Name;
            }
        }
        else {
            var weightedPercent = 0;
            var percentDiscount = 0;
            var billCount = 0;
            for (var j = 0; j < controllerScope.billList.length; j++) {
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
            for (var i = 0; i < controllerScope.purchaseOrderItemList.length; i++) {
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
    };
    //clear the bill panel - JJ
    SpoReceivingController.prototype.clearBill = function () {
        var controllerScope = this.$scope;
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
    };
    //delete bill from grid
    SpoReceivingController.prototype.deleteBill = function (BillId) {
        var _this = this;
        var controllerScope = this.$scope;
        var controllerRootScope = this.$rootScope;
        this.closeDeleteBillPopup();
        controllerRootScope.isLoading = true;
        var promise = this.spoReceivingService.deleteSPOBill(BillId);
        promise.then(function (result) {
            if (result !== null && result !== undefined && result.status === true) {
                var tempList = controllerScope.billList;
                controllerScope.billList = [];
                for (var i = 0; i < tempList.length; i++) {
                    if (tempList[i].BillId === BillId) {
                    }
                    else {
                        controllerScope.billList.push(tempList[i]);
                    }
                }
                _this.ngToast.create(stringConstants.BillDeleted);
                _this.calculateDiscountedCP();
                controllerRootScope.isLoading = false;
            }
            else {
                controllerRootScope.isLoading = false;
                _this.ngToast.create({
                    className: 'danger',
                    content: stringConstants.BillDeletedFailed
                });
            }
            controllerRootScope.isLoading = false;
        }).catch(function (error) {
            _this.ngToast.create({
                className: 'danger',
                content: stringConstants.BillDeletedFailed
            });
            controllerRootScope.isLoading = false;
        });
    };
    //delete bill from grid- jj
    SpoReceivingController.prototype.editBill = function (bill) {
        var controllerScope = this.$scope;
        var templist = [];
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
            for (var i = 0; i < templist.length; i++) {
                controllerScope.billDiscountDays.Days = templist[i].Days;
                controllerScope.billDiscountDays.Discount = templist[i].Discount;
                break;
            }
            controllerScope.elementList = [];
            for (var i = 1; i < templist.length; i++) {
                controllerScope.elementList.push({ Days: templist[i].Days, Discount: templist[i].Discount });
            }
        }
    };
    //used to receive spo item
    SpoReceivingController.prototype.receiveSPOItem = function (item) {
        var _this = this;
        var controllerScope = this.$scope;
        item.PurchaseOrderId = this.$routeParams.id;
        if (item.SPOReceivingStatus === 0) {
            this.ngToast.create(stringConstants.AlreadyItemReceived);
        }
        else {
            if (item.ReceiveQuantity === undefined || item.ReceiveQuantity === "" || item.ReceiveQuantity === null || item.ReceiveQuantity <= 0) {
                this.ngToast.create({
                    className: 'danger',
                    content: stringConstants.NotReceiveQuantity.replace(/{ReceiveQuantity}/, item.ReceiveQuantity)
                });
            }
            else {
                if (item.ReceiveCostPrice === undefined || item.ReceiveCostPrice === "" || item.ReceiveCostPrice === null || item.ReceiveCostPrice <= 0) {
                    this.ngToast.create({
                        className: 'danger',
                        content: stringConstants.NotReceiveCostPrice.replace(/{ReceiveCostPrice}/, item.ReceiveCostPrice)
                    });
                }
                else {
                    var controllerRootScope_1 = this.$rootScope;
                    controllerRootScope_1.isLoading = true;
                    var promise = this.spoReceivingService.receiveSPOItem(item);
                    promise.then(function (result) {
                        if (result.status === 0 || result.status === 1 || result.status === 2) {
                            item.SPOReceivingStatus = result.status;
                            if (item.SPOReceivingStatus === 0) {
                                if (item.OrderQuantity > item.ReceiveQuantity) {
                                    item.SPOReceivingStatus = 2;
                                    _this.ngToast.create(stringConstants.ItemReceivedPartially);
                                }
                                else {
                                    _this.ngToast.create(stringConstants.ItemReceived);
                                }
                            }
                            else if (item.SPOReceivingStatus === 1) {
                                _this.ngToast.create(stringConstants.ItemNotReceived);
                            }
                            for (var i = 0; i < stringConstants.spoReceivingStatusList.length; i++) {
                                if (stringConstants.spoReceivingStatusList[i].Id === item.SPOReceivingStatus) {
                                    item.Status = stringConstants.spoReceivingStatusList[i].Name;
                                    item.SPOReceivingStatus = stringConstants.spoReceivingStatusList[i].Id;
                                }
                            }
                        }
                        else if (result.status === 300) {
                            _this.ngToast.create({
                                className: 'danger',
                                content: stringConstants.itemNotReceived.replace(/{ItemName}/, item.ItemNameEn)
                            });
                        }
                        else if (result.status === 400) {
                            _this.ngToast.create({
                                className: 'danger',
                                content: stringConstants.workFlowNotCreated
                            });
                        }
                        else if (result.status === 401) {
                            _this.ngToast.create({
                                className: 'danger',
                                content: stringConstants.itemNotReceived.replace(/{ItemName}/, item.ItemNameEn)
                            });
                        }
                        else {
                            _this.ngToast.create({
                                className: 'danger',
                                content: stringConstants.ItemNotReceived
                            });
                        }
                        controllerRootScope_1.isLoading = false;
                    }).catch(function (error) {
                        _this.ngToast.create({
                            className: 'danger',
                            content: stringConstants.ItemNotReceived
                        });
                        controllerRootScope_1.isLoading = false;
                    });
                }
            }
        }
    };
    //used to redirect to Supplier Purchase Order WorkList - jj
    SpoReceivingController.prototype.back = function () {
        var x = this;
        x.$location.path("/SupplierPOWorkList/");
    };
    //used to calculate Discounted Received Cost Price
    SpoReceivingController.prototype.onBillCPChange = function (poItem) {
        var controllerScope = this.$scope;
        poItem.SPOReceivingStatus = 1;
        var totalQuantity = 0;
        poItem.Status = stringConstants.spoReceivingStatusList[1].Name;
        controllerScope.firstTime = true;
        this.calculateDiscountedCP();
    };
    //used to whether received quantity more than requested quantity
    SpoReceivingController.prototype.onReceiveQuantityChange = function (poItem) {
        var controllerScope = this.$scope;
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
    };
    //used to open SPONotSendErrorPopup
    SpoReceivingController.prototype.openSPONotSendErrorPopup = function () {
        var controllerScope = this.$scope;
        this.spoNotSendErrorPopup = this.$modal.open({
            templateUrl: 'SPONotSendErrorPopup',
            backdrop: 'static',
            keyboard: true,
            scope: this.$scope,
        });
    };
    //used to close SPONotSendErrorPopup
    SpoReceivingController.prototype.closeSPONotSendErrorPopup = function () {
        this.spoNotSendErrorPopup.dismiss('cancel');
        this.back();
    };
    //used to open CreateSPOPopup - jj
    SpoReceivingController.prototype.openCreateSPOPopup = function () {
        var controllerScope = this.$scope;
        this.createSPOPopup = this.$modal.open({
            templateUrl: 'CreateSPOPopup',
            backdrop: 'static',
            keyboard: true,
            scope: this.$scope,
        });
    };
    //used to close CreateSPOPopup - jj
    SpoReceivingController.prototype.closeCreateSPOPopup = function () {
        this.createSPOPopup.dismiss('cancel');
    };
    //used to open EndReceiveConfirmationPopup - jj
    SpoReceivingController.prototype.openEndReceiveConfirmationPopup = function () {
        var controllerScope = this.$scope;
        controllerScope.popupMessage = stringConstants.AfterReceivingProcessMsg;
        this.endReceiveConfirmationPopup = this.$modal.open({
            templateUrl: 'EndReceiveConfirmationPopup',
            backdrop: 'static',
            keyboard: true,
            scope: this.$scope,
        });
    };
    //used to close EndReceiveConfirmationPopup - jj
    SpoReceivingController.prototype.closeEndReceiveConfirmationPopup = function () {
        this.endReceiveConfirmationPopup.dismiss('cancel');
    };
    //used to submit details to database - jj
    SpoReceivingController.prototype.endReceiving = function () {
        var controllerScope = this.$scope;
        var controllerRootScope = this.$rootScope;
        this.closeEndReceiveConfirmationPopup();
        var billTotal = 0;
        var itemTotalAmount = 0;
        var status = 0;
        var templist = [];
        for (var j = 0; j < controllerScope.purchaseOrderItemList.length; j++) {
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
            for (var i = 0; i < controllerScope.billList.length; i++) {
                billTotal = parseFloat("" + billTotal) + parseFloat("" + controllerScope.billList[i].Amount);
            }
            billTotal = this.roundToTow(billTotal);
            var difference = 0;
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
    };
    SpoReceivingController.prototype.finalReceive = function () {
        var _this = this;
        var controllerScope = this.$scope;
        var controllerRootScope = this.$rootScope;
        this.closeEndReceiveConfirmationPopup();
        controllerRootScope.isLoading = true;
        controllerScope.spoReceiving.SPOBill = this.ConvertBill(controllerScope.billList);
        controllerScope.spoReceiving.PurchaseOrderId = controllerScope.supplierPO.Id;
        var Comment = controllerScope.comment.Comment;
        if (Comment === null && Comment === undefined) {
            Comment = ".";
        }
        controllerScope.spoReceiving.Comment = Comment;
        var promise = this.spoReceivingService.endReceiving(controllerScope.spoReceiving);
        promise.then(function (result) {
            if (result !== null && result !== undefined) {
                if (result.status) {
                    _this.ngToast.create(stringConstants.ReceivedSuccessfully);
                    _this.back();
                }
                else {
                    _this.ngToast.create({
                        className: 'danger',
                        content: stringConstants.ReceivingFailed
                    });
                }
            }
            else {
                _this.ngToast.create({
                    className: 'danger',
                    content: stringConstants.ReceivingFailed
                });
            }
            controllerRootScope.isLoading = false;
        }).catch(function (error) {
            _this.ngToast.create({
                className: 'danger',
                content: stringConstants.ReceivingFailed
            });
            controllerRootScope.isLoading = false;
        });
    };
    //used to Open DeleteBillPopup-jj
    SpoReceivingController.prototype.openDeleteBillPopup = function (BillId) {
        var controllerScope = this.$scope;
        this.deleteBillPopup = this.$modal.open({
            templateUrl: 'DeleteBillConfirmation',
            backdrop: 'static',
            keyboard: true,
            scope: this.$scope,
        });
        controllerScope.billId = BillId;
    };
    //used to close DeleteBillPopup-jj
    SpoReceivingController.prototype.closeDeleteBillPopup = function () {
        this.deleteBillPopup.dismiss('cancel');
    };
    //called when the TotalDaysLimit changes and
    SpoReceivingController.prototype.onChangeTotalDays = function (days) {
        var controllerScope = this.$scope;
        controllerScope.days = [];
        if (days === 0) {
            controllerScope.elementList = [];
            controllerScope.billDiscountDays = new Model.BillDiscountDays();
        }
        else {
            for (var i = 0; i < days; i++) {
                controllerScope.days[i] = { Id: i + 1, Days: i + 1 };
            }
        }
    };
    //used to dynamically add dropdown and textbox 
    SpoReceivingController.prototype.addElement = function () {
        var controllerScope = this.$scope;
        controllerScope.elementList.push({});
    };
    //used to dynamically remove dropdown and textbox 
    SpoReceivingController.prototype.removeElement = function () {
        var lastItem = this.$scope.elementList.length - 1;
        this.$scope.elementList.splice(lastItem);
    };
    //used to save the receiving details of SPO but not performing End Receiving - jj
    SpoReceivingController.prototype.saveBillItem = function () {
        var _this = this;
        var controllerScope = this.$scope;
        var controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        controllerScope.spoReceiving.POItem = controllerScope.purchaseOrderItemList;
        controllerScope.spoReceiving.SPOBill = this.ConvertBill(controllerScope.billList);
        controllerScope.spoReceiving.SupplierPOAC = controllerScope.supplierPO;
        controllerScope.spoReceiving.PurchaseOrderId = controllerScope.spoReceiving.SupplierPOAC.Id;
        var promise = this.spoReceivingService.saveSPOBillItem(controllerScope.spoReceiving);
        promise.then(function (result) {
            if (result !== null && result !== undefined) {
                if (result.status) {
                    _this.ngToast.create(stringConstants.SavedSuccessfully);
                    _this.back();
                }
                else {
                    _this.ngToast.create({
                        className: 'danger',
                        content: stringConstants.SavedFailed
                    });
                }
            }
            else {
                _this.ngToast.create({
                    className: 'danger',
                    content: stringConstants.SavedFailed
                });
            }
            controllerRootScope.isLoading = false;
        }).catch(function (error) {
            _this.ngToast.create({
                className: 'danger',
                content: stringConstants.SavedFailed
            });
            controllerRootScope.isLoading = false;
        });
    };
    SpoReceivingController.prototype.ConvertBill = function (billList) {
        var controllerScope = this.$scope;
        var temp = [];
        for (var i = 0; i < billList.length; i++) {
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
    };
    SpoReceivingController.prototype.changePercentageSelection = function () {
        var controllerScope = this.$scope;
        if (controllerScope.bill.IsPercentageDiscount) {
            if (controllerScope.supplierPO.DiscountDays !== undefined && controllerScope.supplierPO.DiscountDays !== null && controllerScope.supplierPO.DiscountDays.length > 0) {
                controllerScope.tempSupplierDaysLimit = controllerScope.supplierPO.DiscountDays;
                controllerScope.discountDaysVisible = true;
            }
            if (controllerScope.supplierPO.TotalDaysLimit > 0) {
                controllerScope.bill.TotalDaysLimit = controllerScope.supplierPO.TotalDaysLimit;
                this.onChangeTotalDays(controllerScope.supplierPO.TotalDaysLimit);
            }
            for (var i = 0; i < controllerScope.tempSupplierDaysLimit.length; i++) {
                controllerScope.billDiscountDays.Days = controllerScope.tempSupplierDaysLimit[i].Days;
                controllerScope.billDiscountDays.Discount = controllerScope.tempSupplierDaysLimit[i].Discount;
                break;
            }
            controllerScope.elementList = [];
            for (var i = 1; i < controllerScope.tempSupplierDaysLimit.length; i++) {
                controllerScope.elementList.push({ Days: controllerScope.tempSupplierDaysLimit[i].Days, Discount: controllerScope.tempSupplierDaysLimit[i].Discount });
            }
        }
        else {
            controllerScope.bill.TotalDaysLimit = 0;
            controllerScope.billDiscountDays = [];
            controllerScope.elementList = [];
        }
    };
    //Method to Round value upto 2 decimal digits
    SpoReceivingController.prototype.roundToTow = function (value) {
        if (value !== null && value !== undefined) {
            return (Math.round((value + 0.00001) * 100) / 100);
        }
        return value;
    };
    return SpoReceivingController;
}());
SpoReceivingController.controllerId = "SpoReceivingController";
app.controller(SpoReceivingController.controllerId, ['$scope', '$log', 'SpoReceivingService', 'ngToast', '$rootScope', 'apiPath', '$modal', '$routeParams', '$location', function ($scope, $log, SpoReceivingService, ngToast, $rootScope, apiPath, $modal, $routeParams, $location) {
        return new SpoReceivingController($scope, $log, SpoReceivingService, ngToast, $rootScope, apiPath, $modal, $routeParams, $location);
    }]);
//# sourceMappingURL=spoReceivingController.js.map