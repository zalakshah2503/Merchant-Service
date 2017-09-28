using MerchantService.DomainModel.Models.Item;
using MerchantService.DomainModel.Models.SystemParameters;
using MerchantService.Repository.DataRepository;
using MerchantService.Utility.Logger;
using System;
using System.Collections.Generic;
using System.Linq;

namespace MerchantService.Repository.Modules.Item
{
    public class SystemParameterRepository : ISystemParameterRepository
    {

        #region "Private Variable(s)"


        private readonly IErrorLog _errorLog;
        private readonly IDataRepository<Param> _paramContext;
        private readonly IDataRepository<ParamType> _paramTypeContext;
        private readonly IDataRepository<SystemParameter> _systemParameterContext;
        private readonly IDataRepository<ItemProfile> _itemProfileContext;
        private readonly IDataRepository<Category> _categoryContext;
        #endregion

        #region "Constructor & Destructor(s)"

        public SystemParameterRepository(IErrorLog errorLog, IDataRepository<Param> paramContext, IDataRepository<ParamType> paramTypeContext, IDataRepository<SystemParameter> systemParameterContext, IDataRepository<ItemProfile> itemProfileContext, IDataRepository<Category> categoryContext)
        {
            _errorLog = errorLog;
            _paramContext = paramContext;
            _paramTypeContext = paramTypeContext;
            _systemParameterContext = systemParameterContext;
            _itemProfileContext = itemProfileContext;
            _categoryContext = categoryContext;

        }
        #endregion

        #region "Dispose Method(s)"
        /// <summary>
        /// Method disposes the repository context 
        /// </summary>
        public void Dispose()
        {
            try
            {
                _systemParameterContext.Dispose();
                _itemProfileContext.Dispose();
                _paramTypeContext.Dispose();
                _paramContext.Dispose();
                _categoryContext.Dispose();
                GC.SuppressFinalize(this);
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);

            }
        }

        #endregion

        #region Public Method(s)"

        public List<Param> GetParamList()
        {
            try
            {
                List<Param> paramList = _paramContext.Fetch(x => !x.IsDeleted && x.IsAdd).OrderBy(x => x.Value).ToList();
                return paramList;
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        public List<ParamType> GetSystemParameterListById(int id)
        {
            try
            {
                List<ParamType> paramTypeList = _paramTypeContext.Fetch(x => !x.IsDeleted && x.ParamId == id).ToList();
                return paramTypeList;
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        /// <summary>
        /// get system parameter list from database. - JJ
        /// </summary>
        /// <param name="id"></param>
        /// <returns>list of SystemParameter</returns>
        public List<SystemParameter> GetSysParameterListById(int id, int companyId)
        {
            try
            {
                List<SystemParameter> systemParameterList = _systemParameterContext.Fetch(x => !x.IsDelete && x.ParamId == id && x.CompanyId == companyId).ToList();
                return systemParameterList;
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        public ParamType AddParamName(ParamType paramType)
        {
            try
            {
                paramType.CreatedDateTime = DateTime.UtcNow;
                _paramTypeContext.Add(paramType);
                _paramTypeContext.SaveChanges();
                return paramType;
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        /// <summary>
        /// add parameter list in databse. - JJ
        /// </summary>
        /// <param name="paramType">return added SystemParameter object</param>
        public SystemParameter AddSysParameterName(SystemParameter systemParameter, int companyId)
        {
            try
            {
                systemParameter.CreatedDateTime = DateTime.UtcNow;
                systemParameter.CompanyId = companyId;
                _systemParameterContext.Add(systemParameter);
                _systemParameterContext.SaveChanges();
                return systemParameter;
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        public bool CheckParamterNameEnExistOrNot(ParamType paramType)
        {
            try
            {
                return _paramTypeContext.Fetch(x => x.ValueEn.ToLower() == paramType.ValueEn.ToLower() && x.ParamId == paramType.ParamId && x.Id != paramType.Id && x.IsDeleted == false).Any();
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        /// <summary>
        /// check parameter name in english exist in databse or not. - JJ
        /// </summary>
        /// <param name="paramType"></param>
        /// <returns>return true if parameter name already exist,otherwise false</returns>
        public bool CheckSysParamterNameEnExistOrNot(SystemParameter systemParameter, int companyId)
        {
            try
            {
                return _systemParameterContext.Fetch(x => x.ValueEn.ToLower() == systemParameter.ValueEn.ToLower() && x.ParamId == systemParameter.ParamId && x.Id != systemParameter.Id && x.IsDelete == false && x.CompanyId == companyId).Any();
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        public bool CheckParameterNameSlExistOrNot(ParamType paramType)
        {
            try
            {
                return _paramTypeContext.Fetch(x => x.ValueSl.ToLower() == paramType.ValueSl.ToLower() && x.ParamId == paramType.ParamId && x.Id != paramType.Id && x.IsDeleted == false).Any();
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        /// <summary>
        /// check parameter name in secondary language exist in databse or not. - JJ
        /// </summary>
        /// <param name="paramType"></param>
        /// <returns>return true if parameter name already exist,otherwise false</returns>
        public bool CheckSysParameterNameSlExistOrNot(SystemParameter systemParameter,int companyId)
        {
            try
            {
                return _systemParameterContext.Fetch(x => x.ValueSl.ToLower() == systemParameter.ValueSl.ToLower() && x.ParamId == systemParameter.ParamId && x.Id != systemParameter.Id && x.IsDelete == false && x.CompanyId == companyId).Any();
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        public ParamType GetParamTypeById(int id)
        {
            try
            {
                return _paramTypeContext.FirstOrDefault(x => x.Id == id);
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        /// <summary>
        /// get paramtype object by given id. - JJ
        /// </summary>
        /// <param name="id"></param>
        /// <returns>return SystemParameter object</returns>
        public SystemParameter GetSysParameterById(int id)
        {
            try
            {
                return _systemParameterContext.FirstOrDefault(x => x.Id == id);
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }



        public ParamType UpdateParamName(ParamType paramType)
        {
            try
            {
                ParamType paramDetail = _paramTypeContext.FirstOrDefault(x => x.Id == paramType.Id);
                paramDetail.ValueEn = paramType.ValueEn;
                paramDetail.ValueSl = paramType.ValueSl;
                paramDetail.ModifiedDateTime = DateTime.UtcNow;
                _paramTypeContext.Update(paramDetail);
                _paramTypeContext.SaveChanges();
                return paramDetail;
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        /// <summary>
        /// this method is used for update SystemParameter name. - JJ
        /// </summary>
        /// <param name="paramType"></param>
        /// <returns>return updated param type object</returns>
        public SystemParameter UpdateSysParameterName(SystemParameter systemParameter)
        {
            try
            {
                SystemParameter paramDetail = _systemParameterContext.FirstOrDefault(x => x.Id == systemParameter.Id);
                paramDetail.ValueEn = systemParameter.ValueEn;
                paramDetail.ValueSl = systemParameter.ValueSl;
                paramDetail.ModifiedDateTime = DateTime.UtcNow;
                _systemParameterContext.Update(paramDetail);
                _systemParameterContext.SaveChanges();
                return paramDetail;
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        public bool DeleteSystemParameter(int paramTypeId)
        {
            try
            {
                bool isDelete = false;
                //check param type is exist in any active item.
                bool isAnyActiveItem = _itemProfileContext.Fetch(x => x.UnitParamTypeId == paramTypeId && x.IsActive).Any();
                if (!isAnyActiveItem)
                {
                    ParamType paramType = _paramTypeContext.FirstOrDefault(x => x.Id == paramTypeId);
                    paramType.IsDeleted = true;
                    _paramTypeContext.Update(paramType);
                    _paramTypeContext.SaveChanges();
                    isDelete = true;
                    return isDelete;
                }
                return isDelete;


            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        /// <summary>
        /// this method is used for delete(soft delete) system parameter name in database. -JJ
        /// </summary>
        /// <param name="paramTypeId"></param>
        /// <returns>return true if parameter name is deleted otherwise false</returns>
        public string DeleteSysParameter(int systemParameterId)
        {
            try
            {
                           
                string status = "";
                //check param type is exist in any active item.
                int ActiveItem = _itemProfileContext.Fetch(x => x.UnitParamTypeId == systemParameterId && x.IsActive).Count();
                int Category = _categoryContext.Fetch(x => (x.BrandParamTypeId == systemParameterId || x.GroupParamTypeId == systemParameterId) && x.IsDelete == false).Count();
                if (ActiveItem == 0)
                {
                    if (Category == 0)
                    {
                        SystemParameter systemParameter = _systemParameterContext.FirstOrDefault(x => x.Id == systemParameterId);
                        systemParameter.IsDelete = true;
                        _systemParameterContext.Update(systemParameter);
                        _systemParameterContext.SaveChanges();
                        status = "";
                        return status;
                    }
                    else
                    {
                        return "Being Used By " + Category +" Categoty(s), Please Delete Brand/Group Association First, Using (Manage Category Form),Then Proceed to Delete ";
                    }
                }
                else
                {
                    return "Unit is Being Used By " + ActiveItem + " Item(s), Please Delete Item First, Then Procees to Delete";
                }
              

            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        public List<ParamType> GetParamTypeByParamId(int paramId)
        {
            try
            {
                var paramTypeList = _paramTypeContext.GetAll().Where(x => x.ParamId == paramId).ToList();
                return paramTypeList;
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        
        #endregion

    }
}
