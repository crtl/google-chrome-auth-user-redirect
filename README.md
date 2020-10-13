# Google Cloud Auth User Redirect

A simple extension to help you browsing `https://console.cloud.google.com/*` pages when using multiple google accounts.
Just set the `User Index` option to your (1-based) account index inside the google cloud console dashboard.

## How to use

1. Download the code and follow steps in [https://developer.chrome.com/extensions/getstarted#manifest](https://developer.chrome.com/extensions/getstarted#manifest) 
2. Enable the extension and go to options to set your desired `authuser` parameter.

## How to find `authuser`
To find out your index make sure the extension is disabled and read the `authuser` query parameter of the `https://console.cloud.google.com` url.

So when Im logged in with 2 users:
- Alex
- Paul

Alex' account is used by default, when setting your userIndex to 2, Paul will now be used instead.
