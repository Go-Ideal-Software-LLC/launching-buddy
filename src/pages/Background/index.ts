import { MESSAGES, RESPONSES } from '../../utils/MESSAGES_CONST';

const navigateToProfile = (twitterDmText: string) => {
    const timeIntervalForNavigatingToProfile = setInterval(async () => {
        const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
        if (tab) {
            const response = await chrome.tabs.sendMessage(tab.id as number, { message: MESSAGES.NAVIGATE_TO_PROFILE_FOLLOWERS, twitterDmText });
            console.log('response:', response);
            if (response === RESPONSES.SUCCESSFULLY_NAVIGATED_TO_USER_PRODUCTHUNT_PROFILE) {
                clearInterval(timeIntervalForNavigatingToProfile);
                scrollDownAllFollowers();
            }
        }
    }, 3000);
}

const scrollDownAllFollowers = async () => {
    const timeOutForScrollingDownFollowersPage = setTimeout(async () => {
        const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
        if (tab) {
            const response = await chrome.tabs.sendMessage(tab.id as number, { message: MESSAGES.SCROLL_ALL_FOLLOWERS });
            clearTimeout(timeOutForScrollingDownFollowersPage);
            if (response === RESPONSES.SAVED_ALL_FOLLOWERS) {
                console.log('done scrolling all followers');
                navigateToFollowersProfiles();
            }
        }
    }, 3000);
}

const navigateToFollowersProfiles = async () => {
    const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
    if (tab) {
        const response = await chrome.tabs.sendMessage(tab.id as number, { message: MESSAGES.NAVIGATE_TO_FOLLOWERS_PROFILES });
        if (response === RESPONSES.NAVIGATED_TO_FOLLOWER_PRODUCTHUNT_PROFILE) {
            // console.log('in twitter profile!');
            navigateToFollowersTwitterProfile();
            // do the twitter messaging stuff
        } else if (response === RESPONSES.COMPLETED_ALL_FOLLOWERS) {
            console.log('Successfully messaged all followers!');
            completedMessagingAllFollowers();
        }
    }
}

const navigateToFollowersTwitterProfile = () => {
    const timeIntervalForSelectingProductHuntFollowersTwitterLink = setInterval(async () => {
        const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
        if (tab) {
            const response = await chrome.tabs.sendMessage(tab.id as number, { message: MESSAGES.NAVIGATE_TO_TWITTER_PROFILE });
            console.log('response:', response);
            if (response === RESPONSES.SUCCESSFULLY_NAVIGATED_TO_TWITTER_PROFILE) {
                clearInterval(timeIntervalForSelectingProductHuntFollowersTwitterLink);
                console.log('navigating to Twitter Profile');
                selectTwitterDMIcon();
            } else if (response === RESPONSES.NO_TWITTER_PROFILE_FOUND) {
                clearInterval(timeIntervalForSelectingProductHuntFollowersTwitterLink);
                console.log('no twitter profile found in Product Hunt Profile');
                navigateToFollowersProfiles();
            }
        }
    }, 3000);
}

const selectTwitterDMIcon = async () => {
    const timeIntervalForSelectingTwitterDMIcon = setInterval(async () => {
        const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
        if (tab) {
            const response = await chrome.tabs.sendMessage(tab.id as number, { message: MESSAGES.SELECT_TWITTER_DM_ICON });
            console.log('response:', response);
            if (response === RESPONSES.SUCCESSFULLY_SELECTED_TWITTER_DM_ICON) {
                clearInterval(timeIntervalForSelectingTwitterDMIcon);
                console.log('in twitter dms!');
                sendTwitterDM();
            } else if (response === RESPONSES.NO_TWITTER_DM_ICON_FOUND) {
                clearInterval(timeIntervalForSelectingTwitterDMIcon);
                console.log('no twitter dm icon found');
                // should navigate back to followers and increment ot the next one
                navigateToFollowersProfiles();
            }
        }
    }, 3000);
}

const sendTwitterDM = () => {
    const timeIntervalForSendingTwitterDM = setInterval(async () => {
        const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
        if (tab) {
            const response = await chrome.tabs.sendMessage(tab.id as number, { message: MESSAGES.SEND_TWITTER_DM });
            console.log('response:', response);
            if (response === RESPONSES.SENT_TWITTER_DM) {
                clearInterval(timeIntervalForSendingTwitterDM);
                console.log('sent twitter dm!');
                navigateToFollowersProfiles();
            }
        }
    }, 3000);
}

const completedMessagingAllFollowers = async () => {
    const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
    if (tab) {
        const response = await chrome.tabs.sendMessage(tab.id as number, { message: MESSAGES.SUCCESSFULLY_MESSAGED_ALL_PRODUCT_HUNT_FOLLOWERS });
        if (response === RESPONSES.NAVIGATED_TO_PRODUCT_HUNT) {
            displaySuccessfulCompletedDiv();
        }
    }
}

const displaySuccessfulCompletedDiv = async () => {
    const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
    if (tab) {
        const response = await chrome.tabs.sendMessage(tab.id as number, { message: MESSAGES.DISPLAY_SUCCESSFUL_COMPLETED_DIV });
    }
}


chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log('message:', message);
    if (message.message === MESSAGES.NAVIGATE_TO_PROFILE_SERVICE_WORKER) {
        navigateToProfile(message.twitterDmText);
    }
});
