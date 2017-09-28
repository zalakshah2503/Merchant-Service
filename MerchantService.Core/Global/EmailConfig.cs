using System;
using System.Net.Mail;

namespace MerchantService.Core.Global
{
    public class EmailConfig
    {
       /// <summary>
       /// Email Configuration
       /// </summary>
       /// <param name="to"></param>
       /// <param name="subject"></param>
       /// <param name="body"></param>
       /// <param name="fromUserName"></param>
       /// <returns></returns>
       public static bool SendEmail(string to, string subject, string body, string fromUserName = null)
       {
           try
           {

               using (var smtp = new SmtpClient())
               {
                   if (fromUserName == null)
                   {
                       using (var _mailMessage = new MailMessage(((System.Net.NetworkCredential)(smtp.Credentials)).UserName, to, subject, body))
                       {
                           _mailMessage.IsBodyHtml = true;
                        
                           smtp.Send(_mailMessage);
                           return true;
                       }
                   }
                   else
                   {
                       var from = new MailAddress(((System.Net.NetworkCredential)(smtp.Credentials)).UserName, fromUserName);
                       var receiver = new MailAddress(to, to);
                      
                       var mailMessage = new MailMessage(from, receiver);
                       mailMessage.IsBodyHtml = true;
                       mailMessage.Subject = subject;
                       mailMessage.Body = body;
                     
                       smtp.Send(mailMessage);
                       return true;
                   }
               }
           }
           catch (Exception)
           {
               return false;
           }
       }
    }
}
