using MerchantService.DomainModel.Models.Item;
using MerchantService.Repository.ApplicationClasses.Customer;
using System;
using System.Collections.Generic;

namespace MerchantService.Repository.ApplicationClasses.ItemChangeRequest
{
    public class ItemChangedDetailsAC
    {
        //id of ItemQuantity
        public int Id { get; set; }
        public int ItemId { get; set; }
        public int ParentRecordId { get; set; }
        public string Barcode { get; set; }
        public string ItemName { get; set; }
        public string Action { get; set; }
        public bool IsICRGenerated { get; set; }
        public int? BranchId { get; set; }
        public string BranchName { get; set; }
        public DateTime RequestedDate { get; set; }
        public string Comment { get; set; }
        public int MinQuantity { get; set; }
        public int MaxQuantity { get; set; }
        public int ActualQuantity { get; set; }
        public decimal ModifyingCostPrice { get; set; }
        public decimal ModifyingSellPrice { get; set; }
        public decimal ModifyingSellPriceA { get; set; }
        public decimal ModifyingSellPriceB { get; set; }
        public decimal ModifyingSellPriceC { get; set; }
        public decimal ModifyingSellPriceD { get; set; }
        public bool IsPriceChangeRequest { get; set; }
        public bool IsRejected { get; set; }
        public bool IsReturned { get; set; }
        public bool IsResubmit { get; set; }
        public decimal CalculatedCostPrice { get; set; }
        public bool IsInDirect { get; set; }
        public bool IsPOItemIcr { get; set; }
        public bool IsAddItemIcr { get; set; }
        public int POItemId { get; set; }
        public ItemProfile ItemProfile { get; set; }
        public ICollection<IcrQuantityAC> IcrQuantity { get; set; }
        public ICollection<WorkFlowActionAc> WorkFlowLog { get; set; }
        public bool HideQuantity { get; set; }
        //added these comment lines to check deployment issues

    }
}
