using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;
using Webwarehouse.Model.Concrete;

namespace Webwarehouse.UI.Infrastructure
{
    public class DBWarehouseInitializer : CreateDatabaseIfNotExists<WarehouseContext>
    {
        protected override void Seed(WarehouseContext context)
        {
            base.Seed(context);
        }
    }
}