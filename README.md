# ReadAloudWeb
## A simple web site for kids learning to read and write

This web site uses [Google translate](http://translate.google.com/) to narrate given input text.
It shows list of narrated texts, and if browser supports history.pushState has back/forward navigation between words built in.

The code in this repository is hosted at [lue.teelahti.fi](http://lue.teelahti.fi). The easiest way to host a new version for your desired language (see language support below) is to fork, make the necessary configuration changes, and push to [Windows Azure web sites](http://www.windowsazure.com/en-us/home/scenarios/web-sites/).

## Supported languages

Currently this site is fixed to narrate Finnish. Language is in purpose not taken from browser accept-language header, as the main use case is to support only one language per deployment in order to things being as easy as possible for children.

Google translate API [supports lots of other languages](http://support.google.com/translate).

To change the language there are currently two places you must alter: Constant GoogleTranslateBaseAddress at class ApiController, and the texts at Home/Index.cshtml page.

## Analytics

If you wish to track usage of your deployed site, add the URL to Google analytics and then add the key to web.config:

    <add key="GoogleAnalyticsKey" value="UA-11111111-1"/>

## Note on support

Speech functions for Google translate API are not officially supported by Google and therefore might cease to work at any point of time.

----------------
Update 20.4.2015: Someone has made the same completely in browser, [this is the way forward](http://blog.monotonous.org/2015/04/14/reintroducing-espeak-js/). Browser support is not there (yet), but will be in a year or two. 
