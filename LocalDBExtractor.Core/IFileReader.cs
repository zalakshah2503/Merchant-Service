using System;
using System.Collections.Generic;
using System.IO;

namespace LocalDBExtractor.Core
{
    public interface IFileReader : IDisposable
    {        
        IEnumerable<T> Parse<T>(Stream stream);
        string ReadFile(Stream stream);
    }
}
