
using System;
using System.IO;

namespace LocalDBExtractor.Core.Server
{
    public class FileBasedIncrementalService : IIncrementalService
    {
        private static int _tablePayloadId = 0;
        private static int _serverPayloadId = 0;
        private const string TablePayloadPath = "TablePayload.log";
        private const string ServerPayloadPath = "ServerPayload.log";
        public FileBasedIncrementalService()
        {
            if (_tablePayloadId == 0)
            {
                var lastId = Convert.ToInt32(File.ReadAllText(TablePayloadPath));
                if (lastId != 0) _tablePayloadId = lastId;
            }
            if (_serverPayloadId == 0)
            {
                var lastId = Convert.ToInt32(File.ReadAllText(ServerPayloadPath));
                if (lastId != 0) _serverPayloadId = lastId;
            }
        }
        public int GetTablePayloadId()
        {
            File.WriteAllText(TablePayloadPath, _tablePayloadId.ToString());
            return _tablePayloadId;
        }

        public int GetServerPayloadId()
        {
            File.WriteAllText(ServerPayloadPath, _serverPayloadId.ToString());
            return _serverPayloadId;
        }
    }
}