using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using WebWarehouse.UI.Infrastructure.Concrete;

namespace WebWarehouse.UI.Models
{
    public class GoodsInfoViewModel
    {
        WarehouseContext context;

        public Good curGood
        {
            get
            {
                using (context=new WarehouseContext())
                {
                    return context.Goods.Where(x => x.GoodId == 1).FirstOrDefault();
                }
            }
            set { curGood = value; }
        }
        public string GoodName { get { return curGood.GoodName; } set { GoodName = value; } }
        public decimal GoodPrice { get { return curGood.Price; } set { GoodPrice = value; } }
        public int TotalQuantity
        {
            get
            {
                using (context = new WarehouseContext())
                {
                    var list = curGood.Operations.Where(x => x.OperType == OperationType.Income).Select(x => x.Quantity).Sum();
                    list -= curGood.Operations.Where(x => x.OperType == OperationType.Outcome).Select(x => x.Quantity).Sum();
                    return list;
                }
            }
            set { TotalQuantity=value; }
        }

        public decimal TotalPrice
        {
            get
            {
                return TotalQuantity * GoodPrice;
            }
            set { TotalPrice = value; }
        }
    }
}