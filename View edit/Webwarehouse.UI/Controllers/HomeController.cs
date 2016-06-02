using System.Linq;
using System.Web.Mvc;
using Webwarehouse.UI.Models.Abstract;
using Webwarehouse.UI.Models.Concrete;
using Webwarehouse.UI.Models.Entities;

namespace Webwarehouse.UI.Controllers
{
    public class HomeController : Controller
    {
        public HomeController()
        {}

        /// <summary>
        ///  Body for main view, check if userid session field is null.
        /// </summary>
        /// <returns></returns>
        public ActionResult Index()
        {
            //Check if user id is null
            if (Session["UserId"] == null)
            {
                var s = User.Identity.Name;
                using (var cont = new WarehouseContext())
                {
                    //Getting user id by user name
                    var firstOrDefault = cont.UserProfiles.FirstOrDefault(x => x.UserName == s);
                    if (firstOrDefault != null)
                        Session["UserId"] = firstOrDefault.UserId;

                }
            }
            return View();
        }


    }
}