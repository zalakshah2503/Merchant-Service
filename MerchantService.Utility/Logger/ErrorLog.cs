using Autofac.Extras.NLog;
using System;
using System.Web;

namespace MerchantService.Utility.Logger
{
    public class ErrorLog : IErrorLog
    {
        #region Private Members

        private readonly ILogger _logger;


        #endregion

        #region Constructor
        /// <summary>
        /// Public Constructor
        /// </summary>
        public ErrorLog(ILogger logger)
        {
            _logger = logger;
        }
        #endregion

        #region Public Methods
        /// <summary>
        /// Logs exception using NLog
        /// </summary>
        /// <param name="exception"></param>
        public void LogException(Exception exception)
        {
            if (_logger.IsErrorEnabled)
            {
                _logger.Error(BuildExceptionMessage(exception));
            }
        }

        /// <summary>
        /// Logs information using NLog
        /// </summary>
        /// <param name="message"></param>
        public void LogInfo(string message)
        {
            if (_logger.IsInfoEnabled)
                _logger.Info<string>(message);

        }
        #endregion

        #region Private Methods

        /// <summary>
        /// Builds detailed exception message to log
        /// </summary>
        /// <param name="ex"></param>
        /// <returns></returns>
        private string BuildExceptionMessage(Exception ex)
        {
            Exception logException = ex;
            if (ex.InnerException != null)
                logException = ex.InnerException;

            // Gets the current request object
            var currentRequestObject = HttpContext.Current.Request;
            // Gets the string for newline
            var newLine = Environment.NewLine;

            // Forms the virtual path 
            string errorMsg = string.Format("{0}{1} : {2}", newLine, "ErrorPath",
                currentRequestObject.Path);

            // Appends the QueryString along with the Virtual Path
            errorMsg += string.Format("{0}{1} : {2}", newLine, "RawUrl",
                currentRequestObject.RawUrl);

            // Appends the error message
            errorMsg += string.Format("{0}{1} : {2}", newLine, "Message",
                logException.Message);

            // Appends the source of the message
            errorMsg += string.Format("{0}{1} : {2}", newLine, "Source",
                logException.Source);

            // Appends Stack Trace of the error
            errorMsg += string.Format("{0}{1} : {2}", newLine, "StackTrace",
                logException.StackTrace);

            // Appends the method where the error occurred
            errorMsg += string.Format("{0}{1} : {2}", newLine, "TargetSite",
                logException.TargetSite);

            return errorMsg;
        }

        #endregion
    }
}
