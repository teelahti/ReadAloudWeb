namespace ReadAloud.Web
{
    using System.Web;
    using System.Web.Mvc;
    using System.Web.Optimization;
    using System.Web.Routing;

    public class MvcApplication : HttpApplication
    {
        private static void RegisterGlobalFilters(GlobalFilterCollection filters)
        {
            filters.Add(new HandleErrorAttribute());
        }

        private static void RegisterRoutes(RouteCollection routes)
        {
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");

            routes.MapRoute(
                "Api",
                "Api/{action}/{id}",
                new { controller = "Api", id = UrlParameter.Optional });

            routes.MapRoute(
                "Default", 
                "{*text}", 
                new { controller = "Home", action = "Index", text = UrlParameter.Optional });
        }

        private static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/narrate")
                .Include("~/Scripts/polyfills.js")
                .Include("~/Scripts/pubsubz.js")
                .Include("~/Scripts/Narrate.js")
                .Include("~/Scripts/Narrate.history.js")
                .Include("~/Scripts/Narrate.recentlist.js")
                .Include("~/Scripts/Narrate.track.js")
            );

            bundles.Add(new StyleBundle("~/content/css")
                .Include("~/Content/site.css")
                .Include("~/Content/button.css")
            );
        }

        protected void Application_Start()
        {
            MvcHandler.DisableMvcResponseHeader = true; 
            ViewEngines.Engines.Clear();
            ViewEngines.Engines.Add(new RazorViewEngine());
            AreaRegistration.RegisterAllAreas();
            
            RegisterGlobalFilters(GlobalFilters.Filters);
            RegisterRoutes(RouteTable.Routes);
            RegisterBundles(BundleTable.Bundles);
        }
    }
}