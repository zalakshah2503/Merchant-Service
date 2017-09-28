using Newtonsoft.Json;
using StackExchange.Redis;
using System;
using System.Configuration;

namespace LocalDBExtractor.Core.Repository.Redis
{
    public class RedisRepository<T> : IRedisRepository<T> where T : class
    {
        #region Private Variables

        private bool _isDisposed;
        private readonly object _lock = new object();
        private ConnectionMultiplexer _connection;
        private IDatabase _cache;

        #endregion

        #region Private Properties

        /// <summary>
        /// create the Connection to Redis Server
        /// </summary>
        private ConnectionMultiplexer Connection
        {
            get
            {
                lock (_lock)
                {
                    if (_connection == null || !_connection.IsConnected)
                    {
                        //kill old connection
                        if (_connection != null)
                        {
                            _connection.Close(false);
                            _connection.Dispose();
                            _connection = null;
                        }

                        _connection = ConnectionMultiplexer.Connect(ConfigurationManager.AppSettings["RedisConnectionString"]);
                    }
                    return _connection;
                }
            }
        }

        #endregion

        #region Constructor

        /// <summary>
        /// Constructor
        /// </summary>
        public RedisRepository()
        {
            _isDisposed = false;
            IntializeCache();
        }

        #endregion

        #region "Public method(s)"

        /// <summary>
        /// Connection with the redis server and Get the Database
        /// </summary>
        /// <returns></returns>
        public bool IntializeCache()
        {
            try
            {
                _cache = Connection.GetDatabase();
                return true;
            }
            catch (Exception)
            {
                return false;
            }
        }

        /// <summary>
        /// Method to add single T into cache
        /// </summary>
        /// <param name="value">Object List</param>
        /// <param name="key">Redis key</param>
        public void Create(T value, string key)
        {
            _cache.StringSet(key, JsonConvert.SerializeObject(value, new JsonSerializerSettings { PreserveReferencesHandling = PreserveReferencesHandling.Objects }));
        }

        /// <summary>
        ///  Method to find All Data From RedisRepository
        /// </summary>
        /// <param name="key">Redis key</param>
        /// <returns></returns>
        public T All(string key)
        {
            var objInstance = _cache.StringGet(key);
            return objInstance.HasValue ? JsonConvert.DeserializeObject<T>(objInstance) : Activator.CreateInstance<T>();
        }

        /// <summary>
        /// Delete the Key of Typed Client
        /// </summary>
        /// <param name="key">Redis key</param>
        public void Delete(string key)
        {
            _cache.KeyDelete(key);
        }

        #region Dispose
        /// <summary>
        /// Dispose method
        /// </summary>
        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }

        /// <summary>
        /// DB Dispose based on disposing value method
        /// </summary>
        /// <param name="disposing"></param>
        private void Dispose(bool disposing)
        {
            if (!_isDisposed && disposing)
            {
              _isDisposed = true;
            }
        }

        ~RedisRepository()
        {
            Dispose(false);
        }

        #endregion

        #endregion
    }
}
