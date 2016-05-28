using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Webwarehouse.Model.Concrete;
using Webwarehouse.Model.Entities;

namespace Webwarehouse.UI.Models
{/// <summary>
 /// View model for detail good info
 /// </summary>
    public class GoodStatisticViewModel
    {
        WarehouseContext cont;
        public int GoodId { get; set; }
        public string GoodName { get; set; }
        public decimal Price { get; set; }
        public int TotalQuantity { get; set; }
        public decimal TotalPrice { get; set; }

        public GoodStatisticViewModel()
        { }
        public GoodStatisticViewModel(int gId)
        {
            using (cont = new WarehouseContext())
            {
                GoodId = gId;
                if (gId == -1)
                {
                    GoodName = "Товар не выбран";
                }
                else
                {
                    GoodName = cont.Goods.Where(x => x.GoodId == gId).Select(x => x.GoodName).FirstOrDefault();
                }
                try
                {
                    Price = cont.Goods.Where(x => x.GoodId == gId).Select(x => x.Price).FirstOrDefault();
                    if (cont.Operations.Where(x => x.GoodId == gId && x.OperType == OperationType.Income).Any())
                    TotalQuantity = (int)cont.Operations.Where(x => x.GoodId == gId && x.OperType == OperationType.Income).Select(x => x.Quantity).Sum();
                    if (cont.Operations.Where(x => x.GoodId == gId && x.OperType == OperationType.Outcome).Any())
                    TotalQuantity -= (int)cont.Operations.Where(x => x.GoodId == gId && x.OperType == OperationType.Outcome).Select(x => x.Quantity).Sum();

                    TotalPrice = Price * TotalQuantity;
                }
                catch
                {
                    Price = 0;
                    TotalQuantity = 0;
                    TotalPrice = 0;
                }

            }
        }
    }
}