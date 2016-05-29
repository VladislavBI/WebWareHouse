using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Webwarehouse.Model.Abstract;
using Webwarehouse.Model.Concrete;
using Webwarehouse.Model.Entities;

namespace Webwarehouse.UI.Controllers
{
    public class HomeController : Controller
    {
        /// <summary>
        /// Body for main view, check if userid session field is null 
        /// </summary>
        /// <returns></returns>
        public ActionResult Index()
        {
            //Check if user id is null
            if(Session["UserId"]==null)
            {
                    string s = User.Identity.Name;
                    using(WarehouseContext cont=new WarehouseContext())
	                {
                        //Getting user id by user name
                       Session["UserId"]=cont.UserProfiles.FirstOrDefault(x=>x.UserName==s).UserId;
	                }
            }
            return View();
        }

        
    }
}
