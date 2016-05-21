using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WebWareHouse.Model.Entities;

namespace WebWareHouse.Model.Concrete
{
   public class WarehouseContext : DbContext
    {
        public WarehouseContext()
            : base("DefaultConnection")
        { }
        public DbSet<Good> Goods { get; set; }
        public DbSet<Operation> Operations { get; set; }
        public DbSet<UserProfile> UserProfiles { get; set; }
    }
}
