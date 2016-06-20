using System.Linq;
using Webwarehouse.UI.Models.Concrete;
using Webwarehouse.UI.Models.Entities;

namespace Webwarehouse.UI.Models
{
    /// <summary>
    ///  View model for detail good info.
    /// </summary>
    public class GoodStatisticViewModel
    {


        /// <summary>
        /// Main constructor - declarations of all properties.
        /// </summary>
        /// <param name="goodId">Good's for detalization Id</param>
        public GoodStatisticViewModel(int goodId)
        {
            using (WarehouseContext cont = new WarehouseContext())
            {
                //Check if any good is selected.
                GoodId = goodId;
                if (goodId == -1)
                {
                    //If no good is selected -
                    //on start or when deleting good.
                    GoodName = "No good selected";
                }
                else
                {
                    //Filling good's name property.
                    GoodName = cont.Goods.Where(x => x.GoodId == goodId).Select(x => x.GoodName).FirstOrDefault();
                }
                //Try to fill selected good's detail info.
                try
                {
                    //Filling good's price.
                    Price = cont.Goods.Where(x => x.GoodId == goodId).Select(x => x.Price).FirstOrDefault();

                    //Calculating total quantity 
                    //operation will execute only if there were such operations. 

                    //Income (sum plus).
                    if (cont.Operations.Any(x => x.GoodId == goodId && x.OperType == OperationType.Income))
                        TotalQuantity =
                            cont.Operations.Where(x => x.GoodId == goodId && x.OperType == OperationType.Income)
                                .Select(x => x.Quantity)
                                .Sum();

                    //Outcome (sum minus).
                    if (cont.Operations.Any(x => x.GoodId == goodId && x.OperType == OperationType.Outcome))
                        TotalQuantity -=
                            cont.Operations.Where(x => x.GoodId == goodId && x.OperType == OperationType.Outcome)
                                .Select(x => x.Quantity)
                                .Sum();

                    //Calculation total  price.
                    TotalPrice = Price*TotalQuantity;
                }
                //No good selected - all is null.
                catch
                {
                    Price = 0;
                    TotalQuantity = 0;
                    TotalPrice = 0;
                }
            }
        }

        /// <summary>
        /// Id of detailed good.
        /// </summary>
        public int GoodId { get; set; }

        /// <summary>
        /// Name of detailed good.
        /// </summary>
        public string GoodName { get; set; }

        /// <summary>
        /// Price of detailed good.
        /// </summary>
        public decimal Price { get; set; }

        /// <summary>
        /// Total quantity of good after all operations were executed.
        /// </summary>
        public int TotalQuantity { get; set; }

        /// <summary>
        /// Total price of good after all operations were executed, 
        /// calculated from good's price and remnants of stock.
        /// </summary>
        public decimal TotalPrice { get; set; }
    }
}