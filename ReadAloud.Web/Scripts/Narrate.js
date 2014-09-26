(function () {
    var id = function (s) { return document.getElementById(s); },
        input = id("inputText"),
        audio = id("audio"),
        form = id("dummy"),
        
        // dataset is not supported in IE, using getAttribute instead
        urlBase = audio.getAttribute("data-api-url") + "?text=",
        progress = id("progress"),
        buttons = document.querySelectorAll("button");

    function focusInput() {
        // Focus input field if browser lost it when "sending" the form
        if (input !== document.activeElement && input.focus) {
            try {
                input.focus();
            } catch (e) {
                console.log("Focus not supported", e);
            }
        }
    }

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
        var value = input.value.trim();

        e.preventDefault();

        if (value) {    
            pubsubz.publish("narrate/new", value);
            narrate(value);
        }
    }

    function updateProgress() {
        var value = 0;
        if (audio.currentTime > 0) {
            value = Math.floor((100 / audio.duration) * audio.currentTime);
        }

        progress.style.width = value + "%";
    }

    function toggleElementsWhileNarrating(disabled) {
        input.disabled = disabled;
        for (var i = 0; i < buttons.length; ++i) {
            buttons[i].disabled = disabled;
        }
    }

    function onAudioStart() {
        toggleElementsWhileNarrating(true);
    }

    function onAudioEnd() {
        // Enable buttons
        toggleElementsWhileNarrating(false);

        // Hide progress bar after delay
        setTimeout(function () {
            progress.style.width = "0%";
        }, 500);

        focusInput();
    }
    
    function onFormReset(e) {
        // Act on keyboard ESC and on generic form reset event
        if (e.type === "reset" || e.keyCode == 27) {
            input.value = "";
            focusInput();
        }
    }

    // Whenever audio is playing display progress bar 
    audio.addEventListener("timeupdate", updateProgress, false);

    // On audio start and stop enable and disable elements
    audio.addEventListener("play", onAudioStart, false);
    audio.addEventListener("ended", onAudioEnd, false);

    form.addEventListener("submit", narrateHandler, false);

    // Clear form on ESC key
    window.addEventListener("keyup", onFormReset, false);
    form.addEventListener("reset", onFormReset, false);
    
    // On first load read text aloud if there is any (comes from URI)
    if (input.value) {
        narrate(input.value);
    }
    
    // Bind navigation handlers
    function narrateGiven(topic, text, publish) {
        if (text) {
            input.value = text;
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