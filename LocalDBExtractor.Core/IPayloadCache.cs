namespace LocalDBExtractor.Core
{
    public interface IPayloadCache
    {
        void Add(int key,string value);
        void Remove(int key);
        void RemoveById(int id);
        void Clear();
        string Get(int id);
    }
}
