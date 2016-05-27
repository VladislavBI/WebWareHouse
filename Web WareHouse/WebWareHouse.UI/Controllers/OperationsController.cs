using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Webwarehouse.Model.Concrete;
using Webwarehouse.Model.Entities;

namespace Webwarehouse.UI.Controllers
{
    public class OperationsController : Controller
    {
        WarehouseContext cont = new WarehouseContext();

        public ActionResult Add(object idVal)
        {
            int id;
            try
            {
                string[] a = (string[])idVal;
                id = Convert.ToInt32(a[0]);
            }
            catch (Exception)
            {
                    return PartialView(new Operation());
            }
           
            
            Good g;
            using (cont = new WarehouseContext())
            {
                g = cont.Goods.FirstOrDefault(x => x.GoodId == id);
            }
            TempData["goodId"] = g.GoodId;
            Operation op = new Operation() { GoodAttached = g };
            return PartialView(op);
        }
        [HttpPost]
        public ActionResult Add(Operation op)
        {
            op.OperationTime = DateTime.Now;
            op.GoodId = (int)TempData["goodId"];
             if (op.OperType==OperationType.Outcome&&!GoodEnought(op.GoodId, op.Quantity))
                {
                    TempData["opMessage"]= "У вас не хватает товара";
                }
             else
	        {
                using (cont = new WarehouseContext())
                {
                    int uId = Convert.ToInt32(Session["UserId"]);
                    UserProfile us = cont.UserProfiles.FirstOrDefault(x => x.UserId == uId);
                    op.User = us;
                    cont.Operations.Add(op);
                    cont.SaveChanges();
                }
	        }


             return PartialView(new Operation());
        }

        public ActionResult GetOperationsList(int goodId)
        {
            Session["curGood"] = goodId;
            return View();
        }

        public JsonResult OperationsList(string sidx, string sord, int page, int rows)  //Gets the todo Lists.
        {
            int pageIndex = Convert.ToInt32(page) - 1;
            int pageSize = rows;
            int gId = Convert.ToInt32(Session["curGood"]);
            int uId = Convert.ToInt32(Session["UserId"]);
            string OperType = "";
            var GoodsResults = cont.Operations.Where(x => x.GoodId == gId).Select(
                  a => new
                  {
                      a.OperationId,
                      a.User.UserName,
                      OperType = a.OperType == OperationType.Income ? "Приход" : "Расход",
                      a.Quantity,
                      a.OperationTime
                  });

            int totalRecords = GoodsResults.Count();
            var totalPages = (int)Math.Ceiling((float)totalRecords / (float)rows);
            if (sord.ToUpper() == "DESC")
            {
                GoodsResults = GoodsResults.OrderByDescending(s => s.OperationTime);
                GoodsResults = GoodsResults.Skip(pageIndex * pageSize).Take(pageSize);
            }
            else
            {
                GoodsResults = GoodsResults.OrderBy(s => s.OperationTime);
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


        bool GoodEnought(int goodId, int opQty)
        {
            int left = 0;
            using (cont = new WarehouseContext())
            {
                if (cont.Operations.Where(x => x.GoodId == goodId && x.OperType == OperationType.Income).Any())
                left = cont.Operations.Where(x => x.GoodId == goodId&&x.OperType==OperationType.Income).Select(z => z.Quantity).Sum();
                if (cont.Operations.Where(x => x.GoodId == goodId && x.OperType == OperationType.Outcome).Any())
                left -= cont.Operations.Where(x => x.GoodId == goodId && x.OperType == OperationType.Outcome).Select(z => z.Quantity).Sum();
            }
            if ((left-opQty) >= 0)
                return true;
            else
                return false;
        }
    }
}
