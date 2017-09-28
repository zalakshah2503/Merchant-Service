namespace Model {
    export class SupplierProfile {
        Id: number;
        ContactId: number;
        SupplierId: number;
        Code: string;
        NameEn: string;
        NameSl: string;
        AddressEn: string;
        AddressSl: string;
        Phone: string;
        Fax: string;
        Email: string;
        ZipCode: string;
        POBox: string;
        TotalDaysLimit: number;
        SupplierTypeId: number;
        IsDeleted: boolean;
        IsActive: boolean;
        IsAcceptReturnForExpiredItem: boolean;
        CreatedDateTime: Date;
        Discount: number;
        Days: number;
        DiscountDays: Array<Model.DiscountDays>;
    }
} 



