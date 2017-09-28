using MerchantService.DomainModel.Models.POS;
using System.Collections.Generic;

namespace MerchantService.Repository.Modules.POS
{
    public interface IReturnBillRepository 
    {
        /// <summary>
        /// This method used for get pos bill by bill number. -An
        /// </summary>
        /// <param name="billNumber"></param>
        /// <returns></returns>
        POSBill GetPOSBillByBillNumber(string billNumber,int branchId);

        /// <summary>
        /// This method used for get pos bill item by id. -An
        /// </summary>
        /// <param name="billId"></param>
        /// <returns></returns>
        List<POSBillItem> GetPOSBillItemListByBillId(int billId);

        /// <summary>
        /// This method uesd for get pos bill payment list by bill id. -An
        /// </summary>
        /// <param name="billId"></param>
        /// <returns></returns>
        List<POSBillPayment> GetPOSBillPaymentListByBillId(int billId);

        /// <summary>
        /// This method used for get pos bill list. -An
        /// </summary>
        /// <param name="companyId"></param>
        /// <returns></returns>
        List<POSBill> GetPOSBillListByBranchId(int branchId);

        /// <summary>
        /// This method used for insert into POSReturnBill and return primary key. -An
        /// </summary>
        /// <param name="posReturnBill">posReturnBill Contains ReturningType,IssuingBranchID,ReturneBy,ProcessingBranchID,ProcessorID,ReturningDate,
        /// ReturningComments,ReturnedBillNo,ReturnedCash,SubstituteItemsAmount,IsProcessed
        /// </param>
        /// <returns></returns>
        int AddPOSReturnBill(POSReturnBill posReturnBill);

        /// <summary>
        /// This method used for nsert into posReturnBillItem and return primary key. -An
        /// </summary>
        /// <param name="posReturnBillItem">posReturnBillItem Contains POSBiillItemID,ReturnedQuantity</param>
        /// <returns></returns>
        int AddPOSReturnBillItem(POSReturnBillItem posReturnBillItem);

        /// <summary>
        /// This method used for get list Of Pos return Bill. -An
        /// </summary>
        /// <returns></returns>
        List<POSReturnBill> GetListOfPOSReturnBillByPOSBillId(int posBillId);

        /// <summary>
        /// This method used for get list of pos return bill by branch id.
        /// </summary>
        /// <returns></returns>
        List<POSReturnBill> GetListOfPOSReturnBillByBranchId(int branchId);

        /// <summary>
        /// This method used for get list of pos return bill. -An
        /// </summary>
        /// <returns></returns>
        List<POSReturnBill> GetListOfPOSRetunBill();

        /// <summary>
        /// This method used for get list of pos return bill item by pos bill item id. -An
        /// </summary>
        /// <param name="posBillItemId"></param>
        /// <returns></returns>
        List<POSReturnBillItem> GetListOfPOSRetunBillItemByPOSBillItemId(int posBillItemId);

        /// <summary>
        /// This method used for get list of pos return bill item by return bill id. -An
        /// </summary>
        /// <param name="returnBillId"></param>
        /// <returns></returns>
        List<POSReturnBillItem> GetListOfPOSReturnBillItemByReturnBillId(int returnBillId);

        /// <summary>
        /// This method used for get pos return bill item bu id. -An
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        POSReturnBillItem GetPOSReturnBillItemById(int id);

        /// <summary>
        /// This method used for get pos bill item by id. -An
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        POSBillItem GetPOSBillItemById(int id);

        /// <summary>
        /// This method is used for getting returnbill object by return bill no. -PS
        /// </summary>
        /// <param name="billNo"></param>
        /// <returns></returns>
        POSReturnBill GetPosReturnBillDataByReturnBillNo(string billNo);

        /// <summary>
        /// this method is used for update PosReturnBil table after cashier process. -PS
        /// </summary>
        /// <param name="?"></param>
        /// <returns> object of POSReturnBill</returns>
        bool UpdatePosReturnBillForPOs(POSReturnBill posReturnBill);

        /// <summary>
        /// This method used for update pos return bill item and return primary key. -An
        /// </summary>
        /// <param name="posRetunrBillItem"></param>
        /// <returns></returns>
        int UpdatePosReturnBillItem(POSReturnBillItem posRetunrBillItem);

        /// <summary>
        /// This method used for get customer pay toatl amount. -An
        /// </summary>
        /// <param name="posBillNumber">passs posBillId</param>
        /// <returns></returns>
        decimal GetCustomerPayTotalAmount(int posBillId);

        /// <summary>
        /// This method used for get POS Return Bill by Id. -An
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        POSReturnBill GetPOSReturnBillByReturnBillNumber(string returnBillNumber);
        /// <summary>
        /// This method used for returned quantity - Roshni
        /// </summary>
        /// <param name="posBillItemId"></param>
        /// <returns></returns>
        int GetReturnedQuantityByPosBillItemId(int posBillItemId);
    }

}
