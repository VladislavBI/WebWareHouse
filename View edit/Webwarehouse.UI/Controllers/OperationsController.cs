using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Webwarehouse.Model.Concrete;
using Webwarehouse.Model.Entities;
using Webwarehouse.UI.Models;

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
        public ActionResult Add(Operation op, int idVal)
        {
            op.OperationTime = DateTime.Now;
            op.GoodId = idVal;
             if (op.OperType==OperationType.Outcome&&!GoodEnought(op.GoodId, op.Quantity))
                {
                    TempData["opMessage"]= "You haven't got enough product";
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
                    TempData["opMessage"] = "Product successfully saved";
                }
	        }

            GoodStatisticViewModel gStat= new GoodStatisticViewModel(op.GoodId);
            return PartialView("~/Views/Goods/DetailInfo.cshtml", gStat);
        }

        public ActionResult GetOperationsList(int idVal)
        {
            Session["curGood"] = idVal;
            return View();
        }

        /// <summary>
        /// Creating operating list for jqgrid, their insuing sorting
        /// </summary>
        /// <param name="sidx">Sorting row name</param>
        /// <param name="sord">Asc or desc</param>
        /// <param name="page">page number</param>
        /// <param name="rows">number of rows on page</param>
        /// <returns>data for jqgrid</returns>
        public JsonResult OperationsList(string sidx, string sord, int page, int rows)  //Gets the todo Lists.
        {
            //getting jqgrid pages data
            int pageIndex = Convert.ToInt32(page) - 1;
            int pageSize = rows;
            //current good
            int gId = Convert.ToInt32(Session["curGood"]);
            //current user
            int uId = Convert.ToInt32(Session["UserId"]);
            string OperType = "";

            //getting data for jqgrid from entity
            var operationResults = cont.Operations.Where(x => x.GoodId == gId).Select(
                  a => new
                  {
                      a.OperationId,
                      a.User.UserName,
                      OperType = a.OperType == OperationType.Income ? "Income" : "Outcome",
                      a.Quantity,
                      a.OperationTime
                  });

            //get total pages and rows quantity
            int totalRecords = operationResults.Count();
            var totalPages = (int)Math.Ceiling((float)totalRecords / (float)rows);


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
                        operationResults = operationResults.Skip(pageIndex * pageSize).Take(pageSize);
                    }
                    //ascending sort
                    else
                    {
                        operationResults = operationResults.OrderBy(s => s.UserName);
                        operationResults = operationResults.Skip(pageIndex * pageSize).Take(pageSize);
                    }
                    break;

                case "Quantity":

                    if (sord.ToUpper() == "DESC")
                    {
                        operationResults = operationResults.OrderByDescending(s => s.Quantity);
                        operationResults = operationResults.Skip(pageIndex * pageSize).Take(pageSize);
                    }
                    else
                    {
                        operationResults = operationResults.OrderBy(s => s.Quantity);
                        operationResults = operationResults.Skip(pageIndex * pageSize).Take(pageSize);
                    }
                    break;

                    case "OperType":
                    if (sord.ToUpper() == "DESC")
                    {   
                        operationResults = operationResults.OrderByDescending(s => s.OperType);
                        operationResults = operationResults.Skip(pageIndex * pageSize).Take(pageSize);
                    }
                    else
                    {
                        operationResults = operationResults.OrderBy(s => s.OperType);
                        operationResults = operationResults.Skip(pageIndex * pageSize).Take(pageSize);
                    }
                    break;

                default:
                    if (sord.ToUpper() == "DESC")
                    {
                        operationResults = operationResults.OrderByDescending(s => s.OperationTime);
                        operationResults = operationResults.Skip(pageIndex * pageSize).Take(pageSize);
                    }
                    else
                    {
                        operationResults = operationResults.OrderBy(s => s.OperationTime);
                        operationResults = operationResults.Skip(pageIndex * pageSize).Take(pageSize);
                    }
                    break;
            }


            

            var jsonData = new
            {
                total = totalPages,
                page,
                records = totalRecords,
                rows = operationResults
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
