using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data.Entity;
using WebWarehouse.UI.Models;

namespace WebWarehouse.UI.Infrastructure.Concrete
{
    public class WarehouseContext:DbContext
    {
         public WarehouseContext (): base("DefaultConnection")
         { }
         public DbSet<Good> Goods { get; set; }
         public DbSet<Operation> Operations { get; set; }
         public DbSet<UserProfile> UserProfiles { get; set; }
   
    }
}