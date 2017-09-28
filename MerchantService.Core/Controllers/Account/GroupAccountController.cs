using System;
using System.Collections.Generic;
using System.Web;
using System.Web.Http;
using MerchantService.Utility.Logger;
using MerchantService.Repository.Modules.Account;
using MerchantService.DomainModel.Models.Accounting;
using MerchantService.Repository.ApplicationClasses.Account;
using MerchantService.Repository.Helper;
using MerchantService.Repository.Modules.Global;
using MerchantService.Core.Global;

namespace MerchantService.Core.Controllers.Account
{
    //[DynamicAuthorize]
    public class GroupAccountController : BaseController
    {
        #region Private Variable
        private readonly IErrorLog _errorLog;
        private readonly IGroupAccountRepository _groupAccountContext;
        private readonly int CurrentCompanyId = 0;
        #endregion

        #region Constructor
        public GroupAccountController(IErrorLog errorLog, IGroupAccountRepository groupRepository, IMerchantDataRepository merchantDataRepository)
            : base(errorLog, merchantDataRepository)
        {
            _errorLog = errorLog;
            _groupAccountContext = groupRepository;
            CurrentCompanyId = MerchantContext.CompanyDetails.Id;

        }
        #endregion

        #region Public Method
        /// <summary>
        /// This method is used for insert group record into database.
        /// </summary>
        /// <param name="group">GroupAccountAc object </param>
        /// <returns>return object of GroupAccountAc</returns>
        [HttpPost]
        [Route("api/GroupAccount/saveGroup")]
        public IHttpActionResult SaveGroup(GroupAccountAC group)
        {
            try
            {
                group.CompanyId = CurrentCompanyId;
                var groupDetails = _groupAccountContext.SaveGroup(group);
                //it will convert model class to appliation class based on naming conversions.
                group = ApplicationClassHelper.ConvertType<Group, GroupAccountAC>(groupDetails);
                group.GroupId = groupDetails.Id;
                return Ok(group);
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }



        /// <summary>
        /// This method is used for getting list of group.
        /// </summary>
        /// <returns>return list of GroupAccountAC</returns>
        [HttpGet]
        [Route("api/GroupAccount/getGroupList")]
        public IHttpActionResult GetGroupList()
        {
            try
            {
                if (HttpContext.Current.User.Identity.IsAuthenticated)
                {

                    var groupList = _groupAccountContext.GetGroupListByCompanyId(CurrentCompanyId);
                    var groupCollection = new List<GroupAccountAC>();
                    var groupAC = new GroupAccountAC();
                    foreach (var group in groupList)
                    {
                        //it will convert model class to appliation class based on naming conversions.
                        groupAC = ApplicationClassHelper.ConvertType<Group, GroupAccountAC>(group);
                        groupAC.GroupId = group.Id;
                        groupAC.HasBalanced = group.HasBalanced;
                        groupAC.UnderId = @group.UnderId ?? 0;
                        groupCollection.Add(groupAC);
                    }
                    return Ok(groupCollection);
                }
                return BadRequest();
            }
            catch (Exception ex)
            {

                _errorLog.LogException(ex);
                throw;
            }
        }

        /// <summary>
        /// This method is used for update group into database.
        /// </summary>
        /// <param name="group">object of GroupAccountAC</param>
        /// <returns>return object of GorupAccountAc</returns>
        [HttpPut]
        [Route("api/GroupAccount/UpdateGroup")]
        public IHttpActionResult UpdateGroup(GroupAccountAC group)
        {
            try
            {
                group.CompanyId = CurrentCompanyId;
                var groupDetail = _groupAccountContext.UpdateGroup(group);
                return Ok(groupDetail);
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
