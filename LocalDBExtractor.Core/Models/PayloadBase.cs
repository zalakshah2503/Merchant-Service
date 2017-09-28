using System;

namespace LocalDBExtractor.Core.Models
{
    public abstract class PayloadBase
    {
        public int Id { get; set; }
        public Guid UniqueId { get; set; }
        public string Data { get; set; }
        public DateTime CreatedDateTime { get; set; }
    }
}
