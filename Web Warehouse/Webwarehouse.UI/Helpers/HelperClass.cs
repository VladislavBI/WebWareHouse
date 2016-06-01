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
        /// <param name="text">Text of footer</param>
        /// <returns>Html code for footer.</returns>
        public static MvcHtmlString CreateFooter
            (this HtmlHelper helper, string text)
        {
            //Creating <footer> with attribute - id.
            TagBuilder tagMain = new TagBuilder("footer");
            tagMain.MergeAttribute("id", "site-footer");

            //Adding <p> - container for text, some height for footer.
            TagBuilder tagLvl2 = new TagBuilder("p");
            tagLvl2.SetInnerText(text);

            //Input <p> into <footer>
            tagMain.InnerHtml += tagLvl2;

            return new MvcHtmlString(tagMain.ToString());
        }

        /// <summary>
        /// Adding logo to page
        /// </summary>
        /// <param name="helper">Extension's method parameter</param>
        /// <param name="text">Text of header</param>
        /// <returns>Html code for header.</returns>
        public static MvcHtmlString CreateLogo
            (this HtmlHelper helper, string text)
        {

            //Adding <div> floater - with attribute class="float-left".
            TagBuilder tagMain = new TagBuilder("div");
            tagMain.MergeAttribute("class", "float-left");


            //Adding <p> -reference for futher functions with class="site-title".
            TagBuilder tagLvl2 = new TagBuilder("p");
            tagLvl2.MergeAttribute("class", "site-title");


            //Adding <a> - container for logo refering to main page.
            TagBuilder tagLvl3 = new TagBuilder("a");
            tagLvl3.MergeAttribute("href", @"/");
            tagLvl3.SetInnerText(text);

            //Creating tag hierarchy.
            tagLvl2.InnerHtml += tagLvl3;
            tagMain.InnerHtml += tagLvl2;
           
            
            

            return new MvcHtmlString(tagMain.ToString());
        }
    }
}