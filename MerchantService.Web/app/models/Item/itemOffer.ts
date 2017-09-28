
namespace Model {
    export class ItemOffer {
        Id: number;
        ItemId: number;
        RecordId: number;
        StartDateTime: Date;
        EndDateTime: Date;
        StartTime: Date;
        EndTime: Date;
        SellPrice: number;
        SellPriceA: number;
        SellPriceB: number;
        SellPriceC: number;
        SellPriceD: number;
        Discount: number;
        QuantityLimit: number;
        Comment: string;
        IsSupplierInitiate; number;
        IsActive: boolean;
        BranchId: number;
        intiatedId: number;
        BranchList: any;
        SupplierId: number;
    }
}


        
