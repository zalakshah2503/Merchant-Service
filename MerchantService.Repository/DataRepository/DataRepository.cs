using MerchantService.Utility.Logger;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Linq.Expressions;

namespace MerchantService.Repository.DataRepository
{
    public class DataRepository<T> : IDataRepository<T> where T : class
    {
        #region "Private Member(s)"

        private readonly IErrorLog _errorLog;
        private DbContext _context;
        private DbSet<T> _dbSet;
        private bool _isDisposed;
        private dynamic _transaction;  // create new transaction instance.

        #endregion

        #region "Constructor & Destructor(s)"
        /// <summary>
        /// Public Constructor
        /// </summary>
        /// <param name="context"></param>
        public DataRepository(DbContext context, IErrorLog errorLog)
        {
            try
            {
                this._errorLog = errorLog;
                this._context = context;
                this._dbSet = _context.Set<T>();
                this._isDisposed = false;
            }
            catch
            {

                throw;
            }
        }
        #endregion

        #region "Public properties"

        /// <summary>
        /// Property fetches the total Count from the dbset.
        /// </summary>
        public int TotalCount
        {
            get { return _dbSet.Count(); }
        }

        #endregion

        #region "Public Method(s)"

        /// <summary>
        /// Method add the entity into the context.
        /// </summary>
        /// <param name="entity"></param>
        public T Add(T entity)
        {
            try
            {
                // start new sql transaction for database operation.
                _transaction = _context.Database.BeginTransaction();
                var newEntity = _dbSet.Add(entity);
                return newEntity;
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                return null;
            }
        }

        /// <summary>
        /// Add the new list of entities into the datacontext
        /// </summary>
        /// <param name="entities"></param>
        public IEnumerable<T> AddRange(IEnumerable<T> entities)
        {
            try
            {
                // start new sql transaction for database operation.
                _transaction = _context.Database.BeginTransaction();
                var newEntities = _dbSet.AddRange(entities);
                return newEntities;
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                return null;
            }
        }


        /// <summary>
        /// This method used for get 
        /// </summary>
        /// <param name="filter"></param>
        /// <param name="sort"></param>
        /// <returns></returns>
        public IQueryable<T> FetchDateWithCustomQuery(Expression<Func<T, bool>> filter, Expression<Func<T, DateTime>> sort)
        {
            //GlobalUtil util = new GlobalUtil();
            //string FinalQuery = util.ChangeDateFormateFromLinq(strfilter);
            //total = 0;
            //var skipCount = index * size;
            var resetSet = filter != null ? _dbSet.OrderByDescending(sort).Where(filter).AsQueryable() : _dbSet.OrderByDescending(sort).AsQueryable();
            //var resetSet1 = FinalQuery != "" ? resetSet.Where(FinalQuery).AsQueryable() : resetSet.AsQueryable();
            //var reset = skipCount == 0 ? resetSet1.Take(size) : resetSet1.Skip(skipCount).Take(size);
            //total = resetSet1.Count();
            return resetSet.AsQueryable();
        }


        /// <summary>
        /// Method attaches the entity from the context
        /// </summary>
        /// <param name="entity"></param>
        public void Attach(T entity)
        {
            try
            {
                _dbSet.Attach(entity);
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);

            }
        }

        /// <summary>
        /// Method call when explicitly updating the enteries.
        /// </summary>
        /// <param name="entity"></param>
        public void Update(T entity)
        {
            try
            {
                // start new sql transaction for database operation.
                _transaction = _context.Database.BeginTransaction();
                var entry = _context.Entry(entity);
                _dbSet.Attach(entity);
                entry.State = EntityState.Modified;
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);

            }
        }

        /// <summary>
        /// Method fetches the IQueryable based on the filter,orderby and properties to inculde.
        /// </summary>
        /// <param name="filter"></param>
        /// <param name="orderBy"></param>
        /// <param name="includeProperties"></param>
        /// <returns></returns>
        public IQueryable<T> Fetch(Expression<Func<T, bool>> filter = null, Func<IQueryable<T>, IOrderedQueryable<T>> orderBy = null, string includeProperties = "")
        {
            try
            {
                IQueryable<T> query = _dbSet;

                if (filter != null)
                {
                    query = query.Where(filter);
                }

                if (!String.IsNullOrWhiteSpace(includeProperties))
                {
                    query = includeProperties.Split(new[] { ',' }, StringSplitOptions.RemoveEmptyEntries).Aggregate(
                        query, (current, includeProperty) => current.Include(includeProperty));
                }

                return orderBy != null ? orderBy(query).AsQueryable() : query.AsQueryable();
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                return null;
            }
        }

        /// <summary>
        /// Method fetches the IQueryable based on expression.
        /// </summary>
        /// <param name="predicate"></param>
        /// <returns></returns>
        public IQueryable<T> Fetch(Expression<Func<T, bool>> predicate)
        {
            try
            {
                return _dbSet.Where(predicate).AsQueryable();
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                return null;
            }
        }

        /// <summary>
        /// Method fetches the IQueryable based on filter,size and index.
        /// </summary>
        /// <param name="filter"></param>
        /// <param name="total"></param>
        /// <param name="index"></param>
        /// <param name="size"></param>
        /// <returns></returns>
        public IQueryable<T> Fetch(Expression<Func<T, bool>> filter, out int total, int index = 0, int size = 50)
        {
            total = 0;
            try
            {
                var skipCount = index * size;
                var resetSet = filter != null ? _dbSet.Where(filter).AsQueryable() : _dbSet.AsQueryable();
                resetSet = skipCount == 0 ? resetSet.Take(size) : resetSet.Skip(skipCount).Take(size);
                total = resetSet.Count();
                return resetSet.AsQueryable();
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                return null;
            }
        }

        /// <summary>
        /// Method fetches the entity based on the keys supplied.
        /// </summary>
        /// <param name="keys"></param>
        /// <returns></returns>
        public T Find(params object[] keys)
        {
            try
            {
                return _dbSet.Find(keys);
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                return null;
            }
        }

        /// <summary>
        /// Method fetches the entity by Id
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public T GetById(object id)
        {
            try
            {
                // var id = id;
                return _dbSet.Find(id);
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                return null;
            }
        }

        /// <summary>
        /// Method fetches the first or default item from the datacontext based on the the supplied function.
        /// </summary>
        /// <param name="predicate"></param>
        /// <returns></returns>
        public T FirstOrDefault(Expression<Func<T, bool>> predicate)
        {
            try
            {
                return _dbSet.FirstOrDefault(predicate);
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                return null;
            }
        }

        /// <summary>
        /// Method fetches the first record based on the supplied function.
        /// </summary>
        /// <param name="predicate"></param>
        /// <returns></returns>
        public T First(Func<T, bool> predicate)
        {
            try
            {
                return _dbSet.First<T>(predicate);
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                return null;
            }
        }

        /// <summary>
        /// Method Fetches the particular single record based on the supplied function.
        /// </summary>
        /// <param name="predicate"></param>
        /// <returns></returns>
        public T Single(Func<T, bool> predicate)
        {
            try
            {
                return _dbSet.Single<T>(predicate);
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                return null;
            }
        }

        /// <summary>
        /// Method Fetches all the data before executing query.
        /// </summary>
        /// <returns></returns>
        public IQueryable<T> GetAll()
        {
            try
            {
                return _dbSet.AsQueryable();
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                return null;
            }
        }

        /// <summary>
        /// Method Checks whether dbset has anything entity in it or not.
        /// </summary>
        /// <param name="predicate"></param>
        /// <returns></returns>
        public bool Contains(Expression<Func<T, bool>> predicate)
        {
            try
            {
                return _dbSet.Any(predicate);
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                return false;
            }
        }

        /// <summary>
        /// Method save the changes into the context
        /// </summary>
        public void SaveChanges()
        {
            try
            {
                _context.SaveChanges();
                //commit transaction on successful save operation
                if (_transaction != null)
                    _transaction.Commit();
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                //Rollback all transaction if any exception occures during transaction.
                if (_transaction != null)
                    _transaction.Rollback();
                throw;

            }

        }

        /// <summary>
        /// Method deletes the entity from the datacontext by Id
        /// </summary>
        /// <param name="id"></param>
        public void Delete(object id)
        {
            try
            {
                _transaction = _context.Database.BeginTransaction();
                var entityToDelete = _dbSet.Find(id);
                if (entityToDelete != null)
                    _dbSet.Remove(entityToDelete);
                //Delete(entityToDelete);
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);

            }
        }

        /// <summary>
        /// Method deletes the entity from the datacontext.
        /// </summary>
        /// <param name="entity"></param>
        public void Delete(T entity)
        {
            try
            {
                // start new sql transaction for database operation.
                _transaction = _context.Database.BeginTransaction();
                if (_context.Entry(entity).State == EntityState.Detached)
                {
                    _dbSet.Attach(entity);
                }
                _dbSet.Remove(entity);
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);

            }
        }

        /// <summary>
        /// Delete the list of objects from database.
        /// </summary>
        /// <param name="entities"> Specify list of existing objects to delete. </param>
        public void DeleteRange(IEnumerable<T> entities)
        {
            try
            {
                // start new sql transaction for database operation.
                _transaction = _context.Database.BeginTransaction();
                entities.ToList().ForEach(x =>
                {
                    if (_context.Entry(x).State == EntityState.Detached)
                    {
                        _dbSet.Attach(x);
                    }
                });
                _dbSet.RemoveRange(entities);
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);

            }
        }

        /// <summary>
        /// Method deletes the entity based on the supplied function.
        /// </summary>
        /// <param name="predicate"></param>
        public void Delete(Expression<Func<T, bool>> predicate)
        {
            try
            {
                // start new sql transaction for database operation.
                _transaction = _context.Database.BeginTransaction();
                var entitiesToDelete = Fetch(predicate);
                foreach (var entity in entitiesToDelete)
                {
                    if (_context.Entry(entity).State == EntityState.Detached)
                    {
                        _dbSet.Attach(entity);
                    }
                    _dbSet.Remove(entity);
                }
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);

            }
        }

        /// <summary>
        /// Method call on dispose calls.
        /// </summary>
        public void Dispose()
        {
            try
            {
                Dispose(true);
                GC.SuppressFinalize(this);
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
            }
        }

        /// <summary>
        /// Method Disposes the Context.
        /// </summary>
        /// <param name="disposing"></param>
        private void Dispose(bool disposing)
        {
            try
            {
                if (!_isDisposed)
                {
                    if (disposing)
                    {
                        if (_context != null)
                        {
                            _context.Dispose();
                        }
                        _isDisposed = true;
                    }
                }
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);

            }

        }

        /// <summary>
        /// Public Destructor.
        /// </summary>
        ~DataRepository()
        {
            try
            {
                Dispose(false);
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);

            }
        }

        #endregion
    }
}
