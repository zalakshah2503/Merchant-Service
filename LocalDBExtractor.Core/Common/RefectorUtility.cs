using System;
using System.Collections.Generic;
using System.Reflection;

namespace LocalDBExtractor.Core.Common
{
    public class RefectorUtility
    {
        public object CreateInstance(Type genericType, Type baseClass)
        {
            Type genericList = typeof(List<>);
            var typeArgs = genericList.MakeGenericType(genericType);
            return Activator.CreateInstance(typeArgs);
        }

        public Type GetTypeFromString(string typeName, string assemblyName)
        {
            return Assembly.Load(assemblyName).GetType(typeName);
        }

        public object ParseColumn(Type tableType, IDictionary<string, string> columnRowMapping)
        {
            var instanceOfTableType = Activator.CreateInstance(tableType);
            foreach (KeyValuePair<string, string> keyValuePair in columnRowMapping)
            {
                var propertyInfo = tableType.GetProperty(keyValuePair.Key);
                Type originalType = propertyInfo.PropertyType;
                var underlyingType = Nullable.GetUnderlyingType(originalType);
                propertyInfo.SetValue(instanceOfTableType, string.IsNullOrWhiteSpace(keyValuePair.Value) ? null : (underlyingType ?? originalType).IsEnum ? Enum.Parse((underlyingType ?? originalType), keyValuePair.Value) : Convert.ChangeType(keyValuePair.Value, underlyingType ?? originalType));
            }
            return instanceOfTableType;
        }
    }
}
