using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Web.Mvc;

namespace Webwarehouse.UI.Models.Entities
{
    /// <summary>
    /// Types of operations
    /// </summary>
    public enum OperationType
    {
        /// <summary>
        /// Good were carried to warehouse
        /// </summary>
        Income = 1,
        /// <summary>
        /// good were carried out from warehouse
        /// </summary>
        Outcome = 2
    }


    [Table("Operations")]
    public class Operation
    {
        [Key]
        [HiddenInput(DisplayValue = false)]
        public int OperationId { get; set; }

        /// <summary>
        /// Id of good at which operation were executed.
        /// </summary>
        [Required]
        public int GoodId { get; set; }


        [Required]
        [RegularExpression("([0-9]+)", ErrorMessage = "Must be integer")]
        [Range(typeof (int), "1", "10000", ErrorMessage = "Quantity should be between 1 and 10000")]
        public int Quantity { get; set; }

        /// <summary>
        /// Type of opertaion
        /// </summary>
        [Required]
        public OperationType OperType { get; set; }

        /// <summary>
        /// When were the operation executed.
        /// </summary>
        [HiddenInput(DisplayValue = false)]
        [DataType(DataType.Date)]
        public DateTime OperationTime { get; set; }

        /// <summary>
        /// Good at which the operation were executed.
        /// </summary>
        public Good GoodAttached { get; set; }
        /// <summary>
        /// Id of user, who executed the operation.     
        /// /// </summary>
        public int UserId { get; set; }

        /// <summary>
        ///  User, who executed the operation
        /// </summary>
        public UserProfile User { get; set; }
    }
}