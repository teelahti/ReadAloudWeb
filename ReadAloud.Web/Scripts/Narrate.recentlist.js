(function () {
    var recent = document.getElementById("recent");
    
    function add(topic, data) {
        var value = data.trim().toLowerCase(),
            found = false;

        // check whether this text already is in recent texts
        for (var i = 0; i < recent.children.length; ++i) {
            if (recent.children[i].innerText.toLowerCase() === value) {
                found = true;
            }
        }
        
        if (!found) {
            if (recent.children.length > 4) {
                recent.removeChild(recent.children[4]);
            }

            var li = document.createElement("li");
            li.innerText = value;
            
            recent.insertBefore(li, recent.firstChild);
        }
    }
    
    function remove() {
        if (recent.children.length) {
            recent.removeChild(recent.firstChild);
        }
    }
    
    function onRecentClick(e) {
        var recentValue = e.target.innerText;

        if (recentValue) {
            pubsubz.publish("recent/selected", recentValue);
        }
    }

    recent.addEventListener("click", onRecentClick, false);
    
    pubsubz.subscribe("narrate/new", add);
    pubsubz.subscribe("navigation/back", remove);
}());