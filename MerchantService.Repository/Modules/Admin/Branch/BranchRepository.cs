using MerchantService.DomainModel.Models;
using MerchantService.DomainModel.Models.Branch;
using MerchantService.DomainModel.Models.Company;
using MerchantService.DomainModel.Models.Item;
using MerchantService.Repository.ApplicationClasses.Admin;
using MerchantService.Repository.DataRepository;
using MerchantService.Utility.Logger;
using System;
using System.Collections.Generic;
using System.Linq;

namespace MerchantService.Repository.Modules.Admin
{
    public class BranchRepository : IBranchRepository
    {
        #region "Private Variable(s)"

        private readonly IDataRepository<BranchDetail> _branchContext;
        private readonly IDataRepository<BranchCPOConfiguration> _branchCPOConfigurationContext;
        private readonly IDataRepository<CompanyDetail> _companyDetailContext;
        private readonly IErrorLog _errorLog;
        private readonly IDataRepository<UserDetail> _userDataRepository;
        private readonly IDataRepository<ItemQuantity> _itemQuantityContext;

        #endregion

        #region "Constructor"
        public BranchRepository(IDataRepository<CompanyDetail> companyDetailContext, IDataRepository<BranchDetail> branchContext,
            IDataRepository<BranchCPOConfiguration> branchCPOConfigurationContext, IDataRepository<UserDetail> userDataRepository,
            IDataRepository<ItemQuantity> itemQuantityContext, IErrorLog errorLog)
        {
            _branchContext = branchContext;
            _companyDetailContext = companyDetailContext;
            _branchCPOConfigurationContext = branchCPOConfigurationContext;
            _errorLog = errorLog;
            _userDataRepository = userDataRepository;
            _itemQuantityContext = itemQuantityContext;

        }
        #endregion

        #region Public Method(s)

        /// <summary>
        /// This method is used to get branch list - JJ
        /// </summary>       
        /// <param name="userName">username of currently logged in user</param>
        /// <param name="companyId">currentCompanyId of currently logged in user company</param>
        /// <returns>return list of BranchDetail objects of user</returns>
        public List<BranchDetail> GetBranchList(string userName, int? companyId)
        {
            try
            {
                var branchList = new List<BranchDetail>();
                var currentUser = _userDataRepository.First(x => x.UserName == userName && x.IsDelete == false);
                if (companyId == null && currentUser.RoleName != "Admin")
                {
                    return _branchContext.Fetch(x => !x.IsDelete).ToList();
                }
                else
                {
                    if (currentUser.RoleName != "Admin")
                    {
                        return branchList = _branchContext.Fetch(x => !x.IsDelete && x.CompanyId == currentUser.CompanyId).ToList();
                    }
                    else
                    {
                        if (_companyDetailContext.Fetch(x => x.UserId == currentUser.UserId).ToList().Any())
                        {
                            var companyList = _companyDetailContext.Fetch(x => x.UserId == currentUser.UserId);
                            foreach (var company in companyList)
                            {
                                branchList = _branchContext.Fetch(x => !x.IsDelete && x.CompanyId == company.Id).ToList();
                            }
                            return branchList;
                        }
                        else
                        {
                            return null;
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        /// <summary>
        ///This method is used to get branch detail of the specific Id -JJ
        /// </summary>
        /// <param name="id">Id of branch</param>
        /// <returns>return BranchDetailAC object</returns>
        public BranchDetailAC GetBranchById(int id)
        {
            try
            {
                var branchDetail = _branchContext.GetById(id);
                BranchDetailAC branches = new BranchDetailAC()
                {
                    Id = id,
                    Name = branchDetail.Name,
                    NameSl = branchDetail.NameSl,
                    Code = branchDetail.Code,
                    Storename = branchDetail.Storename,
                    Email = branchDetail.Email,
                    Fax = branchDetail.Fax,
                    Address = branchDetail.Address,
                    IsAutomaticIssueSPO = branchDetail.IsAutomaticIssueSPO,
                    Phone = branchDetail.Phone,
                    CompanyId = branchDetail.CompanyId,
                    Zipcode = branchDetail.Zipcode
                };
                return branches;
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        /// <summary>
        ///This method is used to get branchCPOConfiguration detail of the branch Id -JJ
        /// </summary>
        /// <param name="id">Id of branch</param>
        /// <returns>return list of BranchCPOConfiguration object</returns>
        public List<BranchCPOConfiguration> GetBranchCPOConfiguarationById(int id)
        {
            var branchCPOConfigurationList = _branchCPOConfigurationContext.Fetch(x => x.BranchId == id).ToList();
            return branchCPOConfigurationList;
        }

        /// <summary>
        /// This method is used to add branch to the system - JJ
        /// </summary>
        /// <param name="branchDetail">object of BranchDetailAC</param>
        /// <param name="userName"></param>
        /// <returns>return BranchDetailAC object</returns>
        public BranchDetailAC AddBranchDetail(BranchDetailAC branchDetail, string userName)
        {
            try
            {
                var currentUser = _userDataRepository.First(x => x.UserName == userName && x.IsDelete == false);
                int companyId = 0;
                if (_companyDetailContext.Fetch(x => x.UserId == currentUser.UserId).ToList().Any())
                {
                    companyId = _companyDetailContext.First(x => x.UserId == currentUser.UserId).Id;
                }
                if (CheckBranchNameIdExist(branchDetail.Name, branchDetail.Id, companyId))
                {
                    branchDetail.Name = "invalid";
                    return branchDetail;
                }
                else if (CheckCodeIdExist(branchDetail.Code, branchDetail.Id, branchDetail.CompanyId))
                {
                    branchDetail.Code = "invalid";
                    return branchDetail;
                }
                else if (CheckEmailIdExist(branchDetail.Email, branchDetail.Id))
                {
                    branchDetail.Email = "invalid";
                    return branchDetail;
                }
                else if (CheckPhoneIdExist(branchDetail.Phone, branchDetail.Id))
                {
                    branchDetail.Phone = "invalid";
                    return branchDetail;
                }
                BranchDetail branch = new BranchDetail()
                {
                    Name = branchDetail.Name,
                    NameSl = branchDetail.NameSl,
                    Code = branchDetail.Code,
                    Storename = branchDetail.Storename,
                    Email = branchDetail.Email,
                    Fax = branchDetail.Fax,
                    Address = branchDetail.Address,
                    IsAutomaticIssueSPO = branchDetail.IsAutomaticIssueSPO,
                    Phone = branchDetail.Phone,
                    CompanyId = companyId,
                    Zipcode = branchDetail.Zipcode,
                    CreatedDateTime = DateTime.UtcNow
                };
                _branchContext.Add(branch);
                _branchContext.SaveChanges();
                branchDetail.CompanyId = companyId;
                branchDetail.Id = branch.Id;
                return branchDetail;
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        /// <summary>
        /// This method is used to update branch - JJ
        /// </summary>
        /// <param name="branchDetail">object of BranchDetailAC</param>
        /// <returns>null</returns>
        public void UpdateBranchDetail(BranchDetailAC branchDetail)
        {
            var updateBranch = _branchContext.GetById(branchDetail.Id);
            updateBranch.IsAutomaticIssueSPO = branchDetail.IsAutomaticIssueSPO;
            updateBranch.IsDelete = branchDetail.IsDelete;
            updateBranch.Name = branchDetail.Name;
            updateBranch.NameSl = branchDetail.NameSl;
            updateBranch.Phone = branchDetail.Phone;
            updateBranch.Storename = branchDetail.Storename;
            updateBranch.Zipcode = branchDetail.Zipcode;
            updateBranch.Address = branchDetail.Address;
            updateBranch.Code = branchDetail.Code;
            updateBranch.Email = branchDetail.Email;
            updateBranch.Fax = branchDetail.Fax;
            updateBranch.ModifiedDateTime = DateTime.UtcNow;
            _branchContext.Update(updateBranch);
            _branchContext.SaveChanges();
        }


        /// <summary>
        /// This method is used to delete branch from the system - JJ
        /// </summary>
        /// <param name="id">Id of branch</param>
        /// <returns>Status message</returns>
        public string DeleteBranchDetail(int id)
        {
            try
            {
                int users = _userDataRepository.Fetch(x => x.BranchId == id && !x.IsDelete).Count();
                if (users == 0)
                {
                    var deletedBranch = _branchContext.GetById(id);
                    deletedBranch.IsDelete = true;
                    deletedBranch.ModifiedDateTime = DateTime.UtcNow;
                    _branchContext.Update(deletedBranch);
                    _branchContext.SaveChanges();
                    return "";
                }
                else
                {
                    return "" + users + " User(s) Are Registered with This Branch. Please Delete User(s) First, Then Proceed to Delete Branch";
                }
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        /// <summary>
        /// get the current user branch id.
        /// </summary>
        /// <param name="userId"></param>
        /// <returns>branch id</returns>
        public int GetCurrentUserBranchId(string userId)
        {
            try
            {
                var user = _userDataRepository.FirstOrDefault(x => x.UserId == userId);
                return user.Branch.Id;
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        /// <summary>
        /// This method is used to check if branch with given code and branchId is already registered to the system - JJ 
        /// </summary>
        /// <param name="code"></param>
        /// <param name="id"></param>
        /// <param name="companyId"></param>
        /// <returns>if branch with given code and id exists return true,otherwise false</returns>
        public bool CheckCodeIdExist(string code, int id, int companyId)
        {
            try
            {
                return _branchContext.Fetch(x => x.Code == code && x.Id != id && x.CompanyId == companyId && !x.IsDelete).Any();
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        /// <summary>
        /// This method is used to check if branch with given name and branchId is already registered to the system - JJ 
        /// </summary>
        /// <param name="name"></param>
        /// <param name="id"></param>
        /// <param name="companyId"></param>
        /// <returns>if branch with given name and id exists return true,otherwise false</returns>
        public bool CheckBranchNameIdExist(string name, int id, int companyId)
        {
            try
            {
                return _branchContext.Fetch(x => x.Name == name && x.Id != id && x.CompanyId == companyId && !x.IsDelete).Any();
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        /// <summary>
        /// This method is used to check if branch with given email and branchId is already registered to the system - JJ 
        /// </summary>
        /// <param name="email"></param>
        /// <param name="id"></param>
        /// <returns>if branch with given email and id exists return true,otherwise false</returns>
        public bool CheckEmailIdExist(string email, int id)
        {
            try
            {
                return _branchContext.Fetch(x => x.Email == email && x.Id != id && !x.IsDelete).Any();
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        /// <summary>
        /// This method is used to check if branch with given phone and branchId is already registered to the system - JJ 
        /// </summary>
        /// <param name="phone"></param>
        /// <param name="id"></param>
        /// <returns>if branch with given phone and id exists return true,otherwise false</returns>
        public bool CheckPhoneIdExist(string phone, int id)
        {
            try
            {
                return _branchContext.Fetch(x => x.Phone == phone && x.Id != id && !x.IsDelete).Any();
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        public BranchDetail GetBranchDetailByUserId(string userId)
        {
            try
            {
                var branchDetail = _userDataRepository.FirstOrDefault(x => x.UserId == userId);
                return branchDetail.Branch;
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        /// <summary>
        /// this method is used to update item quantity
        /// </summary>
        /// <param name="brachId"></param>
        /// <param name="companyId"></param>
        public void UpdateItemQuantity(int brachId, int companyId)
        {
            try
            {
                var brachDetails = _branchContext.Fetch(x => x.CompanyId == companyId).ToList().FirstOrDefault();
                if (brachDetails != null)
                {
                    foreach (var itemDetails in _itemQuantityContext.Fetch(x => x.BranchId == brachDetails.Id).ToList())
                    {
                        var itemQuantityDetail = new ItemQuantity
                        {
                            CreatedDateTime = DateTime.UtcNow,
                            ItemId = itemDetails.ItemId,
                            BranchId = brachId,
                            ActualQuantity = 0,
                            MaxQuantity = itemDetails.MaxQuantity,
                            MinQuantity = itemDetails.MinQuantity
                        };
                        _itemQuantityContext.Add(itemQuantityDetail);
                        _itemQuantityContext.SaveChanges();
                    }
                }
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
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
                _branchContext.Dispose();
                _branchCPOConfigurationContext.Dispose();
                _companyDetailContext.Dispose();
                _itemQuantityContext.Dispose();
                _userDataRepository.Dispose();
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);

            }
        }

        #endregion

    }
}
