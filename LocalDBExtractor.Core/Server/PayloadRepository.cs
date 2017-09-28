using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;
using LocalDBExtractor.Core.Common;
using LocalDBExtractor.Core.Server.Models;
using Newtonsoft.Json;

namespace LocalDBExtractor.Core.Server
{
    public class PayloadRepository : IPayloadRepository, IDisposable
    {
        private readonly SqlConnection _connection;
        public PayloadRepository()
        {
            _connection = new SqlConnection(ConfigurationManager.ConnectionStrings["MerchantServiceDataContext"].ConnectionString);
        }

        public PayloadRepository(string connectionString)
        {
            _connection = new SqlConnection(connectionString);
        }
        public Task Add(string tableName, dynamic insertedData, dynamic updatedData, DateTime date)
        {
            throw new NotImplementedException();
        }

        public Task<object> Get(int id)
        {
            throw new NotImplementedException();
        }

        public async Task ProcessPayloadAsync(Core.Models.PayloadBase payload)
        {
            List<TablePayload> payloadCollection = JsonConvert.DeserializeObject<List<TablePayload>>(payload.Data);
            foreach (TablePayload tablePayload in payloadCollection)
            {
                if (tablePayload.InsertData != null && tablePayload.InsertData.Any())
                {
                    DataTable dt = this.ObjectToDataTable(tablePayload.TableName, tablePayload.InsertData);
                    await BulkInserts(dt);
                }
                if (tablePayload.UpdatedData != null && tablePayload.UpdatedData.Any())
                {
                    IEnumerable<string> updateStrings = GetUpdateStatement(tablePayload.TableName, tablePayload.UpdatedData);
                    await BulkUpdate(updateStrings);
                }
            }
        }

        private async Task BulkInserts(DataTable dataTable)
        {
            try
            {
                if (_connection.State != ConnectionState.Open)
                    await _connection.OpenAsync();
                SqlBulkCopy bulkCopy = new SqlBulkCopy(_connection);
                foreach (DataColumn dataColumn in dataTable.Columns)
                {
                    bulkCopy.ColumnMappings.Add(dataColumn.ColumnName, dataColumn.ColumnName);
                }
                bulkCopy.DestinationTableName = dataTable.TableName;
                await bulkCopy.WriteToServerAsync(dataTable);
                _connection.Close();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
            }
        }

        private IEnumerable<string> GetUpdateStatement(string tblName, IEnumerable<object> data)
        {
            RefectorUtility utility = new RefectorUtility();
            IFileReader file = new XmlFileReader();
            var assembly = Assembly.GetExecutingAssembly();
            var manifestResourceName = assembly.GetManifestResourceNames().First();
            var parsedContent = file.Parse<TableClassMapping>(assembly.GetManifestResourceStream(manifestResourceName));
            var mappedType = parsedContent.First(x => x.TableName == tblName);
            var tableType = utility.GetTypeFromString(mappedType.ClassName, mappedType.AssemblyName);
            string updateFormat = "UPDATE [" + tblName + "] SET {0} WHERE Id = {1}";
            List<string> updateQuery = new List<string>();
            List<string> finalstring = new List<string>();
            foreach (dynamic o in data)
            {
                dynamic objeInstance = JsonConvert.DeserializeObject(o.ToString(), tableType);
                foreach (PropertyInfo propertyInfo in objeInstance.GetType().GetProperties())
                {
                    if (propertyInfo.Name == "Id")
                        continue;
                    if (propertyInfo.PropertyType == typeof(DateTime))
                    {
                        dynamic dateTime = propertyInfo.GetValue(objeInstance);
                        updateQuery.Add(string.Format("[{0}] = N'{1}'", propertyInfo.Name, dateTime.ToString("yyyy-MM-dd HH:mm:ss")));
                    }
                    else
                        updateQuery.Add(string.Format("[{0}] = N'{1}'", propertyInfo.Name, propertyInfo.GetValue(objeInstance)));
                }
                finalstring.Add(string.Format(updateFormat, string.Join(",", updateQuery), objeInstance.Id));
                updateQuery.Clear();
            }
            return finalstring;
        }

        private async Task BulkUpdate(IEnumerable<string> updateStatements)
        {
            try
            {
                if (_connection != null)
                {
                    if (_connection.State != ConnectionState.Open)
                        await _connection.OpenAsync();

                    var sqlstring = string.Join(";", updateStatements) + ";";
                    SqlCommand cmd = _connection.CreateCommand();
                    cmd.CommandText = "sp_executesql";
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.Add(new SqlParameter("@p1", SqlDbType.NVarChar) { Value = sqlstring });
                    await cmd.ExecuteNonQueryAsync();
                    _connection.Close();
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
            }
        }

        private DataTable ObjectToDataTable(string tblName, IEnumerable<object> instance)
        {
            RefectorUtility utility = new RefectorUtility();
            IFileReader file = new XmlFileReader();
            var assembly = Assembly.GetExecutingAssembly();
            var manifestResourceName = assembly.GetManifestResourceNames().First();
            var parsedContent = file.Parse<TableClassMapping>(assembly.GetManifestResourceStream(manifestResourceName));
            var mappedType = parsedContent.First(x => x.TableName == tblName);
            var tableType = utility.GetTypeFromString(mappedType.ClassName, mappedType.AssemblyName);
            DataTable dataTable = new DataTable(tblName);
            foreach (PropertyInfo propertyInfo in tableType.GetProperties())
            {
                dataTable.Columns.Add(propertyInfo.Name, propertyInfo.PropertyType);
            }
            foreach (object item in instance)
            {
                var objeInstance = JsonConvert.DeserializeObject(item.ToString(), tableType);
                DataRow dr = dataTable.NewRow();
                foreach (PropertyInfo propertyInfo in tableType.GetProperties())
                {
                    dr[propertyInfo.Name] = propertyInfo.GetValue(objeInstance);
                }
                dataTable.Rows.Add(dr);
            }
            return dataTable;
        }

        public void Dispose()
        {
            if (_connection != null)
            {
                _connection.Close();
                _connection.Dispose();
            }
        }
    }
}
