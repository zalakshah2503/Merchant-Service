using System;
using System.Collections.Generic;
using MerchantService.DomainModel.Models.Supplier;
using MerchantService.Repository.ApplicationClasses.Supplier;
using MerchantService.DomainModel.Models.SystemParameters;

namespace MerchantService.Repository.Modules.Supplier
{
    public interface ISupplierProfileRepository : IDisposable
    {
        /// <summary>
        /// This method is used for insert new supplier profile in database. - JJ
        /// </summary>
        /// <param name="supplierProfile"> object of SupplierProfileAC</param>
        /// <param name="companyId"></param>
        /// <returns>object of SupplierProfileAC</returns>
        SupplierProfileAC SaveSupplierProfile(SupplierProfileAC supplier, int companyId);

        /// <summary>
        /// This method is used to know whether Supplier Accept Expired Item. - JJ
        /// </summary>
        /// <param name="SupplierId"> id of supplier</param>
        /// <returns>object of SupplierProfileAC</returns>
        SupplierProfileAC DoesSupplierAcceptExpiredItem(int SupplierId);

        /// <summary>
        /// This method is used for fetching supplier list from database. - JJ
        /// </summary>     
        /// <param name="companyId">Current logged-in user's company</param>
        /// <returns>list of objects of SupplierProfileAC</returns>
        List<SupplierProfile> GetSupplierList(int companyId);

        /// <summary>
        /// This method is used to delete supplier from the database by setting IsDeleted to true - JJ
        /// </summary>
        /// <param name="id">id of the supplier</param>      
        /// <returns>string</returns>
        string DeleteSupplierProfile(int id);

        /// <summary>
        /// This method is used to update supplier profile in database. - JJ
        /// </summary>
        /// <param name="supplier"> object of SupplierProfileAC</param>
        /// <param name="companyId"></param>
        /// <returns>object of SupplierProfile</returns>
        SupplierProfile UpdateSupplier(SupplierProfileAC supplier, int companyId);


        /// <summary>
        /// This method is used to check if supplier with given code and id is  already registered to the system - JJ 
        /// </summary>
        /// <param name="code"></param>
        /// <param name="Id"></param>
        /// <param name="companyId"></param>
        /// <returns>if user with given code and Id exists return true,otherwise false</returns>
        bool CheckSupplierCodeIdExist(string code, int userId, int companyId);

        /// <summary>
        /// This method is used to check if supplier with given phone and id is  already registered to the system - JJ 
        /// </summary>
        /// <param name="phone"></param>
        /// <param name="Id"></param>
        /// <returns>if user with given phone and Id exists return true,otherwise false</returns>
        bool CheckSupplierPhoneIdExist(string phone, int userId);

        /// <summary>
        /// This method is used to check if supplier with given email and id is  already registered to the system - JJ 
        /// </summary>
        /// <param name="email"></param>
        /// <param name="Id"></param>
        /// <returns>if user with given email and Id exists return true,otherwise false</returns>
        bool CheckSupplierEmailIdExist(string email, int userId);

        /// <summary>
        /// This method is used for getting list of contact persons of suppliers. - JJ
        /// </summary>
        /// <param "id">id of supplier</param>
        /// <returns>List of object of SupplierContactPerson</returns>
        List<SupplierContactPerson> GetContactPersonList(int id);

        /// <summary>
        /// This method is used for insert new contact person of supplier in database. - JJ
        /// </summary>
        /// <param name="contact">object of ContactPersonAC </param>
        /// <returns>object of SupplierContactPerson </returns>
        SupplierContactPerson SaveContactPerson(ContactPersonAC contact);

        /// <summary>
        /// This method is used to update contact person of supplier in database. - JJ
        /// </summary>
        /// <param name="contact">object of ContactPersonAC </param>
        /// <returns>object of SupplierContactPerson </returns>
        SupplierContactPerson UpdateContact(ContactPersonAC contact);

        /// <summary>
        /// This method is used to delete contact person from the system by setting ContactIsDeleted to true - JJ
        /// </summary>
        /// <param name="id">id of contact person</param>  
        /// <returns>null</returns>
        void DeleteContactPerson(int id);

        /// <summary>
        /// This method is used for getting list of supplier types. - JJ
        /// </summary>
        /// <returns>List of objects of ParamType</returns>
        List<ParamType> GetSupplierTypeList();

        /// <summary>
        ///This method is used to getsupplier days limit of the supplier Id -JJ
        /// </summary>
        /// <param name="Id">id of supplier</param>
        /// <returns>return list of objects of SupplierDaysLimit</returns>
        List<SupplierDaysLimit> GetSupplierDaysLimitById(int Id);

        /// <summary>
        ///This method is used to check whether spo of this supplier is in process-JJ
        /// </summary>
        /// <param name="Id">id of supplier</param>
        /// <returns>return no. of spo</returns>
        int  CheckSPOExist(int Id);

        /// <summary>
        /// This method used for get supplier by id. -An
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        SupplierProfile GetSupplierById(int id);
    }
}

