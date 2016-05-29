using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity;
using System.Globalization;
using System.Web.Security;


namespace Webwarehouse.Model.Entities
{
        [Table("UserProfile")]
        public class UserProfile
        {
            [Key]
            [DatabaseGeneratedAttribute(DatabaseGeneratedOption.Identity)]
            public int UserId { get; set; }
            public string UserName { get; set; }
            public List<Operation> OperationsList { get; set; }
        }

        public class RegisterExternalLoginModel
        {
            [Required]
            [Display(Name = "User name")]
            public string UserName { get; set; }

            public string ExternalLoginData { get; set; }
        }

        public class LocalPasswordModel
        {
            [Required]
            [StringLength(255, ErrorMessage = "Пароль должен содержать не менее {2} символа.", MinimumLength = 1)]
            [DataType(DataType.Password)]
            [Display(Name = "Current password")]
           
            public string OldPassword { get; set; }

            [Required]
            [StringLength(255, ErrorMessage = "Пароль должен содержать не менее {2} символа.", MinimumLength = 3)]
            [DataType(DataType.Password)]
            [Display(Name = "New password")]
            
            public string NewPassword { get; set; }

            [DataType(DataType.Password)]
            [Display(Name = "Confirm new password")]
            [Compare("NewPassword", ErrorMessage = "Пароли не совпадают.")]
           
            public string ConfirmPassword { get; set; }
        }

        public class LoginModel
        {
            [Required]
            [Display(Name = "User name")]

            public string UserName { get; set; }

            [Required]
            [DataType(DataType.Password)]
            [Display(Name = "Password")]
            
            public string Password { get; set; }

            [Display(Name = "Remember me?")]
            public bool RememberMe { get; set; }
        }

        public class RegisterModel
        {
            [Required]
            [Display(Name = "User name")]
            public string UserName { get; set; }

            [Required]
            [StringLength(255, ErrorMessage = "Пароль должен содержать не менее {2} символа.", MinimumLength = 3)]
            [DataType(DataType.Password)]
            [Display(Name = "Password")]
            public string Password { get; set; }

            [DataType(DataType.Password)]
            [Display(Name = "Confirm password")]
            [Compare("Password", ErrorMessage = "Пароли не совпадают.")]
            public string ConfirmPassword { get; set; }
        }

        public class ExternalLogin
        {
            public string Provider { get; set; }
            public string ProviderDisplayName { get; set; }
            public string ProviderUserId { get; set; }
        }
    }

