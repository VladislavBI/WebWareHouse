using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Webwarehouse.Model.Entities;

namespace Webwarehouse.Model.Abstract
{
    public interface IOperationsManager
    {
        Good curGood { get; set; }
        List<Operation> GetOperationsList();
        void AddOperation(Operation op);
    }
}
