using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Webwarehouse.Model.Abstract;
using Webwarehouse.Model.Concrete;
using Webwarehouse.Model.Entities;
using Webwarehouse.UI.Models;

namespace Webwarehouse.UI.Controllers
{
    public class GoodsController : Controller
    {
        /// <summary>
        /// Current good detail info
        /// </summary>
        GoodStatisticViewModel gStat;
        /// <summary>
        /// Database context
        /// </summary>
        WarehouseContext context;
        EFGoodsManager goodsMan=new EFGoodsManager();

        public GoodsController()
        {}
        public GoodsController(IGoodsManager goodsMan)
        {
            //this.goodsMan = goodsMan;
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
                ModelState.AddModelError("", "У вас уже есть такой товар");
            }
            return PartialView();
        }

        /// <summary>
        /// Detailed info of good, chosen in jqgrid
        /// </summary>
        /// <param name="id">id of selected good, if no good choosed = -1</param>
        /// <returns>DetailInfo PartialView with selected goods data</returns>
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

        /// <summary>
        /// Create view, which contains jqgrid
        /// </summary>
        /// <returns>GoodListShow PartialView</returns>
        public PartialViewResult GoodListShow()
        {
            return PartialView();
        }

        /// <summary>
        /// Creating goods list for jqgrid, their insuing sorting
        /// </summary>
        /// <param name="sidx">Sorting row name</param>
        /// <param name="sord">Asc or desc</param>
        /// <param name="page">page number</param>
        /// <param name="rows">number of rows on page</param>
        /// <returns>data for jqgrid</returns>
        public JsonResult GoodsList(string sidx, string sord, int page, int rows)  //Gets the todo Lists.
        {
            //getting jqgrid curunt page and page size
            int pageIndex = Convert.ToInt32(page) - 1;
            int pageSize = rows;
            //current user
            int uId = Convert.ToInt32(Session["UserId"]);

            using (context = new WarehouseContext())
            {

                //getting data for jqgrid from entity
                var GoodsResults = context.Goods.Select(
                                    a => new
                                    {
                                        a.GoodId,
                                        a.GoodName,
                                        a.Price,
                                    });






                //get total pages and rows quantity
                int totalRecords = GoodsResults.Count();
                var totalPages = (int)Math.Ceiling((float)totalRecords / (float)rows);

                //choose parameter to sort, sorting
                switch (sidx)
                {


                    case "Price":
                        if (sord.ToUpper() == "DESC")
                        {
                            GoodsResults = GoodsResults.OrderByDescending(s => s.Price);
                            GoodsResults = GoodsResults.Skip(pageIndex * pageSize).Take(pageSize);
                        }
                        else
                        {
                            GoodsResults = GoodsResults.OrderBy(s => s.Price);
                            GoodsResults = GoodsResults.Skip(pageIndex * pageSize).Take(pageSize);
                        }
                        break;

                    default:
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
                        break;
                }


                //creating data to return to jqgrid
                var jsonData = new
                {
                    total = totalPages,
                    page,
                    records = totalRecords,
                    rows = GoodsResults.ToList()
                };
               
                //returning data to  jqgrid by get method
                return Json(jsonData, JsonRequestBehavior.AllowGet);
            }
        }


        

           
            
        

        /// <summary>
        /// Creating of new good
        /// </summary>
        /// <param name="objGood">New good's data, excluding it's id</param>
        /// <returns>Operation is successful message</returns>
        [HttpPost]
        public string Create([Bind(Exclude = "GoodId")] Good objGood)
        {
            //Summary message - alert in Layout
            string msg="";
            try
            {
                //validation
                if (ModelState.IsValid)
                {
                    //don't have such good's name check
                    if (!goodsMan.AlreadyHaveGood(objGood.GoodName))
                    {
                        using (context=new WarehouseContext())
                        {
                            context.Goods.Add(objGood);
                            context.SaveChanges();
                            msg = "Товар сохранен";
                        }
                        
                    }
                    //have such good's name
                    else
                    {
                        msg = "already have this good";
                    }
                   
                }
                else
                {
                    msg = "Wrong good's data";
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
                    msg = "Товар изменен";
                }
                else
                {
                    msg = "Неправильные данные для товара";
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
            return "Товар удален";
        }

    }
}
