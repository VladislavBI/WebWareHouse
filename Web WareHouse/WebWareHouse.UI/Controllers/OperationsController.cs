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
        ///     database connection context
        /// </summary>
        private WarehouseContext _context;

        /// <summary>
        /// Get operationAdd view for selected good
        /// </summary>
        /// <param name="idValue">selected good's id</param>
        /// <returns></returns>
        public ActionResult AddOperation(int idValue)
        {
            
            //getting instance of current good from database
            Good goodTemp ;
            using (_context = new WarehouseContext())
            {
                    goodTemp = _context.Goods.FirstOrDefault(x => x.GoodId == idValue);
            }
            //if good exist
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
        /// Creating new operation for good
        /// PS: addOpearion view hides in OperationValidation.js
        /// </summary>
        /// <param name="newOperation">Created operation</param>
        /// <param name="idValue">Operation's good id</param>
        /// <returns>refreshes id window</returns>
        [HttpPost]
        public ActionResult AddOperation(Operation newOperation, int idValue)
        {
            //Setting cur date and good for operation
            newOperation.OperationTime = DateTime.Now;
            newOperation.GoodId = idValue;

            //check for enough good at warehouse
            if (newOperation.OperType == OperationType.Outcome && !GoodEnought(newOperation.GoodId, newOperation.Quantity))
            {
                TempData["opMessage"] = "You haven't got enough good";
            }
            else
            {
                
                using (_context = new WarehouseContext())
                {
                    //Setting user for operation
                    var uId = Convert.ToInt32(Session["UserId"]);
                    var us = _context.UserProfiles.FirstOrDefault(x => x.UserId == uId);
                    newOperation.User = us;

                    //save operation
                    _context.Operations.Add(newOperation);
                    _context.SaveChanges();
                    TempData["opMessage"] = "Operation successfully saved";
                }
            }

            //refreshing detailinfo partial view
            var gStat = new GoodStatisticViewModel(newOperation.GoodId);
            return PartialView("~/Views/Goods/DetailInfo.cshtml", gStat);
        }

        /// <summary>
        /// Get the list of operation for selected good.
        /// </summary>
        /// <param name="IdValue">selected goods id value, -1 f nothing were sent</param>
        /// <returns>Seperate window with operations list 
        /// and operations list's good name</returns>
        public ActionResult GetOperationsList(int IdValue=-1)
        {
            //save of cuurent 
            Session["curGoodId"] = IdValue;

            //Getting name from db by id
            using (_context=new WarehouseContext())
            {
                
                var tempName = _context.Goods.FirstOrDefault(x => x.GoodId == IdValue).GoodName;
                return View(null, null, tempName);
            }
        }

        /// <summary>
        /// Creating operating list for jqgrid, their ensuing sorting.
        /// </summary>
        /// <param name="sidx">Sorting row name</param>
        /// <param name="sord">Asc or desc</param>
        /// <param name="page">page number</param>
        /// <param name="rows">number of rows on page</param>
        /// <param name="GoodId">id of operations list's good</param>
        /// <returns>data for jqgrid</returns>
        public JsonResult OperationsList(string sidx, string sord, int page, int rows) //Gets the todo Lists.
        {
            //getting jqgrid pages data
            var pageIndex = Convert.ToInt32(page) - 1;
            var pageSize = rows;

            //current good id for EF query
            int goodId;
            //checking if session["curGoodId"] have int value
            try
            {
                goodId = Convert.ToInt32(Session["curGoodId"]);
            }
            //if not - assigning nonexistent id value
            catch (Exception)
            {
                goodId = -1;
            }

           


              

            using (_context = new WarehouseContext())
            {
                //getting data for jqgrid from entity
                var operationResults = _context.Operations.Where(x => x.GoodId == goodId).Select(
                a => new
                {
                    a.OperationId,
                    a.User.UserName,
                    OperType = a.OperType == OperationType.Income ? "Income" : "Outcome",
                    a.Quantity,
                    a.OperationTime
                });

                //get total pages and rows quantity
                var totalRecords = operationResults.Count();
                var totalPages = (int) Math.Ceiling(totalRecords/(float) rows);


                //choose parameter to sort, sorting
                switch (sidx)
                {
                    case "UserName":
                        //descending sort
                        if (sord.ToUpper() == "DESC")
                        {
                            //ordering
                            operationResults = operationResults.OrderByDescending(s => s.UserName);
                            //getting rows for current page
                            operationResults = operationResults.Skip(pageIndex*pageSize).Take(pageSize);
                        }
                        //ascending sort
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


                //data to return at jqgrid
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
        /// Check that ther is enough of selected good at warehouse.
        /// </summary>
        /// <param name="goodId">Selected good's id</param>
        /// <param name="transactionValue">Value of certain transaction</param>
        /// <returns></returns>
        private bool GoodEnought(int goodId, int transactionValue)
        {
            //remnants of stock
            var remnants = 0;
            
            //calculation of remnants on certain goods
            using (_context = new WarehouseContext())
            {
                //incomes(plus)
                if (_context.Operations.Any(x => x.GoodId == goodId && x.OperType == OperationType.Income))
                    remnants =
                        _context.Operations.Where(x => x.GoodId == goodId && x.OperType == OperationType.Income)
                            .Select(z => z.Quantity)
                            .Sum();
                //outcomes(minus)
                if (_context.Operations.Any(x => x.GoodId == goodId && x.OperType == OperationType.Outcome))
                    remnants -=
                        _context.Operations.Where(x => x.GoodId == goodId && x.OperType == OperationType.Outcome)
                            .Select(z => z.Quantity)
                            .Sum();
            }
            //check that ramnants are more than transaction value
            if ((remnants - transactionValue) >= 0)
                return true;
            //not enough
            return false;
        }
    }
}