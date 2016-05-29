using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Mvc;

namespace Webwarehouse.Model.Entities
{
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
        [Range(typeof(decimal), "1", "10000", ErrorMessage = "цена должна быть от 1 до 10000")]
        public decimal Price { get; set; }

        [HiddenInput(DisplayValue = false)]
        public List<Operation> Operations { get; set; }
    }
}
