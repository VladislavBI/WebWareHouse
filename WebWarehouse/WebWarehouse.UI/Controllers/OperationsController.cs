using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using WebWarehouse.UI.Infrastructure.Concrete;
using WebWarehouse.UI.Models;

namespace WebWarehouse.UI.Controllers
{
    public class OperationsController : Controller
    {
        //TODO
        //Сделать здесь интерфейс!
        WarehouseContext cont;

        public ActionResult Add(int goodId)
        {
            Good g;
            using (cont=new WarehouseContext())
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
            if (op.OperType==OperationType.Outcome)
	            {
		            op.Quantity*=-1;
	            }
            using (cont=new WarehouseContext())
            {
                cont.Operations.Add(op);
                cont.SaveChanges();
            }

            return RedirectToAction("Index", "Home");
        }

        public ActionResult OperationsList(int goodId)
        {
            using (cont = new WarehouseContext())
            {
                var list = cont.Operations.Include("GoodAttached").Where(x => x.GoodId == goodId).ToList();
                return View(list);

            }
        }

    }
}
