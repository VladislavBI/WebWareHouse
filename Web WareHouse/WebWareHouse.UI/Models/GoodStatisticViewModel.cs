using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using WebWareHouse.Model.Concrete;
using WebWareHouse.Model.Entities;

namespace WebWareHouse.UI.Models
{
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
                Price = cont.Goods.Where(x => x.GoodId == gId).Select(x => x.Price).FirstOrDefault();
                try
                {
                    TotalQuantity = cont.Operations.Where(x => x.GoodId == gId && x.OperType == OperationType.Income).Select(x => x.Quantity).Sum();
                    TotalQuantity += cont.Operations.Where(x => x.GoodId == gId && x.OperType == OperationType.Outcome).Select(x => x.Quantity).Sum();

                    TotalPrice = Price * TotalQuantity;
                }
                catch
                {
                    TotalQuantity = 0;
                    TotalPrice = 0;
                }

            }
        }
    }
}