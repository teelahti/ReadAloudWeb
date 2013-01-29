namespace ReadAloud.Web.Controllers
{
    using System;
    using System.Web.Caching;
    using System.Web.Mvc;
    using System.Web.UI;

    public class ApiController : Controller
    {
        private const string GoogleTranslateBaseAddress = "http://translate.google.com/translate_tts?ie=UTF-8&tl=fi&q=";

        [OutputCache(VaryByParam = "*", Duration = 3600, Location = OutputCacheLocation.Client)]
        public FileContentResult Narrate(string text)
        {
            if (string.IsNullOrWhiteSpace(text))
            {
                throw new ArgumentNullException("text");
            }

            text = text.Trim();

            // Only allow short narrating
            if (text.Length > 50)
            {
                throw new ArgumentException("Given text is too length, please use sentences below 50 chars of length.", "text");
            }

            var cacheKey = "Narrated:" + text;
            var data = this.HttpContext.Cache[cacheKey] as byte[];

            if (data == null)
            {
                using (var client = new System.Net.WebClient())
                {
                    client.Headers.Add("user-agent", "Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.1; Trident/6.0)");
                    data = client.DownloadData(GoogleTranslateBaseAddress + this.Server.UrlEncode(text));
                    this.HttpContext.Cache.Add(
                        cacheKey,
                        data,
                        null,
                        Cache.NoAbsoluteExpiration,
                        TimeSpan.FromMinutes(5),
                        CacheItemPriority.Normal,
                        null);
                }
            }

            var result = new FileContentResult(data, "audio/mpeg");
            return result;
        }
    }
}
