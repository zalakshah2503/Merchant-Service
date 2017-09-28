using System;
using System.Collections.Generic;
using System.IO;
using System.Runtime.Caching;
using System.Xml.Linq;
using LocalDBExtractor.Core.Common;
using LocalDBExtractor.Core.Server.Models;

namespace LocalDBExtractor.Core.Server
{
    public class XmlFileReader : IFileReader
    {
        private const string XmlFileKey = "XmlFileKey";
        private readonly MemoryCache _memoryCache;

        public XmlFileReader()
        {
            _memoryCache = MemoryCache.Default;
        }

        public string ReadFile(Stream stream)
        {
            using (var reader = new StreamReader(stream))
            {
                return reader.ReadToEnd();
            }
        }

        public IEnumerable<T> Parse<T>(Stream stream)
        {
            var data = _memoryCache.Get(XmlFileKey);
            if (data != null) return (IEnumerable<T>)data;

            RefectorUtility utility = new RefectorUtility();
            XDocument xDoc = XDocument.Parse(ReadFile(stream));
            XElement xElement = xDoc.Element("Mappings");
            List<TableClassMapping> mappings = new List<TableClassMapping>();
            if (xElement != null)
            {
                var mapElements = xElement.Descendants("Map");
                Dictionary<string, string> attributeValueMappingDictionary = new Dictionary<string, string>();
                foreach (XElement mapElement in mapElements)
                {
                    foreach (XAttribute xAttribute in mapElement.Attributes())
                    {
                        if (attributeValueMappingDictionary.ContainsKey(xAttribute.Name.LocalName))
                            attributeValueMappingDictionary[xAttribute.Name.LocalName] = xAttribute.Value;
                        else
                            attributeValueMappingDictionary.Add(xAttribute.Name.LocalName, xAttribute.Value);
                    }
                    var mappedClass = utility.ParseColumn(typeof(TableClassMapping), attributeValueMappingDictionary) as TableClassMapping;
                    mappings.Add(mappedClass);
                }
            }
            var cacheItemPolicy = new CacheItemPolicy();
            cacheItemPolicy.AbsoluteExpiration = DateTimeOffset.MaxValue;
            cacheItemPolicy.SlidingExpiration = TimeSpan.FromDays(365);
            cacheItemPolicy.Priority = CacheItemPriority.Default;

            var cacheItem = new CacheItem(XmlFileKey, mappings);
            _memoryCache.Add(cacheItem, cacheItemPolicy);
            return (IEnumerable<T>)mappings;
        }

        public void Dispose()
        {
            if (_memoryCache != null)
            {
                _memoryCache.Dispose();                
            }
        }
    }
}
