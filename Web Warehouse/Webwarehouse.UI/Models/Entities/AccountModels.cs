using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Webwarehouse.UI.Models.Entities
{
    /// <summary>
    /// Profile of user.
    /// </summary>
    [Table("UserProfile")]
    public class UserProfile
    {
        /// <summary>
        /// Users id.
        /// </summary>
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int UserId { get; set; }

        /// <summary>
        /// Name of user.
        /// </summary>
        public string UserName { get; set; }

        /// <summary>
        /// Operation with good executed by current user
        /// </summary>
        public List<Operation> OperationsList { get; set; }
    }


    /// <summary>
    ///Main info for user's login - on login view.
    /// </summary>
    public class LoginModel
    {
        /// <summary>
        /// Users name.
        /// </summary>
        [Required]
        [Display(Name = "User name")]
        public string UserName { get; set; }

        /// <summary>
        /// Users password
        /// </summary>
        [Required]
        [StringLength(255, ErrorMessage = "Password should contain nit more than {2} characters.", MinimumLength = 3)]
        [DataType(DataType.Password)]
        [Display(Name = "Password")]
        public string Password { get; set; }

        /// <summary>
        /// Should we remember users session
        /// </summary>
        [Display(Name = "Remember me?")]
        public bool RememberMe { get; set; }
    }

    /// <summary>
    ///Main info for user's registration - on Register view.
    /// </summary>
    public class RegisterModel
    {
        /// <summary>
        /// Users name.
        /// </summary>
        [Required]
        [Display(Name = "User name")]
        public string UserName { get; set; }

        /// <summary>
        /// User's password
        /// </summary>
        [Required]
        [StringLength(255, ErrorMessage = "Password should contain nit more than {2} characters.", MinimumLength = 3)]
        [DataType(DataType.Password)]
        [Display(Name = "Password")]
        public string Password { get; set; }

        /// <summary>
        /// Conformation of user's password
        /// </summary>
        [DataType(DataType.Password)]
        [Display(Name = "Confirm password")]
        [Compare("Password", ErrorMessage = "Paswords are not equal.")]
        public string ConfirmPassword { get; set; }
    }
}