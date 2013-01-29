(function () {
    var recent = $("#recent");
    
    function add(topic, data) {
        var value = $.trim(data),
            found = false;

        // check whether this text already is in recent texts
        recent.find("li").each(function () {
            if ($(this).text() === value) {
                found = true;
            }
        });

        if (!found) {
            if (recent.children().length > 4) {
                recent.find("li:last-child").remove();
            }

            recent.prepend($("<li>").html(value));
        }
    }
    
    function remove() {
        recent.find("li:first").remove();
    }
    
    function onRecentClick(e) {
        var recentValue = $.trim($(e.target).html());

        if (recentValue) {
            pubsubz.publish("recent/selected", recentValue);
        }
    }

    recent.on("click", onRecentClick);
    
    pubsubz.subscribe("narrate/new", add);
    pubsubz.subscribe("navigation/back", remove);
}());