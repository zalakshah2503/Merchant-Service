using MerchantService.DomainModel.Models;
using MerchantService.Repository.DataRepository;
using MerchantService.Utility.Logger;
using System;
using System.Collections.Generic;
using System.Linq;
using MerchantService.DomainModel.Models.Company;
using MerchantService.Utility.Constants;
using MerchantService.DomainModel.Models.WorkFlow;

namespace MerchantService.Repository.Modules.Admin
{
    public class UserDetailRepository : IUserDetailRepository
    {
        #region Private Variables
        private readonly IDataRepository<UserDetail> _userDetailContext;
        private readonly IDataRepository<CompanyDetail> _companyDetailContext;
        private readonly IDataRepository<WorkFlowDetail> _workFlowDetailContext;
        private readonly IErrorLog _errorLog;
        #endregion

        #region Constructor
        public UserDetailRepository(IDataRepository<UserDetail> userDetailContext, IDataRepository<CompanyDetail> companyDetailContext,
            IDataRepository<WorkFlowDetail> workFlowDetailContext, IErrorLog errorLog)
        {
            _companyDetailContext = companyDetailContext;
            _userDetailContext = userDetailContext;
            _workFlowDetailContext = workFlowDetailContext;
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
                _userDetailContext.Dispose();
                _companyDetailContext.Dispose();
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
        /// This method used for get user detail by user Id. -An
        /// </summary>
        /// <param name="userId">pass owin user id.</param>
        /// <returns>userDetail object</returns>
        public UserDetail GetUserDetailUserId(string userId)
        {
            try
            {
                return _userDetailContext.FirstOrDefault(x => x.UserId == userId && x.IsDelete == false && x.IsActive);
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }

        }

        /// <summary>
        /// This method usd for get cashier List By Branch Id. -An
        /// </summary>
        /// <returns></returns>
        public List<UserDetail> GetUserListByBranchId(int branchId)
        {
            try
            {
                return _userDetailContext.Fetch(x => x.BranchId == branchId).ToList();
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }

        }


        /// <summary>
        /// This method used for get cashier list by comapny Id. -An 
        /// </summary>
        /// <param name="companyId"></param>
        /// <returns></returns>
        public List<UserDetail> GetCashierListByCompanyId(int companyId)
        {
            try
            {
                return _userDetailContext.Fetch(x => x.Branch.CompanyId == companyId && x.Role.RoleName == "Cashier").ToList();
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }

        }

        /// <summary>
        /// This method is used to get user list - JJ
        /// </summary>
        /// <param name="userName"></param>
        /// <returns>This method returns list of UserDetail</returns>
        public List<UserDetail> GetUserList(string userName)
        {
            try
            {
                if (userName == StringConstants.AdminName)
                {
                    var userList = _userDetailContext.Fetch(x => !x.IsDelete && x.RoleName == "Admin").OrderByDescending(x => x.CreatedDateTime).ToList();
                    userList.ForEach(x =>
                        {
                            x.RoleName = x.Role.RoleName;
                        });
                    return userList;
                }
                else
                {
                    var currentUser = _userDetailContext.First(x => x.UserName == userName && x.IsDelete == false);
                    var userId = currentUser.UserId;
                    var companyList = _companyDetailContext.Fetch(x => x.UserId == userId && !x.IsDeleted);
                    var userList = new List<UserDetail>();
                    foreach (var company in companyList)
                    {
                        userList = _userDetailContext.Fetch(x => !x.IsDelete && x.CompanyId == company.Id).OrderByDescending(x => x.CreatedDateTime).ToList();
                        userList.ForEach(x =>
                        {
                            x.RoleName = x.Role.RoleName;
                        });
                    }
                    return userList;
                }
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        /// <summary>
        /// This method is used to add user - JJ
        /// </summary>
        /// <param name="userDetail">object of UserDetail</param>
        /// <param name="currentUserName">username of current user</param>
        /// <returns>return UserDetail object</returns>
        public UserDetail AddUserDetail(UserDetail userDetail, string currentUserName)
        {
            try
            {
                var user = _userDetailContext.Fetch(x => x.UserName == currentUserName && !x.IsDelete).FirstOrDefault();
                int companyId = 0;
                if (currentUserName != StringConstants.AdminName && _companyDetailContext.Fetch(x => x.UserId == user.UserId && !x.IsDeleted).Any())
                {
                    companyId = _companyDetailContext.Fetch(x => x.UserId == user.UserId && !x.IsDeleted).FirstOrDefault().Id;
                }
                UserDetail userdetail = new UserDetail()
                {
                    FullName = userDetail.FullName,
                    FullNameSl = userDetail.FullNameSl,
                    UserName = userDetail.UserName,
                    Email = userDetail.Email,
                    BranchId = userDetail.BranchId,
                    CompanyId = companyId,
                    EmployeeId = userDetail.EmployeeId,
                    JoinDate = userDetail.JoinDate,
                    LeaveDate = userDetail.LeaveDate,
                    TemporaryAddress = userDetail.TemporaryAddress,
                    IsSamePermanentAddress = userDetail.IsSamePermanentAddress,
                    PermanentAddress = userDetail.PermanentAddress,
                    MobileNumber = userDetail.MobileNumber,
                    PhoneNumber = userDetail.PhoneNumber,
                    RoleId = userDetail.RoleId,
                    RoleName = userDetail.RoleName,
                    SupervisorId = userDetail.SupervisorId,
                    Department = userDetail.Department,
                    JobTitle = userDetail.JobTitle,
                    IsActive = true,
                    CreatedDateTime = DateTime.UtcNow,
                    UserId = userDetail.UserId
                };
                _userDetailContext.Add(userdetail);
                _userDetailContext.SaveChanges();

                return userdetail;
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }



        /// <summary>
        /// This method is used to update userDetail - JJ
        /// </summary>
        /// <param name="userDetail">object of UserDetail</param>
        /// <returns>null</returns>

        public int UpdateUserDetail(UserDetail userDetail)
        {
            try
            {
                var updateUser = _userDetailContext.GetById(userDetail.Id);
                var userDeactivaed = 1;
                if (updateUser != null)
                {
                    updateUser.SupervisorId = userDetail.SupervisorId;
                    updateUser.Department = userDetail.Department;
                    updateUser.JoinDate = userDetail.JoinDate;
                    updateUser.LeaveDate = userDetail.LeaveDate;
                    updateUser.EmployeeId = userDetail.EmployeeId;
                    updateUser.TemporaryAddress = userDetail.TemporaryAddress;
                    updateUser.PermanentAddress = userDetail.PermanentAddress;
                    updateUser.IsSamePermanentAddress = userDetail.IsSamePermanentAddress;
                    if (!userDetail.IsActive)
                    {
                        if (CheckUserDeletable(userDetail.Id) == 1)
                            updateUser.IsActive = userDetail.IsActive;
                        else
                            userDeactivaed = 2;
                    }
                    else
                        updateUser.IsActive = userDetail.IsActive;
                    updateUser.IsDelete = userDetail.IsDelete;
                    updateUser.IsResetPassword = userDetail.IsResetPassword;
                    updateUser.PhoneNumber = userDetail.PhoneNumber;
                    updateUser.RoleName = userDetail.RoleName;
                    updateUser.RoleId = userDetail.RoleId;
                    updateUser.BranchId = userDetail.BranchId;
                    updateUser.CreatedDateTime = userDetail.CreatedDateTime;
                    updateUser.JobTitle = userDetail.JobTitle;
                    updateUser.FullName = userDetail.FullName;
                    updateUser.FullNameSl = userDetail.FullNameSl;
                    updateUser.MobileNumber = userDetail.MobileNumber;
                    updateUser.ModifiedDateTime = DateTime.UtcNow;
                    _userDetailContext.Update(updateUser);
                    _userDetailContext.SaveChanges();
                    return userDeactivaed;
                }
                return 0;
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        /// <summary>
        /// This method is used to fetch the user whose id is given. - JJ
        /// </summary>
        /// <param name="id"> id of user</param>
        /// <returns>return UserDetail object</returns>
        public UserDetail GetUserById(int id)
        {
            try
            {
                var user = _userDetailContext.GetById(id);
                return user;
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        /// <summary>
        /// This method is used to delete user from the system - JJ
        /// </summary>
        /// <param name="id">id of user</param>
        /// <returns>null</returns>

        public void DeleteUserDetail(int id)
        {
            try
            {
                _userDetailContext.Delete(id);
                _userDetailContext.SaveChanges();
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        /// <summary>
        /// Used to check whether there are any workflows for this user's role, if yes then any other eligible user is in this role - JJ
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public int CheckUserDeletable(int id)
        {
            try
            {
                var deletedUser = _userDetailContext.GetById(id);
                if (deletedUser != null)
                {
                    int canBeDeleted = 1;
                    if ((_workFlowDetailContext.Fetch(x => x.AssignedId == deletedUser.RoleId).ToList().Any()) && !(_userDetailContext.Fetch(x => x.IsActive && !x.IsDelete && x.RoleId == deletedUser.RoleId && x.Id != id).ToList().Any()))
                    {
                        canBeDeleted = 2;
                    }
                    return canBeDeleted;
                }
                return 0;
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        /// <summary>
        /// This method id used to check if user email exists or not - JJ
        /// </summary>
        /// <param name="email">Email of the non-registered user</param>
        /// <returns>if user email exist return true,otherwise false</returns>
        public bool CheckUserEmailExist(string email)
        {
            try
            {
                return _userDetailContext.Fetch(x => x.Email.ToLower() == email.ToLower() && x.IsDelete == false).Any();
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }



        /// <summary>
        /// This method is used to check if username exists or not - JJ
        /// </summary>
        /// <param name="username">username of the non-registered user</param>
        /// <returns>if username exist return true,otherwise false</returns>
        public bool CheckUserNameExist(string username)
        {
            try
            {
                return _userDetailContext.Fetch(x => x.UserName.ToLower() == username.ToLower() && !x.IsDelete).Any();
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }

        }

        /// <summary>
        /// This method is used to check if user with same mobile no. is already registered to the system - JJ 
        /// </summary>
        /// <param "mobile no." and "userId"></param>
        /// <returns>if user with given mobile no. exists return true,otherwise false</returns>
        public bool CheckMobileNoExist(string mobileno, int userId)
        {
            try
            {
                return _userDetailContext.Fetch(x => x.MobileNumber == mobileno && !x.IsDelete && x.Id != userId).Any();
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        /// <summary>
        /// This method is used to check if user with given employeeId and userId is already registered to the system - JJ 
        /// </summary>
        /// <param "employeeId" and "userId"></param>
        /// <returns>if user with given employeeId and userId exists return true,otherwise false</returns>
        public bool CheckEmployeeIdExist(string employeeId, int userId)
        {
            try
            {
                return _userDetailContext.Fetch(x => x.EmployeeId == employeeId && x.Id != userId).Any();
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        /// <summary>
        /// get all  user list
        /// </summary>
        /// <param name="userName"></param>
        /// <returns>list of UserDetail</returns>
        public List<UserDetail> GetAllUserList(string userName)
        {
            try
            {
                var currentUser = _userDetailContext.First(x => x.UserName == userName && x.IsDelete == false);
                var userId = currentUser.UserId;
                var companyList = _companyDetailContext.Fetch(x => x.UserId == userId);
                var userList = new List<UserDetail>();
                foreach (var company in companyList)
                {
                    var users = _userDetailContext.Fetch(x => !x.IsDelete && x.CompanyId == company.Id).ToList();
                    foreach (var user in users)
                    {
                        userList.Add(user);
                    }
                }
                return userList;
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        /// <summary>
        /// update the user password
        /// </summary>
        /// <param name="userId">contain userid to update the user passowrd.</param>
        public void UpdateUserPassword(string userId)
        {
            try
            {
                var userDetails = _userDetailContext.FirstOrDefault(x => x.UserId == userId);
                userDetails.IsResetPassword = false;
                userDetails.ModifiedDateTime = DateTime.UtcNow;
                _userDetailContext.Update(userDetails);
                _userDetailContext.SaveChanges();
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        /// <summary>
        /// Reset User Password
        /// </summary>
        /// <param name="userId">contain userid to reset user password.</param>
        public UserDetail ResetUserPassword(int userId)
        {
            try
            {
                var userDetails = _userDetailContext.GetById(userId);
                userDetails.IsResetPassword = true;
                userDetails.ModifiedDateTime = DateTime.UtcNow;
                _userDetailContext.Update(userDetails);
                _userDetailContext.SaveChanges();
                return userDetails;
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        /// <summary>
        /// This method is used to get user list - JJ
        /// </summary>
        /// <returns>This method returns list of UserDetail</returns>
        public List<UserDetail> GetAdminUserList()
        {
            try
            {
                var userList = _userDetailContext.Fetch(x => !x.IsDelete && x.RoleName == StringConstants.AdminRoleName).ToList();
                return userList;
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        public UserDetail GetUserDetailByUserName(string userName)
        {
            try
            {
                var userDetail = _userDetailContext.GetAll().FirstOrDefault(x => x.UserName == userName);
                return userDetail;
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
