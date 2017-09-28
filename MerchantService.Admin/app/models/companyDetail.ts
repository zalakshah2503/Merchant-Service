namespace Model {
    export class CompanyDetail {

        constructor() {
            this.CPOConfigurations = new Array<CPOAdditionalCost>();
            let newObj = new Model.CPOAdditionalCost();
            newObj.AdditionalCostType = "Delivery";
            newObj.Id = 1;
            this.CPOConfigurations.push(newObj);
            newObj = new Model.CPOAdditionalCost();
            newObj.AdditionalCostType = "Cooling";
            newObj.Id = 2;
            this.CPOConfigurations.push(newObj);
        }

        CompanyId: number;
        Name: string;
        Address: string;
        CountryId: number;
        Email: string;
        Zipcode: string;
        PhoneNumber: string;
        CompanyConfigId: number;
        NormalBarcodeFrom: number;
        NormalBarcodeTo: number;
        PriceStartFrom: string;
        PriceDigitLength: number;
        CreditCardPayment: boolean;
        DebitCardPayment: boolean;
        ChequePayment: boolean;
        CoupanPayment: boolean;
        CreditAccountPayment: boolean;
        AllowCreditAccountLimit: boolean;
        CPODownPaymentDiscount: number;
        ReturnItem: boolean;
        InvoiceNo: string;
        NameSL: string;
        ReturnInvoiceNo: string;
        CPOInvoiceNo: string;
        SPOInvoiceNo: string;
        ItemDestructionNo: string;
        SupplierReturnNo: string;
        Location: string;
        ProfitMargin: string;
        CashPayment: boolean;
        LanguageId: number;
        CurrencyId: number;
        ValidNumberOfDaysForReturnItem: number;
        AdditionalCostType: string;
        CPOConfigurations: Array<CPOAdditionalCost>;
        UpperBound: number;
        LowerBound: number;
        CompanyBarcodeConfiguration: CompanyBarcodeConfiguration;
        ListOfBalanceBarcodeConfiguration: Array<BalanceBarcodeConfiguration>;
    }

    export class CPOAdditionalCost {
        Id: number;
        AdditionalCostType: string;
    }
}