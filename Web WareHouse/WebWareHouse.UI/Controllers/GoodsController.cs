using System;
using System.Data.Entity;
using System.Linq;
using System.Web.Mvc;
using Webwarehouse.UI.Models;
using Webwarehouse.UI.Models.Abstract;
using Webwarehouse.UI.Models.Concrete;
using Webwarehouse.UI.Models.Entities;

namespace Webwarehouse.UI.Controllers
{
    public class GoodsController : Controller
    {
        /// <summary>
        /// Database context.
        /// </summary>
        private WarehouseContext _context;

        /// <summary>
        /// Current good detail info.
        /// </summary>
        private GoodStatisticViewModel _goodStatisticVM;

        /// <summary>
        /// Interface for goods main EF operations.
        /// </summary>
        private readonly EfGoodManager _goodMananager;

        public GoodsController()
        {}

        /// <summary>
        /// To apply DI in separate window
        /// </summary>
        /// <param name="goodsMananager">main goods EF opearions</param>
        public GoodsController(IGoodManager goodsMananager)
        {
            _goodMananager = (EfGoodManager) goodsMananager;
        }
        /*
        public ActionResult AddGood()
        {
            return PartialView();
        }

        [HttpPost]
        public ActionResult AddGood(Good good)
        {
            if (!_goodMananager.AlreadyHaveGood(good.GoodName))
            {
                _goodMananager.AddGood(good);
            }
            else
            {
                ModelState.AddModelError("", "У вас уже есть такой товар");
            }
            return PartialView();
        }

        /// <summary>
        ///     Detailed info of good, chosen in jqgrid
        /// </summary>
        /// <param name="id">id of selected good, if no good choosed = -1</param>
        /// <returns>DetailInfo PartialView with selected goods data</returns>
       
        
        /// <summary>
        ///     Creating command for redirect
        /// </summary>
        /// <param name="idValue"></param>
        /// <returns></returns>
        public ActionResult OperationSelector(int idValue)
        {
            return Json(new {url = Url.Action("GetOperationsList", "Operations", new {goodId = idValue})});
        }
        */
        /// <summary>
        /// Create goods list view, which is uesd for jqgrid.
        /// </summary>
        /// <returns> Partial view with list of goods</returns>
        public PartialViewResult GoodsListShow()
        {
            return PartialView();
        }

        /// <summary>
        /// Return view with detail info of new good.
        /// </summary>
        /// <param name="id">Good's id</param>
        /// <returns>partial view with good's detailed info</returns>
        public PartialViewResult DetailInfo(int id = -1)
        {
            _goodStatisticVM = new GoodStatisticViewModel(id);
            return PartialView(_goodStatisticVM);
        }
        /// <summary>
        /// Creating goods list for jqgrid, their insuing sorting.
        /// </summary>
        /// <param name="sidx">Sorting row name</param>
        /// <param name="sord">Asc or desc</param>
        /// <param name="page">page number</param>
        /// <param name="rows">number of rows on page</param>
        /// <returns>data for jqgrid</returns>
        public JsonResult GoodsList(string sidx, string sord, int page, int rows) //Gets the todo Lists.
        {
            //getting jqgrid curunt page and page size
            var pageIndex = Convert.ToInt32(page) - 1;
            var pageSize = rows;
            //current user

            using (_context = new WarehouseContext())
            {
                //getting data for jqgrid from entity
                var goodsResults = _context.Goods.Select(
                    a => new
                    {
                        a.GoodId,
                        a.GoodName,
                        a.Price
                    });


                //get total pages and rows quantity
                var totalRecords = goodsResults.Count();
                var totalPages = (int) Math.Ceiling(totalRecords/(float) rows);

                //choose parameter to sort, sorting
                switch (sidx)
                {
                    case "Price":
                        if (sord.ToUpper() == "DESC")
                        {
                            goodsResults = goodsResults.OrderByDescending(s => s.Price);
                            goodsResults = goodsResults.Skip(pageIndex*pageSize).Take(pageSize);
                        }
                        else
                        {
                            goodsResults = goodsResults.OrderBy(s => s.Price);
                            goodsResults = goodsResults.Skip(pageIndex*pageSize).Take(pageSize);
                        }
                        break;

                    default:
                        if (sord.ToUpper() == "DESC")
                        {
                            goodsResults = goodsResults.OrderByDescending(s => s.GoodName);
                            goodsResults = goodsResults.Skip(pageIndex*pageSize).Take(pageSize);
                        }
                        else
                        {
                            goodsResults = goodsResults.OrderBy(s => s.GoodName);
                            goodsResults = goodsResults.Skip(pageIndex*pageSize).Take(pageSize);
                        }
                        break;
                }


                //creating data to return to jqgrid
                var jsonData = new
                {
                    total = totalPages,
                    page,
                    records = totalRecords,
                    rows = goodsResults.ToList()
                };

                //returning data to  jqgrid by get method
                return Json(jsonData, JsonRequestBehavior.AllowGet);
            }
        }

        /// <summary>
        /// Creating of new good.
        /// </summary>
        /// <param name="objGood">New good's data, excluding it's id</param>
        /// <returns>Operation is or not successful message</returns>
        [HttpPost]
        public string Create([Bind(Exclude = "GoodId")] Good objGood)
        {
            //Summary message - alert in Layout
            string msg;
            try
            {
                //validation
                if (ModelState.IsValid)
                {
                    //check if we have this good
                    if (!_goodMananager.AlreadyHaveGood(objGood.GoodName))
                    {
                        _goodMananager.AddGood(objGood);
                        msg = "Товар сохранен";
                    }
                    //already have this good
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

        /// <summary>
        /// Editing of existend good
        /// </summary>
        /// <param name="objGood">Editable object</param>
        /// <returns>Operation is or not successful message</returns>
        public string Edit(Good objGood)
        {
            //Returning message.
            string msg;
            try
            {
                //Goods data validation.
                if (ModelState.IsValid)
                {
                    using (_context = new WarehouseContext())
                    {
                        //Modifying changed good
                        _context.Entry(objGood).State = EntityState.Modified;
                        _context.SaveChanges();
                        msg = "Good was changed";
                    }
                }
                else
                {
                    //validation is not successful
                    msg = "Wrong data for good";
                }
            }
            catch (Exception ex)
            {
                msg = "Error occured:" + ex.Message;
            }
            return msg;
        }

        /// <summary>
        /// Deleting of selected  good.
        /// </summary>
        /// <param name="id">selected good id</param>
        /// <returns></returns>
        public string Delete(int id)
        {
            using (_context=new WarehouseContext())
            { 
                try
                {
                    //Try to delete selected good.
                    var todolist = _context.Goods.Find(id);
                    _context.Goods.Remove(todolist);
                    _context.SaveChanges();
                    return "Good was deleted";
                }
                catch (Exception)
                {
                    //Something go wrong
                    return "Delete error";
                }
                
            }
            
            
        }
    }
}