using Autofac.Extras.NLog;
using System.Threading;
using System.Threading.Tasks;
using System.Web.Http.Filters;

namespace MerchantService.Core.ActionFilter
{
    public class ApiExceptionLoggerFilter : IExceptionFilter
    {
        #region Private Variable
        private readonly ILogger _logger;
        #endregion

        #region Constructor
        public ApiExceptionLoggerFilter(ILogger logger)
        {
            _logger = logger;
        }
        #endregion

        #region Public Methods
        public bool AllowMultiple
        {
            get
            {
                return true;
            }
        }

        /// <summary>
        /// Executes an asynchronous exception filter
        /// </summary>
        /// <param name="actionExecutedContext">The action executed context</param>
        /// <param name="cancellationToken">The cancellation token</param>
        /// <returns>An asynchronous exception filter</returns>
        public async Task ExecuteExceptionFilterAsync(HttpActionExecutedContext actionExecutedContext, CancellationToken cancellationToken)
        {
            await Task.Factory.StartNew(() =>
            {
                _logger.Error(actionExecutedContext.Exception.Message);
                _logger.Trace(actionExecutedContext.Exception.StackTrace);
            }, cancellationToken);
        }
        #endregion
    }
}
