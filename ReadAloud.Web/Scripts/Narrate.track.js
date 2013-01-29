(function () {
    function track(category, action) {
        if (typeof _gaq === "undefined") {
            console.log("Analytics not configured, skipping tracking for", category, action);
            return;
        }

        _gaq.push(['_trackEvent', category, action]);
    }

    pubsubz.subscribe("narrate/new", track.bind(this, "Text", "Play"));
    pubsubz.subscribe("navigation/back", track.bind(this, "Navigation", "Back"));
    pubsubz.subscribe("navigation/forward", track.bind(this, "Navigation", "Forward"));
}());