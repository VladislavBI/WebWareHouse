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
        private readonly EfGoodManager _goodManager;

        public GoodsController()
        {}

        /// <summary>
        /// To apply DI.
        /// </summary>
        /// <param name="goodsMananager">Main goods EF opearions.</param>
        public GoodsController(IGoodManager goodsMananager)
        {
            _goodManager = (EfGoodManager) goodsMananager;
        }
       

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
        /// <param name="sidx">Sorted column name</param>
        /// <param name="sord">Sorting direction:ASC or DESC</param>
        /// <param name="page">Current page number</param>
        /// <param name="rows">Number of rows on page</param>
        /// <returns>Data for jqgrid</returns>
        public JsonResult GoodsList(string sidx, string sord, int page, int rows) 
        {
            //Getting jqgrid curunt page and page size.
            var pageIndex = Convert.ToInt32(page) - 1;
            var pageSize = rows;
            //Current user.

            using (_context = new WarehouseContext())
            {
                //Getting data for jqgrid from entity.
                var goodsResults = _context.Goods.Select(
                    a => new
                    {
                        a.GoodId,
                        a.GoodName,
                        a.Price
                    });


                //Get total pages and rows quantity.
                var totalRecords = goodsResults.Count();
                var totalPages = (int) Math.Ceiling(totalRecords/(float) rows);

                //Choose parameter to sort, sorting rows.
                switch (sidx)
                {
                    case "Price":
                        //Descending sort.
                        if (sord.ToUpper() == "DESC")
                        {
                            //Sorting rows.
                            goodsResults = goodsResults.OrderByDescending(s => s.Price);
                            //Getting rows for current page.
                            goodsResults = goodsResults.Skip(pageIndex*pageSize).Take(pageSize);
                        }
                        //Ascending sort.
                        else
                        {
                            goodsResults = goodsResults.OrderBy(s => s.Price);
                            goodsResults = goodsResults.Skip(pageIndex*pageSize).Take(pageSize);
                        }
                        break;
                        //By good name
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


                //Creating data to return to jqgrid.
                var jsonData = new
                {
                    total = totalPages,
                    page,
                    records = totalRecords,
                    rows = goodsResults.ToList()
                };

                //Returning data to  jqgrid by get method.
                return Json(jsonData, JsonRequestBehavior.AllowGet);
            }
        }

        /// <summary>
        /// Creating new good.
        /// </summary>
        /// <param name="objGood">New good's data, excluding it's id</param>
        /// <returns>Operation is or not successful message.</returns>
        [HttpPost]
        public string Create([Bind(Exclude = "GoodId")] Good objGood)
        {
            //Summary message - alert in Layout.
            string msg;
            try
            {
                //Add good's data validation..
                if (ModelState.IsValid)
                {
                    //Check if we have this good.
                    if (!_goodManager.AlreadyHaveGood(objGood.GoodName))
                    {
                        _goodManager.AddGood(objGood);
                        msg = "Good was saved";
                    }
                    //Already have this good.
                    else
                    {
                        msg = "already have this good";
                    }
                }
                //Don't pass validation.
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
        /// Editing existend good.
        /// </summary>
        /// <param name="objGood">Editable object</param>
        /// <returns>Operation is or not successful message.</returns>
        public string Edit(Good objGood)
        {
            //Returning message.
            string msg;
            try
            {
                //Edit good's data validation.
                if (ModelState.IsValid)
                {
                    using (_context = new WarehouseContext())
                    {
                        //Modifying changed good.
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
        /// Deleting selected  good.
        /// </summary>
        /// <param name="id">Selected good id</param>
        /// <returns>Operation is or not successful message.</returns>
        public string Delete(int id)
        {
            using (_context=new WarehouseContext())
            { 
                try
                {
                    //Finding selected good.
                    var goodForDelete = _context.Goods.Find(id);

                    //Try to delete selected good.
                    if (goodForDelete!=null)
                    {
                        _context.Goods.Remove(goodForDelete);
                        _context.SaveChanges();
                        return "Good was deleted";
                    }
                    //Product wasn't found.
                    else
                    {
                        return "Delete error";
                    }
                }
                catch (Exception)
                {
                    //Something went wrong.
                    return "Delete error";
                }
                
            }
            
            
        }
    }
}