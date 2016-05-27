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
    public enum OperationType { Income = 1, Outcome = 2 }

    [Table("Operations")]
    public class Operation
    {
        [Key]
        [HiddenInput(DisplayValue = false)]
        public int OperationId { get; set; }

        [Required]
        
        public int GoodId { get; set; }

        [Required]
        [Range(typeof(int), "1", "10000", ErrorMessage = "количество должно быть от 1 до 10000")]
        public int Quantity { get; set; }

        [Required]
        public OperationType OperType { get; set; }

        [HiddenInput(DisplayValue = false)]
        [DataType(DataType.Date)]
        public DateTime OperationTime { get; set; }
        public Good GoodAttached { get; set; }
       

        public int UserId { get; set; }
        public UserProfile User { get; set; }
    }
}
