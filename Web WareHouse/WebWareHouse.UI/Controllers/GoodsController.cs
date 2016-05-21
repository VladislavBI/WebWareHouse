using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using WebWareHouse.Model.Abstract;
using WebWareHouse.Model.Concrete;
using WebWareHouse.Model.Entities;
using WebWareHouse.UI.Models;

namespace WebWareHouse.UI.Controllers
{
    public class GoodsController : Controller
    {
        GoodStatisticViewModel gStat;
        WarehouseContext context = new WarehouseContext();
        IGoodsManager goodsMan;

        public GoodsController()
        {}
        public GoodsController(IGoodsManager goodsMan)
        {
            this.goodsMan = goodsMan;
        }


        public ActionResult Index()
        {
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


        public PartialViewResult DetailInfo(int id = -1)
        {
            gStat = new GoodStatisticViewModel(id);
            return PartialView(gStat);
        }
        public ActionResult OperationSelector(object idVal, string Command)
        {
            string[] a = (string[])idVal;
            int id = Convert.ToInt32(a[0]);
            if (Command == "Статистика операций")
            {
                return Json(new { url = Url.Action("GetOperationsList", "Operations", new { goodId = id }) });
            }
            else
            {
                return Json(new { url = Url.Action("Add", "Operations", new { goodId = id }) });
            }
        }

        public PartialViewResult GoodListShow()
        {
            return PartialView();
        }

        public JsonResult GoodsList(string sidx, string sord, int page, int rows)  //Gets the todo Lists.
        {
            int pageIndex = Convert.ToInt32(page) - 1;
            int pageSize = rows;
            int uId = Convert.ToInt32(Session["UserId"]);
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

        // TODO:insert a new row to the grid logic here
        [HttpPost]
        public string Create([Bind(Exclude = "GoodId")] Good objGood)
        {
            string msg;
            try
            {
                if (ModelState.IsValid)
                {
                    context.Goods.Add(objGood);
                    context.SaveChanges();
                    msg = "Saved Successfully";
                }
                else
                {
                    msg = "Validation data not successfull";
                }
            }
            catch (Exception ex)
            {
                msg = "Error occured:" + ex.Message;
            }
            return msg;
        }
        public string Edit(Good objGood)
        {
            string msg;
            try
            {
                if (ModelState.IsValid)
                {
                    context.Entry(objGood).State = EntityState.Modified;
                    context.SaveChanges();
                    msg = "Saved Successfully";
                }
                else
                {
                    msg = "Validation data not successfull";
                }
            }
            catch (Exception ex)
            {
                msg = "Error occured:" + ex.Message;
            }
            return msg;
        }
        public string Delete(int Id)
        {
            Good todolist = context.Goods.Find(Id);
            context.Goods.Remove(todolist);
            context.SaveChanges();
            return "Deleted successfully";
        }

    }
}
