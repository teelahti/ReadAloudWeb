(function () {
    var current = 0;

    function supportsHistory() {
        return !!(window.history && history.pushState);
    }

    function pushHistory(topic, data) {
        if (!supportsHistory()) {
            console.log("History not supported, skipping", data);
            return;
        }

        // Add only if state is different. Important since 
        // forward navigation adds history
        if (history.state && data === history.state.text) {
            return;
        }

        current++;
        history.pushState({ id: current, text : data }, data, encodeURIComponent(data).toLowerCase());
    }

    pubsubz.subscribe("narrate/new", pushHistory);

    // publish history pop
    window.addEventListener("popstate", function (event) {
        if (!event.state) {
            return;
        }

        if (event.state.id <= current) {
            pubsubz.publish("navigation/back", event.state.text);
        }
        else {
            pubsubz.publish("navigation/forward", event.state.text);
        }

        current = event.state.id;
    });
}());