using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Web.Mvc;

namespace Webwarehouse.UI.Models.Entities
{
    /// <summary>
    /// Goods at warehouse table
    /// </summary>
    [Table("Goods")]
    public class Good
    {
       
        [Key]
        [HiddenInput(DisplayValue = false)]
        public int GoodId { get; set; }


        [Required]
        [StringLength(50, MinimumLength = 1)]
        public string GoodName { get; set; }


        [Required]
        [Column(TypeName = "money")]
        [Range(typeof (decimal), "1", "10000", ErrorMessage = "price should be between 1 and 10000")]
        public decimal Price { get; set; }

        /// <summary>
        /// all operations, which were executed on current good
        /// </summary>
        [HiddenInput(DisplayValue = false)]
        public List<Operation> Operations { get; set; }
    }
}