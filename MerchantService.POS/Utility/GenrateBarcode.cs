using System;
using System.Collections.Generic;
using System.Drawing;
using System.Drawing.Imaging;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Media.Imaging;

namespace MerchantService.POS.Utility
{
   public class GenrateBarcode
    {
       public BitmapImage ConvertBarcode(string barCode)
       {
           
            //System.Web.UI.WebControls.Image imgBarCode = new System.Web.UI.WebControls.Image();
            Bitmap bitMap = new Bitmap(barCode.Length * 40, 80);

            using (Graphics graphics = Graphics.FromImage(bitMap))
            {
                var oFont = new Font("IDAutomationHC39M", 16);
                var point = new PointF(2f, 2f);
                var blackBrush = new SolidBrush(System.Drawing.Color.Black);
                var whiteBrush = new SolidBrush(System.Drawing.Color.White);
                graphics.FillRectangle(whiteBrush, 0, 0, bitMap.Width, bitMap.Height);
                graphics.DrawString("*" + barCode + "*", oFont, blackBrush, point);
            }
           using (MemoryStream ms = new MemoryStream())
           {
               
               bitMap.Save(ms, ImageFormat.Png);
               ms.Position = 0;
               BitmapImage bitmapImage = new BitmapImage();
               bitmapImage.BeginInit();
               bitmapImage.StreamSource = ms;
               bitmapImage.CacheOption = BitmapCacheOption.OnLoad;
               bitmapImage.EndInit();
               return bitmapImage;
           }
       }
    }
}
