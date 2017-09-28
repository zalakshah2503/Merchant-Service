using System;
using System.Collections;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Threading.Tasks;
using LocalDBExtractor.Core.Common;

namespace LocalDBExtractor.Core.Server
{
    public class DatabaseRepository : IDatabaseRepository
    {
        private readonly IDbConnection _connection;

        public DatabaseRepository(string connectionString)
        {
            _connection = new SqlConnection(connectionString);
        }

        public DatabaseRepository(IDbConnection dbConnection)
        {
            _connection = dbConnection;
        }

        public async Task<IEnumerable<object>> GetInserts(string tablename, string className, string assemblyName, DateTime lastCheckedDateTime)
        {
            ArrayList arrayList = await GetArrayList("GetInsertsByCreatedDateTime", tablename, lastCheckedDateTime, className, assemblyName);
            return arrayList.ToArray();
        }

        public async Task<IEnumerable<object>> GetUpdates(string tablename, string className, string assemblyName, DateTime lastCheckedDateTime)
        {
            ArrayList arrayList = await GetArrayList("GetUpdatesByModifiedDateTime", tablename, lastCheckedDateTime, className, assemblyName);
            return arrayList.ToArray();
        }

        #region Private Methods
        /// <summary>
        ///This method used for get array list. 
        /// </summary>
        /// <param name="spName">pass store processer name</param>
        /// <param name="tableName">pass table name</param>
        /// <param name="lastCheckedDateTime">pass last checked datetime</param>
        /// <param name="className">pass class name</param>
        /// <param name="assemblyName">pass assembly name</param>
        /// <returns></returns>
        private async Task<ArrayList> GetArrayList(string spName, string tableName, DateTime lastCheckedDateTime, string className, string assemblyName)
        {
            RefectorUtility utility = new RefectorUtility();
            List<SqlParameter> parameters = new List<SqlParameter>
            {
                new SqlParameter("@TableName", SqlDbType.VarChar) {Value = tableName},
                new SqlParameter("@LastCheckedDateTime", SqlDbType.DateTime) {Value = lastCheckedDateTime}
            };
            ArrayList arrayList = new ArrayList();
            using (var dataReader = await ExecuteStoreProcedure(spName, parameters))
            {
                Dictionary<string, string> columnRow = new Dictionary<string, string>();
                //This will initialize dictionary with all the column names                
                while (dataReader.Read())
                {
                    for (int i = 0; i < dataReader.FieldCount; i++)
                    {
                        if (columnRow.ContainsKey(dataReader.GetName(i)))
                            columnRow[dataReader.GetName(i)] = Convert.ToString(dataReader[i]);
                        else
                            columnRow.Add(dataReader.GetName(i), Convert.ToString(dataReader[i]));
                    }
                    var row = utility.ParseColumn(utility.GetTypeFromString(className, assemblyName), columnRow);
                    arrayList.Add(row);
                }
            }
            return arrayList;
        }

        private async Task<SqlDataReader> ExecuteStoreProcedure(string storedProcedure, IEnumerable<IDataParameter> parameters)
        {
            IDbCommand command = _connection.CreateCommand();
            command.CommandType = CommandType.StoredProcedure;
            command.CommandText = storedProcedure;
            command.Connection = _connection;
            foreach (var item in parameters)
            {
                command.Parameters.Add(item);
            }
            if (_connection.State != ConnectionState.Open)
                _connection.Open();
            return await ((SqlCommand)command).ExecuteReaderAsync();
        }

        #endregion

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
