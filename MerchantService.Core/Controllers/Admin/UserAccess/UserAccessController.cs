using MerchantService.Repository.Modules.Admin.ManageUserAccess;
using System.Web;
using System.Web.Http;
using System.Collections.Generic;
using MerchantService.DomainModel.Models.UserAccess;
using MerchantService.Repository.ApplicationClasses.Admin.UserAccess;
using System;


namespace MerchantService.Core.Controllers.Admin.UserAccess
{
    //[DynamicAuthorize]
    [RoutePrefix("api/UserAccess")]
    public class UserAccessController : ApiController
    {
        #region Private Variables
        private readonly IManageUserAccessRepository _manageUserAccessRepositoryContext;
        #endregion

        #region Constructor
        public UserAccessController(IManageUserAccessRepository manageUserAccessRepositoryContext)
        {
            _manageUserAccessRepositoryContext = manageUserAccessRepositoryContext;
        }
        #endregion

        #region Public Methods                    
        /// <summary>
        /// This method used for get all user access page list and also check page is Active or not using by role Id -An
        /// </summary>
        /// <param name="roleId">pass role Id</param>
        /// <returns></returns>
        [Route("GetUserAccessListbyId")]
        [HttpGet]
        public IHttpActionResult GetUserAccessListbyId(int roleId)
        {
            if (HttpContext.Current.User.Identity.IsAuthenticated)
            {
                List<UserAccessDetailAC> listOfUserAccessDetail = new List<UserAccessDetailAC>();
                List<Form> listOfForm = _manageUserAccessRepositoryContext.GetListOfForm();
                List<UserAccessDetail> listOfUserAccessIsActiveDetail = _manageUserAccessRepositoryContext.GetUserAccessDetailByRoleId(roleId);
                foreach (var formObject in listOfForm)
                {
                    bool IsActive = false;
                    int userAccesId = 0;
                    UserAccessDetailAC userAccessDetail = new UserAccessDetailAC();
                    userAccessDetail.FormId = formObject.Id;
                    userAccessDetail.FormName = formObject.FormName;
                    userAccessDetail.FormDescription = formObject.FormDescription;
                    userAccessDetail.roleId = roleId;
                    foreach (var userAccessIsActiveDetailObject in listOfUserAccessIsActiveDetail)
                    {
                        if (userAccessDetail.FormId == userAccessIsActiveDetailObject.FormId)
                        {
                            userAccesId = userAccessIsActiveDetailObject.Id;
                            IsActive = true;
                        }
                    }
                    if (IsActive)
                    {
                        userAccessDetail.IsActive = true;
                        userAccessDetail.UserAccessId = userAccesId;
                    }
                    else
                        userAccessDetail.IsActive = false;

                    listOfUserAccessDetail.Add(userAccessDetail);
                }
                return Ok(listOfUserAccessDetail);
            }
            else
                return BadRequest();
        }

        /// <summary>
        /// This method used for insert/update user access details. -An
        /// </summary>
        /// <param name="updateUserAccessDetail">pass updated user access details</param>
        /// <returns></returns>
        [Route("UpdateUserAccessDetail")]
        [HttpPut]
        public IHttpActionResult UpdateUserAccessDetail(List<UserAccessDetailAC> updateUserAccessDetail)
        {
            if (HttpContext.Current.User.Identity.IsAuthenticated)
            {
                _manageUserAccessRepositoryContext.DeleteUserAccessDetail(updateUserAccessDetail[0].roleId);
                foreach (var updateUserAccesDetailobject in updateUserAccessDetail)
                {
                    if (updateUserAccesDetailobject.IsActive)
                    {
                        UserAccessDetail userDetails = new UserAccessDetail();
                        userDetails.FormId = updateUserAccesDetailobject.FormId;
                        userDetails.CreatedDateTime = DateTime.UtcNow;
                        userDetails.IsActive = true;
                        userDetails.RoleId = updateUserAccesDetailobject.roleId;
                        _manageUserAccessRepositoryContext.AddUserAccessDetail(userDetails);
                    }
                }
                return Ok(new { IsResult = true });
            }
            else
                return BadRequest();
        }

        /// <summary>
        /// This method used fro check atleast one user access page exists in user access table. -An 
        /// </summary>
        /// <param name="roleId"></param>
        /// <returns></returns>
        [Route("GetUserAccessPageByRoleId")]
        [HttpGet]
        public IHttpActionResult GetUserAccessPageByRoleId(int roleId)
        {
            if (HttpContext.Current.User.Identity.IsAuthenticated)
            {
                bool result = _manageUserAccessRepositoryContext.CheckUserAccessDetailExistsByRoleId(roleId);
                return Ok(new { IsResult = result });
            }
            else
                return BadRequest();
        }

        /// <summary>
        /// This method used fro check atleast one user access page exists in user access table. -An 
        /// </summary>
        /// <param name="roleId"></param>
        /// <returns></returns>
        [Route("getUserAccessActivePageByRoleId/{roleId}")]
        [HttpGet]
        public IHttpActionResult GetUserAccessActivePageByRoleId(int roleId)
        {
            if (HttpContext.Current.User.Identity.IsAuthenticated)
            {
                List<ActivePageList> listOfUserAccessDetail = _manageUserAccessRepositoryContext.GetUserActiveAccessDetailByRoleId(roleId);
                return Ok(new { isResult = listOfUserAccessDetail });
            }
            else
                return BadRequest();
        }

        /// <summary>
        /// This method used fro check login user access current page. -An 
        /// </summary>
        /// <param name="roleId">pass login user role id</param>
        /// <param name="url">pass page url</param>
        /// <param name="pageName">pass page name</param>
        /// <returns></returns>
        [Route("checkCurrentUserAllowToAccessPage/{roleId}/{pageName}")]
        [HttpGet]
        public IHttpActionResult CheckLoginUserAccessToCurrentPage(int roleId, string pageName)
        {
            if (HttpContext.Current.User.Identity.IsAuthenticated)
            {
                bool isAllow = _manageUserAccessRepositoryContext.CheckLoginUserAccessCurrentPage(roleId, pageName);
                return Ok(new { isResult = isAllow });
            }
            else
                return BadRequest();
        }
        #endregion
    }
}
