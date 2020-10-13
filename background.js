;(function() {

    const GOOGLE_URL = "https://console.cloud.google.com/";

    // Stores last redirected requestId
    let lastRequestId;

    // Indicates if onBeforeRequest listener is attached
    let listenerActive = false;

    // Stores extension options
    let options;

    // Register init
    chrome.runtime.onInstalled.addListener(init);

    /**
     * Helper to load options
     * @return {Promise<{enabled: boolean, userIndex: number|string}>}
     */
    function loadOptions() {
        return new Promise((resolve, reject) => {
            chrome.storage.sync.get({
                enabled: true,
                userIndex: 1,
            }, function(items) {
                resolve(items);
            });
        });
    }

    async function init() {

        options = await loadOptions();

        console.log("init", options);

        addOnBeforeRequestListener();

        // Listen for option changes
        chrome.storage.onChanged.addListener(function(changes, namespace) {
            for (const key in changes) {
                // Merge option updates into current options
                if (options.hasOwnProperty(key)) {
                    options[key] = changes[key].newValue;
                }

                // Add or remove listener if setting enabled has changed
                if (changes.hasOwnProperty("enabled")) {
                    if (options.enabled) {
                        addOnBeforeRequestListener();
                    } else {
                        removeOnBeforeRequestListener();
                    }
                }


            }
        });

    }

    // Adds onBeforeRequest listener only if not already active
    function addOnBeforeRequestListener() {
        // Prevent adding listener twice
        if (listenerActive) return;

        console.log("add onBeforeRequest listener");

        chrome.webRequest.onBeforeRequest.addListener(
            onBeforeRequest,
            {
                urls: ["<all_urls>"],
                types: ["main_frame"]
            },
            ["blocking"]
        );

        listenerActive = true;
    }

    // Removes onBeforeRequest listener
    function removeOnBeforeRequestListener() {

        console.log("remove onBeforeRequest listener");

        chrome.webRequest.onBeforeRequest.removeListener(onBeforeRequest);
        listenerActive = false;
    }

    // Actually listener which does the job
    function onBeforeRequest(details) {

        // If not enabled return
        if (!options.enabled) return;

        // If url is another than google cloud console return
        if (!details.url.startsWith(GOOGLE_URL)) return;

        // Only redirected user initiated requests (main_frame) because all
        // following (resource) requests will be relative to it
        if (details.type !== "main_frame") return;

        // Check if request was already handled
        if (details.requestId === lastRequestId) return;

        // Update last request id
        lastRequestId = details.requestId;

        // Parse url
        const url = new URL(details.url);

        // If query parameter was already set skip to prevent infinite loop
        if (parseInt(url.searchParams.get("authuser")) === parseInt(options.userIndex)) {
            return;
        }

        // Update authuser query param
        url.searchParams.set("authuser", options.userIndex);

        console.log("redirect to authuser", options.userIndex);

        // Return redirect
        return {redirectUrl: url.toString()};
    }

})();


