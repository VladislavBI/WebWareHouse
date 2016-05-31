using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Webwarehouse.UI.Helpers
{
    /// <summary>
    /// Adding custom HtmlHelpers (Extension methods).
    /// </summary>
    public static class HelperClass
    {
        /// <summary>
        /// Adding footer to page
        /// </summary>
        /// <param name="helper">Extension's method parameter</param>
        /// <param name="text">text of footer</param>
        /// <returns></returns>
        public static MvcHtmlString CreateFooter
            (this HtmlHelper html, string text)
        {
            //creating footer tag with attribute - id
            TagBuilder tempTagMain = new TagBuilder("footer");
            tempTagMain.MergeAttribute("id", "site-footer");

            //adding p attribute - container for text, some hieght for footer
            TagBuilder tempTagLvl2 = new TagBuilder("p");
            tempTagLvl2.SetInnerText(text);

            //input p into footer
            tempTagMain.InnerHtml += tempTagLvl2;
            return new MvcHtmlString(tempTagMain.ToString());
        }
    }
}