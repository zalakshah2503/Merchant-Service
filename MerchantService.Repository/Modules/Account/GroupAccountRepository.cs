using MerchantService.DomainModel.Models.Accounting;
using MerchantService.Repository.ApplicationClasses.Account;
using MerchantService.Repository.DataRepository;
using MerchantService.Utility.Logger;
using System;
using System.Collections.Generic;
using System.Linq;
namespace MerchantService.Repository.Modules.Account
{
    public class GroupAccountRepository : IGroupAccountRepository
    {

        #region Private Variable
        private readonly IDataRepository<Group> _groupContext;
        private readonly IDataRepository<GroupType> _groupTypeContext;
        private readonly IErrorLog _errorLog;
        #endregion

        #region Constructor
        public GroupAccountRepository(IDataRepository<Group> groupContext, IErrorLog errorLog, IDataRepository<GroupType> groupTypeContext)
        {
            _groupContext = groupContext;
            _groupTypeContext = groupTypeContext;
            _errorLog = errorLog;
        }
        #endregion

        #region Public Method
        public Group SaveGroup(GroupAccountAC group)
        {
            try
            {
                //check the same gorup name is exists or not
                int groupCount = _groupContext.Fetch(x => x.GroupName == @group.GroupName && x.CompanyId == 0).Count() == 1 ? 1 : _groupContext.Fetch(x => x.GroupName == @group.GroupName && x.CompanyId == group.CompanyId).Count();
                if (groupCount != 0)
                {
                    throw new ArgumentException("The entered group name already exists");
                }
                var groups = new Group
                {
                    GroupName = group.GroupName,
                    UnderId = group.UnderId,
                    CreatedDateTime = DateTime.UtcNow,
                    CompanyId = group.CompanyId
                };
                _groupContext.Add(groups);
                _groupContext.SaveChanges();
                return groups;
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        public List<Group> GetGroupListByCompanyId(int CompanyId)
        {
            try
            {
                var lstGroup = _groupContext.GetAll().Where(x => x.CompanyId == CompanyId || x.CompanyId == 0).OrderBy(x => x.GroupName).ToList();
                return lstGroup;
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        public Group UpdateGroup(GroupAccountAC groupAccount)
        {
            try
            {
                //check that same gorup name exists or not
                int groupCount = _groupContext.Fetch(x => x.Id != groupAccount.GroupId && x.GroupName == groupAccount.GroupName && x.CompanyId == 0).Count() == 1 ? 1 : _groupContext.Fetch(x => x.Id != groupAccount.GroupId && x.GroupName == groupAccount.GroupName && x.CompanyId == groupAccount.CompanyId).Count();
                if (groupCount != 0)
                {
                    throw new ArgumentException("The entered group name already exists");
                }
                var groupdetail = _groupContext.GetById(groupAccount.GroupId);
                groupdetail.GroupName = groupAccount.GroupName;
                groupdetail.UnderId = groupAccount.UnderId;
                groupdetail.ModifiedDateTime = DateTime.UtcNow;
                _groupContext.Update(groupdetail);
                _groupContext.SaveChanges();
                return groupdetail;
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        public Group GetGroupByGroupId(int groupId)
        {
            try
            {
                var group = _groupContext.GetAll().FirstOrDefault(x => x.Id == groupId);
                return group;
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        /// <summary>
        /// This method used for get group type list by group id.
        /// </summary>
        /// <param name="groupId"></param>
        /// <returns></returns>
        public List<GroupType> GetGroupTypeListByGroupId(int groupId)
        {
            try
            {
                return _groupTypeContext.Fetch(x => x.GroupId == groupId).ToList();
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        #endregion

        #region Dispose Method
        public void Dispose()
        {
            try
            {
                _groupContext.Dispose();
                GC.SuppressFinalize(this);
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
            }
        }
        #endregion
    }
}
