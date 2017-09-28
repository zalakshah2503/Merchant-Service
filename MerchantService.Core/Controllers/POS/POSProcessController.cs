using MerchantService.DomainModel.Models.POS;
using MerchantService.Repository.Modules.POS;
using MerchantService.Utility.Logger;
using System;
using System.Collections.Generic;
using System.Web.Http;

namespace MerchantService.Core.Controllers.POS
{
    [RoutePrefix("api/posprocess")]
    public class POSProcessController : ApiController
    {
        private readonly IErrorLog _errorLog;
        private readonly IPOSProcessRepository _iPOSProcessRepository;

        public POSProcessController(IErrorLog errorLog, IPOSProcessRepository iPOSProcessRepository)
        {
            _errorLog = errorLog;
            _iPOSProcessRepository = iPOSProcessRepository;
        }

        [HttpGet]
        [Route("getunsuspendbilllist")]
        public IHttpActionResult GetUnSuspendBillList(int userId)
        {
            try
            {
                List<POSTempTrans> listOfPOSTempTrans = _iPOSProcessRepository.GetUnSuspendBillList(userId);
                return Ok(listOfPOSTempTrans);
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        [HttpGet]
        [Route("getglobalizationdetails")]
        public IHttpActionResult GetGlobalizationDetails(int languageId)
        {
            try
            {
                var gData = _iPOSProcessRepository.GetLanguageWiseLabels(languageId);
                return Ok(gData);
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        [HttpGet]
        [Route("getalllanguage")]
        public IHttpActionResult GetAllLanguage()
        {
            try
            {
                var gData = _iPOSProcessRepository.GetAllLanguage();
                return Ok(gData);
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        [HttpPost]
        [Route("insertpostemptransdata")]
        public IHttpActionResult InsertPOSTempTransData(POSTempTrans posTempTrans)
        {
            try
            {
                int id = _iPOSProcessRepository.InsertPOSTempTransData(posTempTrans);
                posTempTrans.Id = id;
                return Ok(posTempTrans);
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        [HttpPost]
        [Route("insertpostemptransitemsdata")]
        public IHttpActionResult InsertPOSTempTransItemsData(POSTempTransItem posTempTransItem)
        {
            try
            {
                int id = _iPOSProcessRepository.InsertPOSTempTransItemsData(posTempTransItem);
                return Ok(id);
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        [HttpPost]
        [Route("insertposbillitemsdata")]
        public IHttpActionResult InsertPOSBillItemsData(POSBillItem posBillItem)
        {
            try
            {
                int id = _iPOSProcessRepository.InsertPOSBillItemsData(posBillItem);
                return Ok(id);
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        [HttpPost]
        [Route("insertposbillpaymentsdata")]
        public IHttpActionResult InsertPOSBillPaymentsData(POSBillPayment posBillPayment)
        {
            try
            {
                int id = _iPOSProcessRepository.InsertPOSBillPaymentsData(posBillPayment);
                return Ok(id);
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        [HttpPost]
        [Route("getposreturnbillbyreturnbillno")]
        public IHttpActionResult GetPOSReturnBillByReturnBillNo(string returnbillNo)
        {
            try
            {
                POSReturnBill posReturnBill = _iPOSProcessRepository.GetPOSReturnBillByReturnBillNo(returnbillNo);
                return Ok(posReturnBill);
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        [HttpGet]
        [Route("deletepostemptranscation")]
        public IHttpActionResult DeletePosTempTranscation(int tempTransId)
        {
            try
            {
                _iPOSProcessRepository.DeletePosTempTranscation(tempTransId);
                return Ok();
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        [HttpPost]
        [Route("deletepostemptransitem")]
        public IHttpActionResult DeletePOSTempIransItem(POSTempTransItem posTempTransItem)
        {
            try
            {
                _iPOSProcessRepository.DeletePOSTempIransItem(posTempTransItem);
                return Ok();
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        [HttpPost]
        [Route("deletepostemptransitembybarcode")]
        public IHttpActionResult DeletePOSTempIransItemByBarcode(POSTempTransItem posTempTransItem)
        {
            try
            {
                _iPOSProcessRepository.DeletePOSTempIransItemByBarcode(posTempTransItem);
                return Ok();
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        [HttpGet]
        [Route("deleteallpostemptransitem")]
        public IHttpActionResult DeleteAllPOSTempTransItem(int tempTransId)
        {
            try
            {
                _iPOSProcessRepository.DeleteAllPOSTempTransItem(tempTransId);
                return Ok();
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        [HttpPost]
        [Route("updatepostemptransitem")]
        public IHttpActionResult UpdatePosTempTransItem(POSTempTransItem posTempItem)
        {
            try
            {
                var posTempObj = _iPOSProcessRepository.UpdatePosTempTransItem(posTempItem);
                return Ok(posTempObj);
            }
            catch (Exception)
            {

                throw;
            }
        }

        /// <summary>
        ///  This method is used for getting POSTempTransItem object by tempTransId
        /// </summary>
        /// <param name="userId">user id</param>
        /// <returns></returns>
        [HttpGet]
        [Route("getpostemptransbyuserid")]
        public IHttpActionResult GetPOSTempTransByUserId(int userId)
        {
            try
            {
                var posTempTrans = _iPOSProcessRepository.GetPOSTempTransByUserId(userId);
                return Ok(posTempTrans);
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        [HttpGet]
        [Route("getpostemptransitembytemptransid")]
        public IHttpActionResult GetPosTempTransItemByTempTransId(int tempTransId)
        {
            try
            {
                List<POSTempTransItem> tempTransItem = _iPOSProcessRepository.GetPosTempTransItemByTempTransId(tempTransId);
                return Ok(tempTransItem);
            }
            catch (Exception)
            {

                throw;
            }
        }

        /// <summary>
        /// This method is used for insert posbill data in databse.
        /// </summary>
        /// <param name="posBill"></param>
        /// <returns></returns>
        [HttpPost]
        [Route("insertposbilldata")]
        public IHttpActionResult InsertPOSBillData(POSBill posBill)
        {
            try
            {
                var posBillData = _iPOSProcessRepository.InsertPOSBillData(posBill);
                return Ok(posBillData);
            }
            catch (Exception)
            {

                throw;
            }
        }

        [HttpGet]
        [Route("gettotalbilldatabybilldate")]
        public IHttpActionResult GetTotalBillDataByBillDate()
        {
            try
            {
                int count = _iPOSProcessRepository.GetTotalBillDataByBillDate();
                return Ok(count);
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        [HttpPost]
        [Route("updatepostemptransforsuspendbill")]
        public IHttpActionResult UpdatePosTempTransForSuspendBill(POSTempTrans posTempTrans)
        {
            try
            {
                _iPOSProcessRepository.UpdatePosTempTransForSuspendBill(posTempTrans);
                return Ok();
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        [HttpGet]
        [Route("getpostemptransbytransid")]
        public IHttpActionResult GetPosTempTransByTransId(int transId)
        {
            try
            {
                var posTransObj = _iPOSProcessRepository.GetPosTempTransByTransId(transId);
                return Ok(posTransObj);
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        [HttpGet]
        [Route("getsuspendbillcountbyuserid")]
        public IHttpActionResult GetSuspendBillCountByUserId(int UserId)
        {
            try
            {
                int count = _iPOSProcessRepository.GetSuspendBillCountByUserId(UserId);
                return Ok(count);
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

    }
}
