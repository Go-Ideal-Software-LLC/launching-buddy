import { MESSAGES, RESPONSES, STORAGE_KEYS } from '../../utils/MESSAGES_CONST';

console.log('Content script loaded');


type FollowerProfile = {
    profileURL: string;
    name: string;
}

const getCurrentFollowerName = async () => {
    const followers = await chrome.storage.local.get([STORAGE_KEYS.PRODUCT_HUNT_FOLLOWERS]);
    const currentFollowerIndex = await chrome.storage.local.get([STORAGE_KEYS.PRODUCT_HUNT_CURRENT_FOLLOWER_INDEX]);
    const index = currentFollowerIndex[STORAGE_KEYS.PRODUCT_HUNT_CURRENT_FOLLOWER_INDEX];
    const currentFollower = followers[STORAGE_KEYS.PRODUCT_HUNT_FOLLOWERS][index] as FollowerProfile;
    return currentFollower.name
}

const navigateToFollowerProfile = async (sendResponse: (response?: any) => void) => {
    const followers = await chrome.storage.local.get([STORAGE_KEYS.PRODUCT_HUNT_FOLLOWERS]);
    const currentFollowerIndex = await chrome.storage.local.get([STORAGE_KEYS.PRODUCT_HUNT_CURRENT_FOLLOWER_INDEX]);
    let currentFollowerIndexNum = 0;
    console.log('currentFollowerIndex:', currentFollowerIndex);
    if (currentFollowerIndex[STORAGE_KEYS.PRODUCT_HUNT_CURRENT_FOLLOWER_INDEX] === undefined) {
        await chrome.storage.local.set({ [STORAGE_KEYS.PRODUCT_HUNT_CURRENT_FOLLOWER_INDEX]: currentFollowerIndexNum });
    } else {
        currentFollowerIndexNum = currentFollowerIndex[STORAGE_KEYS.PRODUCT_HUNT_CURRENT_FOLLOWER_INDEX] + 1;
        await chrome.storage.local.set({ [STORAGE_KEYS.PRODUCT_HUNT_CURRENT_FOLLOWER_INDEX]: currentFollowerIndexNum });
    }
    const allFollowersProfiles = followers[STORAGE_KEYS.PRODUCT_HUNT_FOLLOWERS] as FollowerProfile[];
    const followerToMessage = allFollowersProfiles[currentFollowerIndexNum];
    console.log('followerToMessage:', followerToMessage);
    if (followerToMessage) {
        sendResponse(RESPONSES.NAVIGATED_TO_FOLLOWER_PRODUCTHUNT_PROFILE);
        window.location.href = followerToMessage.profileURL;
    } else {
        sendResponse(RESPONSES.COMPLETED_ALL_FOLLOWERS);
    }
}

const navigateToTwitterProfile = (sendResponse: (response?: any) => void) => {
    const twitterProfileURLAnchorTag = document.querySelector('a[href*="twitter.com"], a[href*="x.com"]') as HTMLAnchorElement;
    if (twitterProfileURLAnchorTag) {
        sendResponse(RESPONSES.SUCCESSFULLY_NAVIGATED_TO_TWITTER_PROFILE);
        window.location.href = twitterProfileURLAnchorTag.href; // do the twitter messaging stuff
    } else {
        sendResponse(RESPONSES.NO_TWITTER_PROFILE_FOUND);
        // no twitter profile move on to the next follower
    }
}

const selectTwitterDMIcon = (sendResponse: (response?: any) => void) => {
    // we probably need to add some sort of onPage load listener here
    const twitterDMIcon = document.querySelector('[data-testid="sendDMFromProfile"]') as HTMLAnchorElement;
    if (twitterDMIcon) {
        twitterDMIcon.click();
        sendResponse(RESPONSES.SUCCESSFULLY_SELECTED_TWITTER_DM_ICON);
    } else {
        sendResponse(RESPONSES.NO_TWITTER_DM_ICON_FOUND);
    }
}

const selectTwitterDMTextInput = async (sendResponse: (response?: any) => void) => {
    const twitterDMTextStorage = await chrome.storage.local.get([STORAGE_KEYS.TWITTER_DM_TEXT]);
    const twitterDMText = twitterDMTextStorage[STORAGE_KEYS.TWITTER_DM_TEXT] as string;
    const rootDiv = document.querySelector(
        ".public-DraftEditorPlaceholder-inner"
    );
    const sendButton = document.querySelector('[data-testid="dmComposerSendButton"]') as HTMLButtonElement;
    // Simulate a click event on the element
    var event = new MouseEvent("click", {
        bubbles: true,
        cancelable: true,
        view: window,
    });
    const currentFollowerName = await getCurrentFollowerName();
    let twitterDM = twitterDMText.replace(/{{FIRST_NAME}}/g, currentFollowerName);
    twitterDM = twitterDM.replace(/\n/g, '<br>');
    rootDiv?.dispatchEvent(event);
    document.execCommand("insertHTML", false, twitterDM);
    sendButton.click();
    sendResponse(RESPONSES.SENT_TWITTER_DM);
}

const navigateToProductHunt = (sendResponse: (response?: any) => void) => {
    sendResponse(RESPONSES.NAVIGATED_TO_PRODUCT_HUNT);
    window.location.href = "https://www.producthunt.com";
}

const displaySuccessfulCompletedDiv = () => {
    let div = document.createElement('div');

    // Set the div's style properties
    div.style.position = 'fixed';
    div.style.top = '0';
    div.style.left = '0';
    div.style.width = '100vw';
    div.style.height = '100vh';
    div.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    div.style.color = 'green';
    div.style.display = 'flex';
    div.style.justifyContent = 'center';
    div.style.alignItems = 'center';
    div.style.zIndex = '1000';

    // Set the div's text
    div.textContent = 'Successfully messaged all followers';

    // Append the div to the body
    document.body.appendChild(div);
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.message === MESSAGES.NAVIGATE_TO_PROFILE_FOLLOWERS) {
        console.log('Content script is trying to navigate to the profile');
        const selectedProfilePicture = document.querySelector('#__next > div.styles_header__8GQde.flex.direction-row.flex-row-gap-5.flex-row-gap-mobile-undefined.flex-row-gap-widescreen-8.py-5.px-mobile-5.px-desktop-5.px-widescreen-8.px-tablet-5.align-center.bg-white > div.styles_hideOnSearch__QXQwf.flex.direction-row.flex-row-gap-5.flex-row-gap-mobile-undefined.flex-row-gap-widescreen-8.align-center > div:nth-child(3) > div:nth-child(1) > a') as HTMLAnchorElement;
        if (selectedProfilePicture) {
            // reset the follower index
            chrome.storage.local.set({ [STORAGE_KEYS.PRODUCT_HUNT_CURRENT_FOLLOWER_INDEX]: 0 });
            chrome.storage.local.set({ [STORAGE_KEYS.TWITTER_DM_TEXT]: message.twitterDmText });
            const followerLink = selectedProfilePicture.href + '/followers';
            sendResponse(RESPONSES.SUCCESSFULLY_NAVIGATED_TO_USER_PRODUCTHUNT_PROFILE);
            window.location.href = followerLink;
        }
    } else if (message.message === MESSAGES.SCROLL_ALL_FOLLOWERS) {
        console.log('Content script is scrolling down the page');
        const xpathForFollowerContainerDiv = '//*[@id="__next"]/div[3]/main/div[1]/div[2]';
        let lastFollowerCount = -1;
        let currentFollowerCount = 0;
        // Wait for more content to load (if any), then scroll again
        const scrollToEndOfFollowersInterval = setInterval(() => {
            const divContainingFollowerDivs = document.evaluate(xpathForFollowerContainerDiv, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
            const followerContainerDiv = divContainingFollowerDivs.singleNodeValue as HTMLElement;
            // Check if new content has loaded by comparing scroll heights
            lastFollowerCount = currentFollowerCount;
            currentFollowerCount = followerContainerDiv.childElementCount;
            if (lastFollowerCount !== currentFollowerCount) {
                window.scrollTo(0, document.body.scrollHeight);
            } else {
                const allFollowersProfiles: FollowerProfile[] = [];
                clearInterval(scrollToEndOfFollowersInterval);
                followerContainerDiv.childNodes.forEach((childNode) => {
                    const followerDiv = childNode as HTMLElement;
                    const profileAnchor = followerDiv.querySelector('div:nth-child(2) > a') as HTMLAnchorElement;
                    const divWithName = profileAnchor.childNodes[0].textContent as string;
                    allFollowersProfiles.push({
                        profileURL: profileAnchor.href,
                        name: divWithName.trim().split(' ')[0]
                    });
                });
                chrome.storage.local.set({ [STORAGE_KEYS.PRODUCT_HUNT_FOLLOWERS]: allFollowersProfiles });
                sendResponse(RESPONSES.SAVED_ALL_FOLLOWERS);
            }
        }, 3000);
    } else if (message.message === MESSAGES.NAVIGATE_TO_FOLLOWERS_PROFILES) {
        navigateToFollowerProfile(sendResponse);
    } else if (message.message === MESSAGES.NAVIGATE_TO_TWITTER_PROFILE) {
        navigateToTwitterProfile(sendResponse);
    } else if (message.message === MESSAGES.SELECT_TWITTER_DM_ICON) {
        selectTwitterDMIcon(sendResponse);
    } else if (message.message === MESSAGES.SEND_TWITTER_DM) {
        selectTwitterDMTextInput(sendResponse);
    } else if (message.message === MESSAGES.SUCCESSFULLY_MESSAGED_ALL_PRODUCT_HUNT_FOLLOWERS) {
        navigateToProductHunt(sendResponse);
    } else if (message.message = MESSAGES.DISPLAY_SUCCESSFUL_COMPLETED_DIV) {
        displaySuccessfulCompletedDiv();
    }
    return true;
}
);
