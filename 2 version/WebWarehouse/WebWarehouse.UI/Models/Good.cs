using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace WebWarehouse.UI.Models
{
    [Table("Goods")]
    public class Good
    {
        [Key]
        [HiddenInput(DisplayValue=false)]
        public int GoodId { get; set; }

        [Required]
        [StringLength(50)]
        public string GoodName { get; set; }
        [Required]
        [Column(TypeName="money")]
        public decimal Price { get; set; }


        [HiddenInput(DisplayValue = false)]
        public int UserId { get; set; }

        [HiddenInput(DisplayValue = false)]
        public List<Operation> Operations { get; set; }
    }
}