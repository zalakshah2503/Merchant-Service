using System;

namespace LocalDBExtractor.Core.Repository.Redis
{
    public interface IRedisRepository<T> : IDisposable where T : class
    {
        /// <summary>
        /// Connection with the redis server and Get the Database
        /// </summary>
        /// <returns></returns>
        bool IntializeCache();

        /// <summary>
        /// Method to add single T into cache
        /// </summary>
        /// <param name="value">Object List</param>
        /// <param name="key">Redis key</param>
        void Create(T entity, string key);

        /// <summary>
        ///  Method to find All Data From RedisRepository
        /// </summary>
        /// <param name="key">Redis key</param>
        /// <returns></returns>       
        T All(string key);

        /// <summary>
        /// Delete the Key of Typed Client
        /// </summary>
        /// <param name="key">Redis key</param>
        void Delete(string key);
    }
}
