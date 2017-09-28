namespace MerchantService.Repository.ApplicationClasses.Admin.Company
{
    public class BalanceBarcodeAc
    {
        public string Name { get; set; }
        public int Index { get; set; }
        public int Id { get; set; }
        public int SubBarcodeStartPosition { get; set; }
        public int SubBarcodeLength { get; set; }
        public int? AmountStartPosition { get; set; }
        public int? AmountLength { get; set; }
        public int? AmountDecimalStartPosition { get; set; }
        public int? AmountDecimalLength { get; set; }
        public int WeightStartPosition { get; set; }
        public int WeightLength { get; set; }
        public int WeightDecimalStartPosition { get; set; }
        public int WeightDecimalLength { get; set; }
        public int? WeightUnitStartPosition { get; set; }
        public int? WeightUnitLength { get; set; }
        public int PrefixStartPosition { get; set; }
        public int PrefixLength { get; set; }
        public int? SuffixStartPosition { get; set; }
        public int? SuffixLength { get; set; }
        public int? CheckSumStartPosition { get; set; }
        public int? CheckSumLength { get; set; }
        public int? OtherStartPosition { get; set; }
        public int? OtherLength { get; set; }
    }
}
