(function () {
    var input = $("#inputText"),
        audioWrapper = $("#audio"),
        audio = audioWrapper.get(0),
        form = $("#dummy"),
        reset = $("#reset"),
        urlBase = audioWrapper.data("api-url") + "?text=",
        progress = document.getElementById("progress"),
        buttons = $("button");

    function narrate(text) {
        var a = audio;

        // Stop previous if playing. Setting src to empty is a browser 
        // hack to stop loading content.
        a.pause();
        a.src = "";

        // Set new content and play
        a.src = urlBase + encodeURIComponent(text);
        a.play();
    }
    
    function narrateHandler(e) {
        var value = $.trim(input.val());
        e.preventDefault();
        
        pubsubz.publish("narrate/new", value);

        narrate(value);
    }

    function updateProgress() {
        var value = 0;
        if (audio.currentTime > 0) {
            value = Math.floor((100 / audio.duration) * audio.currentTime);
        }

        progress.style.width = value + "%";
    }

    function onAudioStart() {
        // Disable input field and buttons
        buttons.add(input).attr("disabled", "disabled");
    }

    function onAudioEnd() {
        // Enable buttons
        buttons.add(input).removeAttr("disabled");

        // Hide progress bar after delay
        setTimeout(function () {
            progress.style.width = "0%";
        }, 500);
        
        // Focus input field if browser lost it when "sending" the form
        input.focus();
    }

    // Whenever audio is playing display progress bar 
    audio.addEventListener("timeupdate", updateProgress, false);

    // On audio start and stop enable and disable elements
    audio.addEventListener("play", onAudioStart, false);
    audio.addEventListener("ended", onAudioEnd, false);

    form.submit(narrateHandler);

    // TODO: Bind esc to reset (if possible)
    reset.click(function () {
        input.focus();
    });
    
    // On first load read text aloud if there is any (comes from URI)
    if (input.val()) {
        narrate(input.val());
    }
    
    // Bind navigation handlers
    function narrateGiven(topic, text, publish) {
        if (text) {
            input.val(text);
            narrate(text);
            
            if(publish) {
                pubsubz.publish("narrate/new", text);
            }
        }
    }

    // Going back do not add entry to history stack as it is there already
    pubsubz.subscribe("navigation/back", narrateGiven);
    
    // Going forward add entry again to stack
    pubsubz.subscribe("navigation/forward", function (topic, text) {
        narrateGiven(topic, text, true);
    });
    
    // Selecting existing should not add entry to stack
    pubsubz.subscribe("recent/selected", narrateGiven);
} ());