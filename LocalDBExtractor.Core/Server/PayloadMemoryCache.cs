using System;
using System.Collections.Generic;

namespace LocalDBExtractor.Core.Server
{
    public class PayloadMemoryCache : IPayloadCache
    {
        private static readonly Dictionary<int, string> MemeoryCache = new Dictionary<int, string>();
        

        public PayloadMemoryCache()
        {            
        }


        public void Add(int key, string value)
        {
            lock (MemeoryCache)
            {
                if (!MemeoryCache.ContainsKey(key))
                {
                    MemeoryCache.Add(key, value);
                }
            }
        }

        public void Remove(int key)
        {
            lock (MemeoryCache)
            {
                if (MemeoryCache.ContainsKey(key))
                {
                    MemeoryCache.Remove(key);
                }
            }
        }

        public void RemoveById(int id)
        {
            throw new NotImplementedException();
        }

        public void Clear()
        {
            lock (MemeoryCache)
            {
                MemeoryCache.Clear();
            }
        }

        public string Get(int id)
        {
            lock (MemeoryCache)
            {
                return MemeoryCache[id];
            }
        }
    }
}
