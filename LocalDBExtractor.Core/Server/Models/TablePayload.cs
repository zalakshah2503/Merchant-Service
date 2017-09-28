using System;
using System.Collections.Generic;

namespace LocalDBExtractor.Core.Server.Models
{
    public class TablePayload
    {
        public int Id { get; set; }
        public string TableName { get; set; }
        public IEnumerable<object> InsertData { get; set; }
        public IEnumerable<object> UpdatedData { get; set; }
        public DateTime Date { get; set; }
    }
}
