namespace Model {
    export class BranchDetail {
        Id: number;
        Name: string;
        NameSl: string;
        Code: string;
        Storename: string;
        Phone: string;
        Fax: string;
        CityId: number;
        CompanyId: number;
        spoSelection: number;
        Address: string;
        Zipcode: string;
        IsAutomaticIssueSPO: boolean;
        CreatedDateTime: Date;
        //  BranchCPOConfigurations: Array<Model.branchCPOConfigurations>;
    }
}   
