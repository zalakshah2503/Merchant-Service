namespace LocalDBExtractor.Core
{
    public interface IIncrementalService
    {
        int GetTablePayloadId();
        int GetServerPayloadId();
    }
}