using System.Data.Entity;
using Webwarehouse.UI.Models.Concrete;

namespace Webwarehouse.UI.Infrastructure
{
    /// <summary>
    /// Create new database if it not exists.
    /// </summary>
    public class DbWarehouseInitializer : CreateDatabaseIfNotExists<WarehouseContext>
    {
        protected override void Seed(WarehouseContext context)
        {
            base.Seed(context);
        }
    }
}