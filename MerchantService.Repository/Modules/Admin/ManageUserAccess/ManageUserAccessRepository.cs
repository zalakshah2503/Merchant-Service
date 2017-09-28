using MerchantService.DomainModel.Models.UserAccess;
using MerchantService.Repository.ApplicationClasses.Admin.UserAccess;
using MerchantService.Repository.DataRepository;
using MerchantService.Utility.Logger;
using System;
using System.Collections.Generic;
using System.Linq;

namespace MerchantService.Repository.Modules.Admin.ManageUserAccess
{
    public class ManageUserAccessRepository : IManageUserAccessRepository, IDisposable
    {

        #region Private Variables
        private readonly IDataRepository<UserAccessDetail> _userAccessDetailContext;
        private readonly IDataRepository<Form> _formContext;
        private readonly IErrorLog _errorLog;
        #endregion

        #region Constructor
        public ManageUserAccessRepository(IDataRepository<UserAccessDetail> userAccessDetailContext, IErrorLog errorLog, IDataRepository<Form> formContext)
        {
            _userAccessDetailContext = userAccessDetailContext;
            _formContext = formContext;
            _errorLog = errorLog;
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
                _userAccessDetailContext.Dispose();
                GC.SuppressFinalize(this);
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
            }

        }

        #endregion

        #region Public Method

        /// <summary>
        /// This method used for get user access list. -An
        /// </summary>
        /// <returns>list of user access list</returns>
        public List<UserAccessDetail> GetUserAccessList()
        {
            try
            {
                return _userAccessDetailContext.GetAll().ToList();
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        /// <summary>
        /// This method used for insert user access details in User Access Detail Table. -An
        /// </summary>
        /// <param name="userAccessDetail">This object contain formId and Role Id,Is Active,Created DateTime</param>
        /// <returns>return primary key</returns>
        public int AddUserAccessDetail(UserAccessDetail userAccessDetail)
        {
            try
            {
                _userAccessDetailContext.Add(userAccessDetail);
                _userAccessDetailContext.SaveChanges();
                return userAccessDetail.Id;
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        /// <summary>
        /// This method used for update user access details in User Access Detail Table. -An 
        /// </summary>
        /// <param name="userAccessDetail">This oject contain formId,Id,RoleId,Is Active,Created DateTime</param>
        /// <returns>return primary key</returns>
        public int UpdateAccessDetail(UserAccessDetail userAccessDetail)
        {
            try
            {
                userAccessDetail.ModifiedDateTime = DateTime.UtcNow;
                _userAccessDetailContext.Update(userAccessDetail);
                _userAccessDetailContext.SaveChanges();
                return userAccessDetail.Id;

            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        /// <summary>
        /// This method used for get user access detail object by id. -An
        /// </summary>
        /// <param name="roleId">passed role Id</param>
        /// <returns>return user access details object</returns>
        public List<ActivePageList> GetUserActiveAccessDetailByRoleId(int roleId)
        {
            try
            {
                List<ActivePageList> listofActivePageList = new List<ActivePageList>();
                List<UserAccessDetail> listOfAccessDetails = _userAccessDetailContext.Fetch(x => x.RoleId == roleId && x.IsActive).ToList();
                var listOfGroupByParentsId = listOfAccessDetails.GroupBy(x => x.Form.ParentsId).OrderBy(x => x.Key);
                foreach (var itemofParnets in listOfGroupByParentsId)
                {
                    ActivePageList objActivePageList = new ActivePageList();
                    List<ActiveChildList> listofActiveChield = new List<ActiveChildList>();
                    //get form name using key
                    Form objForm = _formContext.FirstOrDefault(x => x.Id == itemofParnets.Key);
                    if (objForm.ParentsId == null)
                    {
                        objActivePageList.PageName = objForm.FormName; //Master Parnets Page Name
                        objActivePageList.Discription = objForm.FormDescription;
                        foreach (var itemofchieldPage in itemofParnets)//foreach loop for child pages.
                        {
                            ActiveChildList objActiveChildPage = new ActiveChildList();
                            if (itemofchieldPage.Form.ParentsId2 == null)//to check conditon for child page have sub child page or not.(when parnetId2 is define so this page have sub child page.)
                            {
                                objActiveChildPage.PageName = itemofchieldPage.Form.FormName;//child page name
                                objActiveChildPage.Discription = itemofchieldPage.Form.FormDescription;
                                listofActiveChield.Add(objActiveChildPage);
                            }
                            else
                            {
                                objActiveChildPage.PageName = itemofchieldPage.Form.MasterParents.FormName;//child page name
                                objActiveChildPage.Discription = itemofchieldPage.Form.MasterParents.FormDescription;
                                int isContains = listofActiveChield.Count(x => x.PageName.Contains(objActiveChildPage.PageName));
                                if (isContains == 0)
                                {
                                    List<ActiveSubChildList> listOfActiveSubChieldList = new List<ActiveSubChildList>();
                                    foreach (var item in itemofchieldPage.Form.MasterParents.MasterParentsCollection)//for loop for sub child pages.
                                    {
                                        if (item.UserAccessDetails.Any())//To Check Sub Child Page is active or not,When is active so UserAccessDetail Object is not null.
                                        {
                                            ActiveSubChildList activeSubChile = new ActiveSubChildList();
                                            activeSubChile.pageName = item.FormName;
                                            activeSubChile.Discription = item.FormDescription;
                                            listOfActiveSubChieldList.Add(activeSubChile);
                                        }
                                    }
                                    objActiveChildPage.listOfSubChieldList = listOfActiveSubChieldList;
                                    listofActiveChield.Add(objActiveChildPage);
                                }
                            }
                        }
                        objActivePageList.listOfChieldList = listofActiveChield;
                        listofActivePageList.Add(objActivePageList);
                    }

                }
                return listofActivePageList;
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        public List<UserAccessDetail> GetUserAccessDetailByRoleId(int roleId)
        {
            try
            {
                return _userAccessDetailContext.Fetch(x => x.RoleId == roleId).ToList();
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        /// <summary>
        /// This method used for delete user access detail by roleId. -An
        /// </summary>
        /// <param name="roleId">pass roleId</param>
        /// <returns>true/false</returns>
        public bool DeleteUserAccessDetail(int roleId)
        {
            try
            {
                _userAccessDetailContext.Delete(x => x.RoleId == roleId);
                _userAccessDetailContext.SaveChanges();
                return true;
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        /// <summary>
        /// This method used for check login user to allow access current page. -An
        /// </summary>
        /// <param name="roleId">pass login user role id</param>
        /// <param name="pageName">pass page name</param>
        /// <returns>if allow to user for access so retun true other wise false</returns>
        public bool CheckLoginUserAccessCurrentPage(int roleId, string pageName)
        {
            return _userAccessDetailContext.Contains(x => x.RoleId == roleId && x.Form.FormName == pageName);
        }

        public bool CheckUserAccessDetailExistsByRoleId(int roleId)
        {
            try
            {
                return _userAccessDetailContext.Contains(x => x.RoleId == roleId);
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        /// <summary>
        /// This method used for get form object by id. -An
        /// </summary>
        /// <returns></returns>
        public List<Form> GetListOfForm()
        {
            try
            {
                return _formContext.Fetch(x => x.IsActive == true).OrderBy(x => x.FormName).ToList();
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw ;
            }
        }

        #endregion

    }
}
