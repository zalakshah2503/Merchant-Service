using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace LocalDBExtractor.Core
{
    public interface IDatabaseRepository : IDisposable
    {
        Task<IEnumerable<object>> GetInserts(string tablename, string className, string assemblyName, DateTime lastCheckedDateTime);
        Task<IEnumerable<object>> GetUpdates(string tablename, string className, string assemblyName, DateTime lastCheckedDateTime);
    }
}
