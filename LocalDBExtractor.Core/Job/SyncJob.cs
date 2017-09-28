using LocalDBExtractor.Core.Repository.PayLoad;
using LocalDBExtractor.Core.Repository.Redis;
using LocalDBExtractor.Core.Server.Models;
using MerchantService.DomainModel.Models;
using Newtonsoft.Json;
using Quartz;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;

namespace LocalDBExtractor.Core.Job
{
    public class SyncJob : IJob
    {
        public IDatabaseRepository DatabaseRepository { get; set; }

        public IFileReader FileReader { get; set; }

        public IPayloadRepository PayloadRepository { get; set; }

        public IPayloadCache PayloadCache { get; set; }

        public IPayLoadRepository PayLoadRepository { get; set; }

        public IRedisRepository<PayLoad> RedisRepository { get; set; }

        public void Execute(IJobExecutionContext context)
        {
            var assembly = Assembly.GetExecutingAssembly();
            var manifestResourceName = assembly.GetManifestResourceNames().First();
            IEnumerable<TableClassMapping> mappings = FileReader.Parse<TableClassMapping>(assembly.GetManifestResourceStream(manifestResourceName));
            List<TablePayload> payload = new List<TablePayload>();

            var currentDateTime = DateTime.UtcNow;
            int id = 1;

            foreach (TableClassMapping tableClassMapping in mappings)
            {
                var insertData =
                    DatabaseRepository.GetInserts(tableClassMapping.TableName, tableClassMapping.ClassName,
                        tableClassMapping.AssemblyName, currentDateTime).Result;


                var updatedData = DatabaseRepository.GetUpdates(tableClassMapping.TableName, tableClassMapping.ClassName,
                    tableClassMapping.AssemblyName, currentDateTime).Result;

                if (insertData.Any() || updatedData.Any())
                    payload.Add(new TablePayload()
                    {
                        Date = currentDateTime,
                        Id = id++, 
                        InsertData = insertData,
                        UpdatedData = updatedData,
                        TableName = tableClassMapping.TableName
                    });
            }
            if (payload.Any())
            {
                var payLoadData = new PayLoad
                {
                    UniqueId = Guid.NewGuid(),
                    Data = JsonConvert.SerializeObject(payload),
                    CreatedDateTime = currentDateTime
                };
                PayLoadRepository.AddPayLoad(payLoadData);
                RedisRepository.IntializeCache();
                RedisRepository.Create(payLoadData, payLoadData.UniqueId.ToString());
            }
        }
    }
}