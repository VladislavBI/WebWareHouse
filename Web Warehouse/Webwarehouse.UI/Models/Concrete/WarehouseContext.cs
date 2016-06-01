using System.Data.Entity;
using Webwarehouse.UI.Models.Entities;

namespace Webwarehouse.UI.Models.Concrete
{
    /// <summary>
    /// Warehouse database context.
    /// </summary>
    public class WarehouseContext : DbContext
    {
        public WarehouseContext()
            : base("DefaultConnection")
        {
        }

        /// <summary>
        /// List of goods.
        /// </summary>
        public DbSet<Good> Goods { get; set; }

        /// <summary>
        /// List of operations.
        /// </summary>
        public DbSet<Operation> Operations { get; set; }

        /// <summary>
        /// List of users.
        /// </summary>
        public DbSet<UserProfile> UserProfiles { get; set; }
    }
}