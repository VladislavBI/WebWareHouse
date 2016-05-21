using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using WebWarehouse.UI.Models;

namespace WebWarehouse.UI.Infrastructure.Abstract
{
    public interface IOperationsManager
    {
        Good curGood { get; set; }
        List<Operation> GetOperationsList();
        void AddOperation(Operation op);

    }
}