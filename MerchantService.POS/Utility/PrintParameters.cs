using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MerchantService.Repository.ApplicationClasses.Item;
using MerchantService.DomainModel.Models.POS;
using MerchantService.DomainModel.Models.Customer;
using System.Windows.Documents;
using System.IO;
using System.Xml;
using System.Windows.Markup;
using System.Windows.Controls;
using System.Windows;
using System.Drawing.Printing;
using System.IO.Packaging;
using System.Windows.Xps.Packaging;
using System.Windows.Xps.Serialization;
using System.Printing;

namespace MerchantService.POS.Utility
{
    public class PrintParameters
    {
        public bool IsCustomer { get; set; }
        public bool IsCpo { get; set; }
        public bool IsReturnBill { get; set; }
        public List<POSItemDetail> Items { get; set; }
        public string ReturnBillNo { get; set; }
        public decimal ReturnAmount { get; set; }
        public decimal Substitute { get; set; }
        public string CpoNumber { get; set; }
        public string DownPayment { get; set; }
        public string AdditionalCost { get; set; }
        public CustomerProfile Customer { get; set; }
        public string SDateTime { get; set; }
        public string InvoiceNo { get; set; }
        public int TotalQuantity { get; set; }
        public decimal TotalAmount { get; set; }
        public decimal Tax { get; set; }
        public decimal Discount { get; set; }
        public decimal Cash { get; set; }
        public decimal CashReturn { get; set; }

        public void PrintBill()
        {
            var path = "Receipts/PosBillReceipt.xaml";
            var flowDocument = RenderFlowDocumentTemplate
                (System.IO.Path.Combine(Environment.CurrentDirectory, path));
            //SettingHelpers.SetLabelsLangugaeWise((Window)flowDocument);
            //IDocumentPaginatorSource dps = flowDocument.Document;
            var strm = FlowDocumentToXPS(flowDocument.Document, flowDocument.Width, flowDocument.Height);
            if (!Directory.Exists(@"c:\receipts"))
                Directory.CreateDirectory(@"c:\receipts");
            using (var fs = new FileStream(string.Format(@"c:\receipts\{0}.xps", InvoiceNo), FileMode.OpenOrCreate))
            {
                strm.WriteTo(fs);
            }
         
        }

        public static MemoryStream FlowDocumentToXPS(FlowDocument flowDocument, double width, double height)
        {
            MemoryStream stream = new MemoryStream();
            using (Package package = Package.Open(stream, FileMode.Create, FileAccess.ReadWrite))
            {
                using (XpsDocument xpsDoc = new XpsDocument(package, CompressionOption.Maximum))
                {
                    XpsSerializationManager rsm = new XpsSerializationManager(new XpsPackagingPolicy(xpsDoc), false);
                    DocumentPaginator paginator = ((IDocumentPaginatorSource)flowDocument).DocumentPaginator;
                    paginator.PageSize = new System.Windows.Size(width, height);
                    rsm.SaveAsXaml(paginator);
                    rsm.Commit();                   
                }
            }
            stream.Position = 0;
            Console.WriteLine(stream.Length);
            Console.WriteLine(stream.Position);
            return stream;
        }

        public FlowDocumentScrollViewer RenderFlowDocumentTemplate(string templatePath)
        {
            try
            {
                string rawXamlText = "";
                //Create a StreamReader that will read from the document template.
                using (StreamReader streamReader = new StreamReader(templatePath))
                {
                    rawXamlText = streamReader.ReadToEnd();
                }
                //Use the XAML reader to create a FlowDocument from the XAML string.
                var document = XamlReader.Load(new XmlTextReader(new StringReader(rawXamlText))) as FlowDocumentScrollViewer;
                //SettingHelpers.SetLabelsLangugaeWiseForFlowDocument(document.Document);
                var fd = document.Document.FindName("FD") as FlowDocument;
                var grd = document.Document.FindName("grd") as Grid;
                var lstBox = document.Document.FindName("lstItems") as ListBox;
                //Set company information
                (document.Document.FindName("CompanyName") as TextBlock).Text
                    = SettingHelpers.CompanyConfigruationObject.CompanyDetail.Name;
                (document.Document.FindName("Address") as TextBlock).Text
                  = SettingHelpers.CompanyConfigruationObject.CompanyDetail.Location;

                (document.Document.FindName("Date") as TextBlock).Text
                  = SDateTime;
                (document.Document.FindName("InvoiceNo") as TextBlock).Text
                  = InvoiceNo;
                if (IsCustomer)
                {
                    (document.Document.FindName("MembershipNo") as TextBlock).Text
                      = Customer.MembershipCode.ToString();
                    (document.Document.FindName("lblMembershipNo") as TextBlock).Text =
                      "Cust No:";
                }
                else
                {
                    if (!IsReturnBill)
                    {
                        (document.Document.FindName("MembershipNo") as TextBlock).Visibility =
                            Visibility.Collapsed;
                        (document.Document.FindName("lblMembershipNo") as TextBlock).Visibility =
                            Visibility.Collapsed;
                    }
                }
                if (IsReturnBill)
                {
                    (document.Document.FindName("MembershipNo") as TextBlock).Text
                      = ReturnBillNo;
                    (document.Document.FindName("lblMembershipNo") as TextBlock).Text =
                       "ReturnBill No:";
                    (document.Document.FindName("lblSub") as TextBlock).Visibility =
                          Visibility.Visible;
                    (document.Document.FindName("Sub") as TextBlock).Visibility =
                   Visibility.Visible;
                    (document.Document.FindName("Sub") as TextBlock).Text =
                       Substitute.ToString();
                    if (Substitute == 0)
                        lstBox.Visibility = Visibility.Collapsed;
                }
                if (IsCpo)
                {
                    (document.Document.FindName("CPONo") as TextBlock).Visibility =
                            Visibility.Visible;
                    (document.Document.FindName("CPONo") as TextBlock).Text =
                           CpoNumber;
                    (document.Document.FindName("lblCPONo") as TextBlock).Visibility =
                        Visibility.Visible;
                    (document.Document.FindName("lbldp") as TextBlock).Visibility =
                     Visibility.Visible;
                    (document.Document.FindName("lbladc") as TextBlock).Visibility =
                   Visibility.Visible;
                    (document.Document.FindName("DownPayment") as TextBlock).Text =
                            DownPayment;
                    (document.Document.FindName("AddCost") as TextBlock).Text =
                        AdditionalCost;
                    (document.Document.FindName("DownPayment") as TextBlock).Visibility =
                          Visibility.Visible; 
                    (document.Document.FindName("AddCost") as TextBlock).Visibility =
                        Visibility.Visible;
                }
                (document.Document.FindName("TotalQ") as TextBlock).Text
                  = TotalQuantity.ToString();
                (document.Document.FindName("TotalAmount") as TextBlock).Text
                  = TotalAmount.ToString();
                (document.Document.FindName("Total") as TextBlock).Text
               = TotalAmount.ToString();
                (document.Document.FindName("Discount") as TextBlock).Text
                  = Discount.ToString();
                (document.Document.FindName("Tax") as TextBlock).Text
               = Tax.ToString();
                (document.Document.FindName("Cash") as TextBlock).Text
                  = Cash.ToString();
                (document.Document.FindName("CashReturn") as TextBlock).Text
                = CashReturn.ToString();

          //      var img = document.Document.FindName("Barcode") as System.Windows.Controls.Image;
                lstBox.ItemsSource = Items;
                var printDialog = new PrintDialog();
             //   printDialog.PrintVisual(grd, "fd");
                return document;
            }
            catch (Exception )
            {
                throw;
            }
        }
    }
}
