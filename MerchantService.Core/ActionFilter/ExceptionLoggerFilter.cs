using Autofac.Extras.NLog;
using System.Web.Mvc;

namespace MerchantService.Core.ActionFilter
{
    public class ExceptionLoggerFilter : IExceptionFilter
    {
        #region Private Variable
        private readonly ILogger _logger;
        #endregion

        #region Constructor
        public ExceptionLoggerFilter(ILogger logger)
        {
            _logger = logger;
        }
        #endregion

        #region Public Method
        /// <summary>
        /// Method will called when error occured. And will print the error and stacktrace in log file
        /// </summary>
        /// <param name="filterContext">exception</param>
        public void OnException(ExceptionContext filterContext)
        {
            _logger.Error(filterContext.Exception.Message);
            _logger.Trace(filterContext.Exception.StackTrace);
        }
        #endregion
    }
}
