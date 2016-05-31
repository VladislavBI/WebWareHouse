using System.Data.Entity;
using Webwarehouse.UI.Models.Concrete;

namespace Webwarehouse.UI.Infrastructure
{
    /// <summary>
    /// Create new database
    /// </summary>
    public class DbWarehouseInitializer : CreateDatabaseIfNotExists<WarehouseContext>
    {
        protected override void Seed(WarehouseContext context)
        {
            base.Seed(context);
        }
    }
}