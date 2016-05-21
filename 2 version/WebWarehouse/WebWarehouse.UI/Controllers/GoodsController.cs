using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using WebWarehouse.UI.Infrastructure.Concrete;
using WebWarehouse.UI.Models;

namespace WebWarehouse.UI.Controllers
{
    public class GoodsController : Controller
    {
        //
        // GET: /Goods/
        GoodStatisticViewModel gStat;
        public ActionResult Index()
        {
            return View();
        }

        public PartialViewResult DetailInfo(int id=-1)
        {
                gStat = new GoodStatisticViewModel(id);
                return PartialView(gStat);
            
            
            
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
        public string Edit(Good objTodo)
        {
            string msg;
            try
            {
                if (ModelState.IsValid)
                {
                    context.Entry(objTodo).State = EntityState.Modified;
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
