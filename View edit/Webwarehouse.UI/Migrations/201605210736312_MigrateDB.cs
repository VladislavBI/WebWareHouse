using System.Data.Entity.Migrations;

namespace Webwarehouse.UI.Migrations
{
    public partial class MigrateDb : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.Goods",
                c => new
                {
                    GoodId = c.Int(false, true),
                    GoodName = c.String(false, 50),
                    Price = c.Decimal(false, storeType: "money")
                })
                .PrimaryKey(t => t.GoodId);

            CreateTable(
                "dbo.Operations",
                c => new
                {
                    OperationId = c.Int(false, true),
                    GoodId = c.Int(false),
                    Quantity = c.Int(false),
                    OperType = c.Int(false),
                    OperationTime = c.DateTime(false),
                    UserId = c.Int(false)
                })
                .PrimaryKey(t => t.OperationId)
                .ForeignKey("dbo.Goods", t => t.GoodId, true)
                .ForeignKey("dbo.UserProfile", t => t.UserId, true)
                .Index(t => t.GoodId)
                .Index(t => t.UserId);

            CreateTable(
                "dbo.UserProfile",
                c => new
                {
                    UserId = c.Int(false, true),
                    UserName = c.String()
                })
                .PrimaryKey(t => t.UserId);
        }

        public override void Down()
        {
            DropForeignKey("dbo.Operations", "UserId", "dbo.UserProfile");
            DropForeignKey("dbo.Operations", "GoodId", "dbo.Goods");
            DropIndex("dbo.Operations", new[] {"UserId"});
            DropIndex("dbo.Operations", new[] {"GoodId"});
            DropTable("dbo.UserProfile");
            DropTable("dbo.Operations");
            DropTable("dbo.Goods");
        }
    }
}