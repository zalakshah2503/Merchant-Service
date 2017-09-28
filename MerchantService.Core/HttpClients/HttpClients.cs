using MerchantService.Utility.Constants;
using System;
using System.Net.Http;
using System.Net.Http.Headers;
namespace MerchantService.Core.HttpClients
{
    public class HttpClients : IDisposable
    {
        private bool disposed = false;
        private  readonly  HttpClient _httpClient;

        public HttpClients()
        {
            _httpClient = new HttpClient();
            _httpClient.BaseAddress = new Uri(StringConstants.WebApiPath);
            _httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

        }

        public HttpResponseMessage PutAsync(string addressSuffix, HttpContent content)
        {
            return _httpClient.PutAsync(addressSuffix, content).Result;
        }

        public HttpResponseMessage GetAsync(string addresSuffix)
        {
            return _httpClient.GetAsync(addresSuffix).Result;
        }

        public HttpResponseMessage PostAsync(string addresssuffix, HttpContent content)
        {
            return _httpClient.PostAsync(addresssuffix, content).Result;
        }

        #region IDisposable Members

        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }

        private void Dispose(bool disposing)
        {
            if (!disposed && disposing)
            {
                if (_httpClient != null)
                {
                    
                    _httpClient.Dispose();
                }
                disposed = true;
            }
        }

        #endregion IDisposable

    }
}
