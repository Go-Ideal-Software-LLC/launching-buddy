import { printLine } from './modules/print';
import { MESSAGES } from '../../utils/MESSAGES_CONST';

console.log('Content script works!');
console.log('Must reload extension for modifications to take effect.');

printLine("Using the 'printLine' function from the Print Module");

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.message === MESSAGES.NAVIGATE_TO_PROFILE) {
        const timeoutForNavigatingToProfile = setTimeout(() => {
            console.log('Content script is starting to message followers');
            sendResponse('Content script received message and is starting to message followers');
            const selectedProfilePicture = document.querySelector('#__next > div.styles_header__8GQde.flex.direction-row.flex-row-gap-5.flex-row-gap-mobile-undefined.flex-row-gap-widescreen-8.py-5.px-mobile-5.px-desktop-5.px-widescreen-8.px-tablet-5.align-center.bg-white > div.styles_hideOnSearch__QXQwf.flex.direction-row.flex-row-gap-5.flex-row-gap-mobile-undefined.flex-row-gap-widescreen-8.align-center > div:nth-child(3) > div:nth-child(1) > a') as HTMLAnchorElement;
            if (selectedProfilePicture) {
                const followerLink = selectedProfilePicture.href + '/followers'
                window.location.href = followerLink;
            }
            clearTimeout(timeoutForNavigatingToProfile);
        }, 3000);
    }
    // if (message.message === MESSAGES.NAVIGATE_TO_FOLLOWERS) {
    //     console.log('Content script is navigating to followers');
    //     const xpath = '//*[@id="__next"]/div[2]/div/header/div[1]/div/div/header/div/div[2]/div[2]/div/a[1]';
    //     const result = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
    //     const element = result.singleNodeValue as HTMLElement;
    //     console.log('element:', element);
    //     if (element) {
    //         element.click();
    //     }
    // }
    if (message.message === MESSAGES.SCROLL_ALL_FOLLOWERS) {
        // write javascript to keep scrolling down a dynamic page
        // until all followers are loaded
        console.log('Content script is scrolling down the page');
        const xpathForFollowerContainerDiv = '//*[@id="__next"]/div[3]/main/div[1]/div[2]';


        sendResponse('Content script received message and is scrolling down the page');
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
                // store all followers in storage here
                console.log('Reached the end of the page');
                clearInterval(scrollToEndOfFollowersInterval);
                followerContainerDiv.childNodes.forEach((childNode) => {
                    const followerDiv = childNode as HTMLElement;
                    const profileAnchor = followerDiv.querySelector('div:nth-child(2) > a') as HTMLAnchorElement;
                    console.log('profileURL:', profileAnchor);
                    console.log('profileURL: ', profileAnchor.href);
                    const divWithName = profileAnchor.childNodes[0].textContent as string;
                    console.log('divWithName:', divWithName.trim().split(' ')[0]);
                });
            }
        }, 3000);
    }
}
);
