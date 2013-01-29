namespace ReadAloud.Web.Controllers
{
    using System.Text.RegularExpressions;
    using System.Web.Mvc;

    public class HomeController : Controller
    {
        public ActionResult Index(string text)
        {
            // Simple validation for text, if invalid just skip
            string model = this.Server.UrlDecode(text) ?? string.Empty;

            if (model.Length > 50)
            {
                model = model.Substring(0, 50);
            }

            if (!Regex.IsMatch(model, @"[\w\s\!\?.,ÄäÖöÅå]+"))
            {
                model = string.Empty;
            }

            // Use slightly unconventional ASP.NET MVC syntax due to stripped 
            // down route format causing problems in View discovery.
            var viewData = new ViewDataDictionary<string> { Model = model };

            return new ViewResult
                {
                    ViewData = viewData,
                    ViewName = "Index"
                };
        }
    }
}
