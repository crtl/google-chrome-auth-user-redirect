

const inputUserIndex = document.getElementById("input-user-index");
const inputEnabled = document.getElementById("input-enabled");
const btnSubmit = document.getElementById("submit");

const status = document.getElementById("status");

// Saves options to chrome.storage
function save_options() {
    const enabled = inputEnabled.checked;
    const userIndex = inputUserIndex.value;
    chrome.storage.sync.set({
        enabled,
        userIndex,
    }, function() {
        // Update status to let user know options were saved.
        status.innerHTML = "<p id='status-message'>Options saved.</p>";

        setTimeout(function() {
            status.innerHTML = '';
        }, 1500);
    });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
    // Use default value color = 'red' and likesColor = true.
    chrome.storage.sync.get({
        enabled: true,
        userIndex: 1,
    }, function(items) {
        inputEnabled.checked = items.enabled;
        inputUserIndex.value = items.userIndex;
    });
}

document.addEventListener('DOMContentLoaded', restore_options);

btnSubmit.addEventListener('click', save_options);
