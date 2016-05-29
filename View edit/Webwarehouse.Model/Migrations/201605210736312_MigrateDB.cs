namespace Webwarehouse.Model.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class MigrateDB : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.Goods",
                c => new
                    {
                        GoodId = c.Int(nullable: false, identity: true),
                        GoodName = c.String(nullable: false, maxLength: 50),
                        Price = c.Decimal(nullable: false, storeType: "money"),
                    })
                .PrimaryKey(t => t.GoodId);
            
            CreateTable(
                "dbo.Operations",
                c => new
                    {
                        OperationId = c.Int(nullable: false, identity: true),
                        GoodId = c.Int(nullable: false),
                        Quantity = c.Int(nullable: false),
                        OperType = c.Int(nullable: false),
                        OperationTime = c.DateTime(nullable: false),
                        UserId = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.OperationId)
                .ForeignKey("dbo.Goods", t => t.GoodId, cascadeDelete: true)
                .ForeignKey("dbo.UserProfile", t => t.UserId, cascadeDelete: true)
                .Index(t => t.GoodId)
                .Index(t => t.UserId);
            
            CreateTable(
                "dbo.UserProfile",
                c => new
                    {
                        UserId = c.Int(nullable: false, identity: true),
                        UserName = c.String(),
                    })
                .PrimaryKey(t => t.UserId);
            
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.Operations", "UserId", "dbo.UserProfile");
            DropForeignKey("dbo.Operations", "GoodId", "dbo.Goods");
            DropIndex("dbo.Operations", new[] { "UserId" });
            DropIndex("dbo.Operations", new[] { "GoodId" });
            DropTable("dbo.UserProfile");
            DropTable("dbo.Operations");
            DropTable("dbo.Goods");
        }
    }
}
