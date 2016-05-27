using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using Webwarehouse.Model.Abstract;
using Webwarehouse.Model.Entities;

namespace Webwarehouse.Model.Concrete
{
    public class EFGoodsManager : IGoodsManager
    {
        WarehouseContext context;
        public List<Good> GoodsList
        {
            get
            {
                using (context = new WarehouseContext())
                {
                    return context.Goods.ToList();
                }

            }
            set
            { }
        }

        public void AddProduct(Good g)
        {
            using (context = new WarehouseContext())
            {
                context.Goods.Add(g);
                context.SaveChanges();
            }

        }
        public bool AlreadyHaveGood(string name)
        {
            using (context = new WarehouseContext())
            {
                if (context.Goods.Where(x => x.GoodName.ToLower() == name.ToLower()).Any())
                {
                    return true;
                }
                else
                {
                    return false;
                }
            }
        }
    }
}
