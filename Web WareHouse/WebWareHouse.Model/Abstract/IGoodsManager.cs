using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WebWareHouse.Model.Entities;

namespace WebWareHouse.Model.Abstract
{
    public interface IGoodsManager
    {
        List<Good> GoodsList { get; set; }
        void AddProduct(Good g);

        bool AlreadyHaveGood(string name);
    }
}
