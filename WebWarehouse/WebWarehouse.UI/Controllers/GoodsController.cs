using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using WebWarehouse.UI.Infrastructure.Concrete;

namespace WebWarehouse.UI.Controllers
{
    public class GoodsController : Controller
    {
        //
        // GET: /Goods/

        public ActionResult Index()
        {
            return View();
        }

        public PartialViewResult GoodListShow()
        {
            return PartialView();
        }
        WarehouseContext context = new WarehouseContext();
        public JsonResult GoodsList(string sidx, string sord, int page, int rows)  //Gets the todo Lists.
        {
            int pageIndex = Convert.ToInt32(page) - 1;
            int pageSize = rows;
            var GoodsResults = context.Goods.Select(
                    a => new
                    {
                        a.GoodId,
                        a.GoodName,
                        a.Price,
                    });
            int totalRecords = GoodsResults.Count();
            var totalPages = (int)Math.Ceiling((float)totalRecords / (float)rows);
            if (sord.ToUpper() == "DESC")
            {
                GoodsResults = GoodsResults.OrderByDescending(s => s.GoodName);
                GoodsResults = GoodsResults.Skip(pageIndex * pageSize).Take(pageSize);
            }
            else
            {
                GoodsResults = GoodsResults.OrderBy(s => s.GoodName);
                GoodsResults = GoodsResults.Skip(pageIndex * pageSize).Take(pageSize);
            }
            var jsonData = new
            {
                total = totalPages,
                page,
                records = totalRecords,
                rows = GoodsResults
            };
            return Json(jsonData, JsonRequestBehavior.AllowGet);
        }

    }
}
