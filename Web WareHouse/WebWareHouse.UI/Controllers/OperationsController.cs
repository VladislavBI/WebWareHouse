using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using WebWareHouse.Model.Concrete;
using WebWareHouse.Model.Entities;

namespace WebWareHouse.UI.Controllers
{
    public class OperationsController : Controller
    {
        WarehouseContext cont = new WarehouseContext();

        public ActionResult Add(int goodId)
        {
            Good g;
            using (cont = new WarehouseContext())
            {
                g = cont.Goods.FirstOrDefault(x => x.GoodId == goodId);
            }

            Operation op = new Operation() { GoodAttached = g };
            return View(op);
        }
        [HttpPost]
        public RedirectToRouteResult Add(Operation op)
        {
            op.OperationTime = DateTime.Now;
            if (op.OperType == OperationType.Outcome)
            {
                op.Quantity *= -1;
            }
            using (cont = new WarehouseContext())
            {
                int uId = Convert.ToInt32(Session["UserId"]);
                UserProfile us = cont.UserProfiles.FirstOrDefault(x => x.UserId == uId);
                op.User = us;

                cont.Operations.Add(op);
                cont.SaveChanges();
            }

            return RedirectToAction("Index", "Home");
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

    }
}
