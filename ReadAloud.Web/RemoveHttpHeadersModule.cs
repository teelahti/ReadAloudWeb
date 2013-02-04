namespace ReadAloud.Web
{
    using System;
    using System.Collections.Generic;
    using System.Web;

    /// <summary>
    /// Custom HTTP Module for removing some unnecessary HTTP headers. Some of the 
    /// headers may be removed via web.config, but some - like IIS added 
    /// Server header - cannot.
    /// <para>
    /// Register in web.config modules section:
    /// &lt;add 
    ///      name="RemoveHttpHeadersModule" 
    ///      type="ReadAloud.Web.RemoveHttpHeadersModule, ReadAloud.Web.Infrastructure" /&gt;
    /// </para>
    /// </summary>
    public class RemoveHttpHeadersModule : IHttpModule
    {
        /// <summary>
        /// List of Headers to remove
        /// </summary>
        private readonly List<string> headersToRemove;

        /// <summary>
        /// Initializes a new instance of the <see cref="RemoveHttpHeadersModule"/> class.
        /// </summary>
        public RemoveHttpHeadersModule()
        {
            // Some of these are already removed in config
            this.headersToRemove = new List<string>
                                    {
                                            "Server",
                                            "X-AspNet-Version",
                                            "X-AspNetMvc-Version",
                                            "X-Powered-By"
                                    };
        }

        /// <summary>
        /// Dispose the Custom HttpModule.
        /// </summary>
        public void Dispose()
        {
        }

        /// <summary>
        /// Handles the current request.
        /// </summary>
        /// <param name="context">
        /// The HttpApplication context.
        /// </param>
        public void Init(HttpApplication context)
        {
            context.PreSendRequestHeaders += this.OnPreSendRequestHeaders;
        }

        /// <summary>
        /// Remove all headers from the HTTP Response.
        /// </summary>
        /// <param name="sender">
        /// The object raising the event
        /// </param>
        /// <param name="e">
        /// The event data.
        /// </param>
        private void OnPreSendRequestHeaders(object sender, EventArgs e)
        {
            this.headersToRemove.ForEach(
                h => HttpContext.Current.Response.Headers.Remove(h));
        }
    }
}