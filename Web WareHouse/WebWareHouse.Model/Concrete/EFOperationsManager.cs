using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Webwarehouse.Model.Abstract;
using Webwarehouse.Model.Entities;

namespace Webwarehouse.Model.Concrete
{
    class EFOperationsManager : IOperationsManager
    {
        WarehouseContext context;
        //Установлені тестовіе значения!!!!
        public Good curGood
        {
            get
            {
                using (context = new WarehouseContext())
                {
                    return context.Goods.Where(x => x.GoodId == 1).FirstOrDefault();
                }
            }
            set
            {
                curGood = value;
            }
        }

        public List<Operation> GetOperationsList()
        {
            using (context = new WarehouseContext())
            {
                var list = context.Operations.Where(x => x.GoodId == curGood.GoodId).ToList();
                return list;
            }

        }


        public void AddOperation(Operation op)
        {
            using (context = new WarehouseContext())
            {
                op.GoodAttached = curGood;
                context.Operations.Add(op);
                context.SaveChanges();
            }
        }
    }
}
