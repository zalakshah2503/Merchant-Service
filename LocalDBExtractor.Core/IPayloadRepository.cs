using System;
using System.Threading.Tasks;
using LocalDBExtractor.Core.Models;

namespace LocalDBExtractor.Core
{
    public interface IPayloadRepository
    {
        Task Add(string tableName, dynamic insertedData, dynamic updatedData, DateTime date);
        Task<object> Get(int id);
        Task ProcessPayloadAsync(PayloadBase payload);
    }
}
