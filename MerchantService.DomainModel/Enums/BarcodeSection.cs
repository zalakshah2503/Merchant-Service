namespace MerchantService.DomainModel.Enums
{
    public enum BarcodeSection
    {
        Prefix = 1,
        SubBarcode = 2,
        Weight = 3,
        WeightDecimalPoint = 4,
        WeightUnit = 5,
        Amount = 6,
        AmountDecimalPoint = 7,
        Suffix = 8,
        Checksum = 9,
        Other = 10,
        ChecksumEquation = 11
    }
}
