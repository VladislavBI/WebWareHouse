using System;
using System.Linq;
using System.Web.Mvc;
using Webwarehouse.UI.Models;
using Webwarehouse.UI.Models.Concrete;
using Webwarehouse.UI.Models.Entities;

namespace Webwarehouse.UI.Controllers
{
    public class OperationsController : Controller
    {
        /// <summary>
        ///  Database connection context.
        /// </summary>
        private WarehouseContext _context;

        /// <summary>
        /// Get operationAdd view for selected good.
        /// </summary>
        /// <param name="idValue">Selected good's id.</param>
        /// <returns>addOperation view in current window</returns>
        public ActionResult AddOperation(int idValue)
        {
            
            //Getting instance of current good from database.
            Good goodTemp ;
            using (_context = new WarehouseContext())
            {
                    goodTemp = _context.Goods.FirstOrDefault(x => x.GoodId == idValue);
            }
            //If good exist.
            if (goodTemp != null)
            {
               
                var op = new Operation { GoodAttached = goodTemp };
                return PartialView(op);
            }
            else
            {
                return PartialView(new Operation());
            }
        }

        /// <summary>
        /// Creating new operation for good.
        /// PS: addOpearion view hiding realized in OperationValidation.js. 
        /// </summary>
        /// <param name="newOperation">Created operation</param>
        /// <param name="idValue">Operation's good id</param>
        /// <returns>Refreshes id window</returns>
        [HttpPost]
        public ActionResult AddOperation(Operation newOperation, int idValue)
        {
            //Setting cur date and good for operation.
            newOperation.OperationTime = DateTime.Now;
            newOperation.GoodId = idValue;

            //Check for enough good at warehouse.
            if (newOperation.OperType == OperationType.Outcome && !GoodEnought(newOperation.GoodId, newOperation.Quantity))
            {
                TempData["opMessage"] = "You haven't got enough good";
            }
            else
            {
                
                using (_context = new WarehouseContext())
                {
                    //Setting user for operation.
                    var uId = Convert.ToInt32(Session["UserId"]);
                    var us = _context.UserProfiles.FirstOrDefault(x => x.UserId == uId);
                    newOperation.User = us;

                    //Save operation.
                    _context.Operations.Add(newOperation);
                    _context.SaveChanges();
                    TempData["opMessage"] = "Operation successfully saved";
                }
            }

            //Refreshing detailinfo partial view.
            var gStat = new GoodStatisticViewModel(newOperation.GoodId);
            return PartialView("~/Views/Goods/DetailInfo.cshtml", gStat);
        }

        /// <summary>
        /// Get the list of operation for selected good.
        /// </summary>
        /// <param name="IdValue">selected goods id value, -1 f nothing were sent</param>
        /// <returns>Separate window with operations list 
        /// and operations list's associated  good name</returns>
        public ActionResult GetOperationsList(int IdValue=-1)
        {
            //Save associated good's id.
            Session["curGoodId"] = IdValue;

            //Getting good name from db by id.
            using (_context=new WarehouseContext())
            {
                
                var tempName = _context.Goods.FirstOrDefault(x => x.GoodId == IdValue).GoodName;
                return View(null, null, tempName);
            }
        }

        /// <summary>
        /// Creating operating list for jqgrid, their ensuing sorting.
        /// </summary>
        /// <param name="sidx">Sorted column name</param>
        /// <param name="sord">Sorting direction: ASC or DESC</param>
        /// <param name="page">Current page number</param>
        /// <param name="rows">Number of rows on page</param>
        /// <returns>Data for jqgrid</returns>
        public JsonResult OperationsList(string sidx, string sord, int page, int rows) 
        {
            //Getting jqgrid pages data.
            var pageIndex = Convert.ToInt32(page) - 1;
            var pageSize = rows;

            //Current good id for EF query.
            int goodId;
            //Checking if session["curGoodId"] has int value.
            try
            {
                goodId = Convert.ToInt32(Session["curGoodId"]);
            }
            //If hasn't - assigning nonexistent id value.
            catch (Exception)
            {
                goodId = -1;
            }

            using (_context = new WarehouseContext())
            {
                //Getting data for jqgrid from entity.
                var operationResults = _context.Operations.Where(x => x.GoodId == goodId).Select(
                a => new
                {
                    a.OperationId,
                    a.User.UserName,
                    OperType = a.OperType == OperationType.Income ? "Income" : "Outcome",
                    a.Quantity,
                    a.OperationTime
                });

                //Get total pages and rows quantity.
                var totalRecords = operationResults.Count();
                var totalPages = (int) Math.Ceiling(totalRecords/(float) rows);


                //Choose parameter to sort, sorting rows.
                switch (sidx)
                {
                    case "UserName":
                        //Descending sort.
                        if (sord.ToUpper() == "DESC")
                        {
                            //Sorting rows.
                            operationResults = operationResults.OrderByDescending(s => s.UserName);
                            //Getting rows for current page.
                            operationResults = operationResults.Skip(pageIndex*pageSize).Take(pageSize);
                        }
                        //Ascending sort.
                        else
                        {
                            operationResults = operationResults.OrderBy(s => s.UserName);
                            operationResults = operationResults.Skip(pageIndex*pageSize).Take(pageSize);
                        }
                        break;

                    case "Quantity":

                        if (sord.ToUpper() == "DESC")
                        {
                            operationResults = operationResults.OrderByDescending(s => s.Quantity);
                            operationResults = operationResults.Skip(pageIndex*pageSize).Take(pageSize);
                        }
                        else
                        {
                            operationResults = operationResults.OrderBy(s => s.Quantity);
                            operationResults = operationResults.Skip(pageIndex*pageSize).Take(pageSize);
                        }
                        break;

                    case "OperType":
                        if (sord.ToUpper() == "DESC")
                        {
                            operationResults = operationResults.OrderByDescending(s => s.OperType);
                            operationResults = operationResults.Skip(pageIndex*pageSize).Take(pageSize);
                        }
                        else
                        {
                            operationResults = operationResults.OrderBy(s => s.OperType);
                            operationResults = operationResults.Skip(pageIndex*pageSize).Take(pageSize);
                        }
                        break;
                        //By date of operaton
                    default:
                        if (sord.ToUpper() == "DESC")
                        {
                            operationResults = operationResults.OrderByDescending(s => s.OperationTime);
                            operationResults = operationResults.Skip(pageIndex*pageSize).Take(pageSize);
                        }
                        else
                        {
                            operationResults = operationResults.OrderBy(s => s.OperationTime);
                            operationResults = operationResults.Skip(pageIndex*pageSize).Take(pageSize);
                        }
                        break;
                }


                //Data to return at jqgrid.
                var jsonData = new
                {
                    total = totalPages,
                    page,
                    records = totalRecords,
                    rows = operationResults.ToList()
                };
                return Json(jsonData, JsonRequestBehavior.AllowGet);
            }
        }

        /// <summary>
        /// Check that there are enough selected good at warehouse.
        /// </summary>
        /// <param name="goodId">Selected good's id</param>
        /// <param name="operationValue">Value of certain operation.</param>
        /// <returns>Do you have enough goods on stock for operation (true - yes, have)</returns>
        private bool GoodEnought(int goodId, int operationValue)
        {
            //Remnants of stock.
            var remnants = 0;
            
            //Calculation of remnants on certain goods.
            using (_context = new WarehouseContext())
            {
                //Incomes(sum plus).
                if (_context.Operations.Any(x => x.GoodId == goodId && x.OperType == OperationType.Income))
                    remnants =
                        _context.Operations.Where(x => x.GoodId == goodId && x.OperType == OperationType.Income)
                            .Select(z => z.Quantity)
                            .Sum();
                //Outcomes(sum minus).
                if (_context.Operations.Any(x => x.GoodId == goodId && x.OperType == OperationType.Outcome))
                    remnants -=
                        _context.Operations.Where(x => x.GoodId == goodId && x.OperType == OperationType.Outcome)
                            .Select(z => z.Quantity)
                            .Sum();
            }
            //Check that remnants are more than operation value.
            if ((remnants - operationValue) >= 0)
                return true;

            //Not enough.
            return false;
        }
    }
}