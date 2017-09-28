namespace Model {

    export class CPODownPayment {
        CustomerId: number;
        CustomerPOId: number;
        CustomerName: string;
        CustomerMobile: string;
        PurchaseOrderNo: string;
        InitiationDate: Date;
        InitiationBranchId: number;
        InitiationBranchName: string;
        InitiatorId: number;
        InitiatorName: string;
        Comments: string;
        DueDate: Date;
        AmountLimit: number;
        BalanceAmount: number;
        IsCancel: boolean;
        CancelationDate: Date;
        IsCollected: boolean;
        CollectingBranchId: number;
        CollectingBranchName: string;
        CollectionDate: Date;
        ModifiedBy: number;
        Total: number;
        DownPaymentAmount: number;
    }
} 

  

 
      
       
        
    
      
       
        
      
      
     