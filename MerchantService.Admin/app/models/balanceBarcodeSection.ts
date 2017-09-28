namespace Model {
    export class BalanceBarcodeSection {
        Name: string;
        Index : number;
        Id: number;
        SubBarcodeStartPosition: number;
        SubBarcodeLength: number;
        AmountStartPosition: number;
        AmountLength: number;
        AmountDecimalStartPosition: number;
        AmountDecimalLength: number;
        WeightStartPosition: number;
        WeightLength: number;
        WeightDecimalStartPosition: number;
        WeightDecimalLength: number;
        WeightUnitStartPosition: number;
        WeightUnitLength: number;
        PrefixStartPosition: number;
        PrefixLength: number;
        SuffixStartPosition: number;
        SuffixLength: number;
        CheckSumStartPosition: number;
        CheckSumLength: number;
        OtherStartPosition: number;
        OtherLength: number;
    }
}