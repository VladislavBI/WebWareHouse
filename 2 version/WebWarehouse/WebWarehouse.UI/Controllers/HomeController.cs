using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using WebWarehouse.UI.Infrastructure.Abstract;
using WebWarehouse.UI.Infrastructure.Concrete;
using WebWarehouse.UI.Models;

namespace WebWarehouse.UI.Controllers
{
        [Authorize]
    
    public class HomeController : Controller
    {
            IGoodsManager goodsMan;


            public HomeController(IGoodsManager goodsMan)
            {
                this.goodsMan = goodsMan;
            }
        
        public ActionResult Index()
        {
            ViewBag.Message = "Modify this template to jump-start your ASP.NET MVC application.";
            return View();
        }


        public ActionResult About()
        {
            ViewBag.Message = "Your app description page.";

            return View();
        }

        public ActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }

        public ActionResult AddGood()
        {
            return PartialView();
        }
        [HttpPost]
        public ActionResult AddGood(Good g)
        {
            if (!goodsMan.AlreadyHaveGood(g.GoodName))
            {
                goodsMan.AddProduct(g);    
            }
            else
            {
                ModelState.AddModelError("", "You already have this good");
            }
            return PartialView();
        }

        

       /* public ActionResult GoodsStatistic()
        {
            GoodsInfoViewModel model = new GoodsInfoViewModel();
            return PartialView(model);
        }*/


    }
}
