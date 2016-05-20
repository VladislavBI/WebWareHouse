using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using WebMatrix.WebData;
using WebWarehouse.UI.Infrastructure.Abstract;
using WebWarehouse.UI.Models;

namespace WebWarehouse.UI.Infrastructure.Concrete
{
    public class EFGoodsManager : IGoodsManager
    {
        WarehouseContext context;

        public List<Good> GoodsList
        {
            get
            {
                using (context=new WarehouseContext())
                {
                    int Id=Convert.ToInt32(HttpContext.Current.Session["UserId"]);
                    var temp = context.Goods.Where(x => x.UserId == Id).ToList();

                    return temp;
                }
                
            }
            set
            {
                throw new NotImplementedException();
            }
        }


        public void AddProduct(Models.Good g)
        {
            g.UserId = Convert.ToInt32(HttpContext.Current.Session["UserId"]);
            using (context = new WarehouseContext())
            {
                context.Goods.Add(g);
                context.SaveChanges();
            }
           
        }


        public bool AlreadyHaveGood(string name)
        {
            using (context=new WarehouseContext())
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