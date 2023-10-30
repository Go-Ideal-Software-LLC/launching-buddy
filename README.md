<img src="src/assets/img/launching-buddy-logo-128.png" width="64"/>

# Launching Buddy is a Chrome Extension that automatically messages all of your Product Hunt followers Twitter accounts via Twitter DM

<!-- [![npm](https://img.shields.io/npm/v/chrome-extension-boilerplate-react)](https://www.npmjs.com/package/chrome-extension-boilerplate-react)
[![npm-download](https://img.shields.io/npm/dw/chrome-extension-boilerplate-react)](https://www.npmjs.com/package/chrome-extension-boilerplate-react)
[![npm](https://img.shields.io/npm/dm/chrome-extension-boilerplate-react)](https://www.npmjs.com/package/chrome-extension-boilerplate-react) -->

- When updating the backend service worker you have to bump the version or you have to reinstall the add-on locally for the changes to take effect.

## Features

This is a basic Chrome Extension that was created to help avid users of Product Hunt to effortlessly take advantage of their following when launching a new product.

- All actions are performed automatically via the UI to mimmic human behavior and avoid spam detection (0 API calls are performed)
- First Name Placeholder i.e. {{FIRST_NAME}} will be replaced by the first name of the user's respective follower's Product Hunt account.
- Rich text formatting for proper spacing for your Twitter DM
- Automatic end to end flow
- Currently only runs in the active Chrome Tab so you can't do anything else while it runs but this can changed easily
- Straightforward process, insert a Twitter DM Message and click the start button, thats it!

Please open up an issue to nudge me to keep the npm packages up-to-date. FYI, it takes time to make different packages with different versions work together nicely.

## Installing and Running

### Procedures:

1. Check if your [Node.js](https://nodejs.org/) version is >= **18**.
2. Clone this repository.
3. Change the package's `name`, `description`, and `repository` fields in `package.json`.
4. Change the name of your extension on `src/manifest.json`.
5. Run `npm install` to install the dependencies.
6. Run `npm start`
7. Load your extension on Chrome following:
   1. Access `chrome://extensions/`
   2. Check `Developer mode`
   3. Click on `Load unpacked extension`
   4. Select the `build` folder.
8. Happy hacking.

## Structure

All your extension's code must be placed in the `src` folder.

The repo has a popup, a background service worker, and a content script.

## TypeScript

Built with TypeScript!


## Potential Future work

- Maybe include LinkedIn messaging from Product Hunt profiles
- Add a Twitter only Follower DM feature
- Modify the extension to run in a non-active Chrome tab

---

Launching Buddy | [Website](https://launchingbuddy.com)
