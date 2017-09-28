using MerchantService.DomainModel.Models.SystemParameters;
using System;
using System.Collections.Generic;

namespace MerchantService.Repository.Modules.Item
{
   public interface ISystemParameterRepository : IDisposable
    {
        /// <summary>
        /// get paramlist from databse. - ps
        /// </summary>
        /// <returns>list of param</returns>
        List<Param> GetParamList();


        /// <summary>
        /// get system parameter list from database. - ps
        /// </summary>
        /// <param name="id"></param>
        /// <returns>list of paramtype</returns>
        List<ParamType> GetSystemParameterListById(int id);

        /// <summary>
        /// get system parameter list from database. - JJ
        /// </summary>
        /// <param name="id"></param>
        /// <returns>list of SystemParameter</returns>
        List<SystemParameter> GetSysParameterListById(int id,int companyId);

        /// <summary>
        /// add parameter list in databse. - ps
        /// </summary>
        /// <param name="paramType">return added param type object</param>
        ParamType AddParamName(ParamType paramType);

        /// <summary>
        /// add systemparameter in databse. - JJ
        /// </summary>
        /// <param name="paramType">return added SystemParameter object</param>
        SystemParameter AddSysParameterName(SystemParameter systemParameter, int companyId);


        /// <summary>
        /// check parameter name in english exist in databse or not. - ps
        /// </summary>
        /// <param name="paramType"></param>
        /// <returns>return true if parameter name already exist,otherwise false</returns>
        bool CheckParamterNameEnExistOrNot(ParamType paramType);


        /// <summary>
        /// check parameter name in english exist in databse or not. - JJ
        /// </summary>
        /// <param name="systemParameter" and "companyId"></param>
        /// <returns>return true if parameter name already exist,otherwise false</returns>
        bool CheckSysParamterNameEnExistOrNot(SystemParameter systemParameter, int companyId);

        /// <summary>
        /// check parameter name in secondary language exist in databse or not. - ps
        /// </summary>
        /// <param name="paramType"></param>
        /// <returns>return true if parameter name already exist,otherwise false</returns>
        bool CheckParameterNameSlExistOrNot(ParamType paramType);

        /// <summary>
        /// check parameter name in secondary language exist in databse or not. - JJ
        /// </summary>
        /// <param name="paramType"></param>
        /// <returns>return true if parameter name already exist,otherwise false</returns>
        bool CheckSysParameterNameSlExistOrNot(SystemParameter systemParameter, int companyId);


        /// <summary>
        /// get paramtype object by given id. - ps
        /// </summary>
        /// <param name="id"></param>
        /// <returns>return param type object</returns>
        ParamType GetParamTypeById(int id);

        /// <summary>
        /// get paramtype object by given id. - JJ
        /// </summary>
        /// <param name="id"></param>
        /// <returns>return SystemParameter object</returns>
        SystemParameter GetSysParameterById(int id);

        /// <summary>
        /// this method is used for update param name. - ps
        /// </summary>
        /// <param name="paramType"></param>
        /// <returns>return updated param type object</returns>
        ParamType UpdateParamName(ParamType paramType);


        /// <summary>
        /// this method is used for update SystemParameter name. - JJ
        /// </summary>
        /// <param name="paramType"></param>
        /// <returns>return updated param type object</returns>
        SystemParameter UpdateSysParameterName(SystemParameter systemParameter);

        /// <summary>
        /// this method is used for delete(soft delete) system parameter name in database. -ps
        /// </summary>
        /// <param name="paramTypeId"></param>
        /// <returns>return true if parameter name is deleted otherwise false</returns>
        bool DeleteSystemParameter(int paramTypeId);


        /// <summary>
        /// this method is used for delete(soft delete) system parameter name in database. -JJ
        /// </summary>
        /// <param name="paramTypeId"></param>
        /// <returns>return true if parameter name is deleted otherwise false</returns>
        string DeleteSysParameter(int systemParameterId);

        /// <summary>
        /// This method is used for getting the list of param type value by param id. SP
        /// </summary>
        /// <param name="ParamId">param id</param>
        /// <returns></returns>
        List<ParamType> GetParamTypeByParamId(int paramId);

    }
}
