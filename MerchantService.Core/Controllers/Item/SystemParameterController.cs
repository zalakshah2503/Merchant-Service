using MerchantService.Core.Global;
using MerchantService.DomainModel.Models.SystemParameters;
using MerchantService.Repository.ApplicationClasses.SystemParameter;
using MerchantService.Repository.Helper;
using MerchantService.Repository.Modules.Global;
using MerchantService.Repository.Modules.Item;
using MerchantService.Utility.Logger;
using System;
using System.Collections.Generic;
using System.Web.Http;

namespace MerchantService.Core.Controllers.Item
{
    //[DynamicAuthorize]
    public class SystemParameterController : BaseController
    {
        #region "Private Member(s)"

        private readonly IErrorLog _errorLog;
        private readonly ISystemParameterRepository _systemParameterContext;
        private readonly int companyId;
        #endregion

        #region "Constructor & Destructor(s)"

        public SystemParameterController(IErrorLog errorLog, ISystemParameterRepository systemParameterContext, IMerchantDataRepository merchantDataRepository)
            : base(errorLog, merchantDataRepository)
        {
            _errorLog = errorLog;
            _systemParameterContext = systemParameterContext;
            companyId = MerchantContext.CompanyDetails.Id;
        }
        #endregion

        #region "Public Method(s)"
        /// <summary>
        /// this method is used from get constant list.- ps 
        /// </summary>
        /// <returns>returns list of constants</returns>
        [HttpGet]
        [Route("api/SystemParameter/GetConstantList")]
        public IHttpActionResult GetConstantList()
        {
            try
            {
                List<Param> constantList = _systemParameterContext.GetParamList();
                return Ok(constantList);
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        /// <summary>
        /// this method is used to get parameter list by param id. - ps
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>

        [HttpGet]
        [Route("api/SystemParameter/GetParameterListById")]
        public IHttpActionResult GetParameterListById(int id)
        {
            try
            {
                List<ParamType> paramTypeList = _systemParameterContext.GetSystemParameterListById(id);
                return Ok(paramTypeList);
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
        [HttpGet]
        [Route("api/SystemParameter/GetSystemParameterListById")]
        public IHttpActionResult GetSystemParameterListById(int id)
        {
            try
            {
                List<SystemParameter> systemParameterList = _systemParameterContext.GetSysParameterListById(id,companyId);
                return Ok(systemParameterList);
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        /// <summary>
        /// add/update parameter name in databse. - ps
        /// </summary>
        /// <param name="paramType"></param>
        /// <returns></returns>
        [HttpPost]
        [Route("api/SystemParameter/SaveParameterName")]
        public IHttpActionResult SaveParameterName(ParamType paramType)
        {
            try
            {
                //check parameter name exist or not.
                bool isParameterValueEnExist = _systemParameterContext.CheckParamterNameEnExistOrNot(paramType);
                bool isParameterValueSlExist = _systemParameterContext.CheckParameterNameSlExistOrNot(paramType);
                if (isParameterValueEnExist || isParameterValueSlExist)
                {
                    return Ok(new { isParameterValueEnExist = isParameterValueEnExist, isParameterValueSlExist = isParameterValueSlExist });
                }
                if (paramType.Id == 0)
                {
                    ParamType paramTypes = _systemParameterContext.AddParamName(paramType);
                    return Ok(paramTypes);
                }
                ParamType paramTypeDetail = _systemParameterContext.UpdateParamName(paramType);
                return Ok(paramTypeDetail);

            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }



        /// <summary>
        /// add systemparameter in databse. - JJ
        /// </summary>
        /// <param name="paramType">return added SystemParameter object</param>
        [HttpPost]
        [Route("api/SystemParameter/SaveSystemParameterName")]

        public IHttpActionResult SaveSystemParameterName(SystemParameter systemParameter)
        {
            try
            {
                //check parameter name exist or not.
                bool isParameterValueEnExist = _systemParameterContext.CheckSysParamterNameEnExistOrNot(systemParameter,companyId);
                bool isParameterValueSlExist = _systemParameterContext.CheckSysParameterNameSlExistOrNot(systemParameter,companyId);
                if (isParameterValueEnExist || isParameterValueSlExist)
                {
                    return Ok(new { isParameterValueEnExist = isParameterValueEnExist, isParameterValueSlExist = isParameterValueSlExist });
                }
                if (systemParameter.Id == 0)
                {
                    SystemParameter systemParameters = _systemParameterContext.AddSysParameterName(systemParameter, companyId);
                    return Ok(systemParameters);
                }
                else
                {
                    SystemParameter systemParameterDetail = _systemParameterContext.UpdateSysParameterName(systemParameter);
                    return Ok(systemParameterDetail);
                }
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        /// <summary>
        /// this method is used for fetch param type object at the time of edit. -ps
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [Route("api/SystemParameter/EditSystemParameterData")]
        [HttpGet]
        public IHttpActionResult EditSystemParameterData(int id)
        {
            try
            {
                ParamType paramType = _systemParameterContext.GetParamTypeById(id);
                return Ok(paramType);
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        /// <summary>
        /// this method is used for fetch SystemParameter object at the time of edit. - JJ
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [Route("api/SystemParameter/EditSysParameterData")]
        [HttpGet]
        public IHttpActionResult EditSysParameterData(int id)
        {
            try
            {
                SystemParameter systemParameter = _systemParameterContext.GetSysParameterById(id);
                return Ok(systemParameter);
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        /// <summary>
        /// this method is used for soft delete system parameter in database. - ps
        /// </summary>
        /// <param name="paramTypeId"></param>
        /// <returns></returns>
        [Route("api/SystemParameter/DeleteSystemParameter")]
        [HttpPost]
        public IHttpActionResult DeleteSystemParameter(int paramTypeId)
        {
            try
            {
                bool isDeleted = _systemParameterContext.DeleteSystemParameter(paramTypeId);
                return Ok(new { isDeleted = isDeleted });
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }



        /// <summary>
        /// this method is used for soft delete system parameter in database. - JJ
        /// </summary>
        /// <param name="paramTypeId"></param>
        /// <returns></returns>
        [Route("api/SystemParameter/DeleteSysParameter")]
        [HttpPost]
        public IHttpActionResult DeleteSysParameter(int systemParameterId)
        {
            try
            {
                string status = _systemParameterContext.DeleteSysParameter(systemParameterId);
                return Ok(new { status = status });
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        [HttpGet]
        [Route("api/SystemParameter/GetParamTypeByParamId")]
        public IHttpActionResult GetParamTypeByParamId(int paramId)
        {
            try
            {
                List<ParamType> paramTypeList = _systemParameterContext.GetParamTypeByParamId(paramId);
                var paramTypeCollection = new List<ParamTypeAc>();
                var paramTypeAC = new ParamTypeAc();
                foreach (var paramType in paramTypeList)
                {
                    paramTypeAC = ApplicationClassHelper.ConvertType<ParamType, ParamTypeAc>(paramType);
                    paramTypeAC.Id = paramType.Id;
                    paramTypeCollection.Add(paramTypeAC);
                }
                return Ok(paramTypeCollection);
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
