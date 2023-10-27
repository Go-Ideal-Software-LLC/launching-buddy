import React, { useEffect, useState } from 'react';
import { MESSAGES } from '../../utils/MESSAGES_CONST';
import './Popup.css';

const Popup = () => {
  const [url, setUrl] = useState<string>("");

  const navigateToProductHunt = async () => {
    // console.log('window.location.href:', window.location.href);
    // return window.location.href.includes("producthunt.com");
    await chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      let currentTabId = tabs[0].id as number;
      chrome.tabs.update(currentTabId, { url: "https://www.producthunt.com" });
      chrome.tabs.onUpdated.addListener(function listener(tabId, info) {
        if (info.status === 'complete' && tabId === currentTabId) {
          chrome.tabs.onUpdated.removeListener(listener);
          navigateToProfile();
        }
      });
    });
  }

  const scrollDownAllFollowers = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      let currentTabId = tabs[0].id as number;
      chrome.tabs.sendMessage(currentTabId, { message: MESSAGES.SCROLL_ALL_FOLLOWERS });
      //   chrome.tabs.onUpdated.addListener(function listener(tabId, info) {
      //     if (info.status === 'complete' && tabId === currentTabId) {
      //       chrome.tabs.onUpdated.removeListener(listener);
      //       scrollDownAllFollowers();
      //     }
      //   });
    });
  }

  // const navigateToFollowers = () => {
  //   chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
  //     let currentTabId = tabs[0].id as number;
  //     chrome.tabs.sendMessage(currentTabId, { message: MESSAGES.NAVIGATE_TO_FOLLOWERS });
  //     chrome.tabs.onUpdated.addListener(function listener(tabId, info) {
  //       if (info.status === 'complete' && tabId === currentTabId) {
  //         chrome.tabs.onUpdated.removeListener(listener);
  //         scrollDownAllFollowers();
  //       }
  //     });
  //   });
  // }

  const navigateToProfile = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      let currentTabId = tabs[0].id as number;
      chrome.tabs.sendMessage(currentTabId, { message: MESSAGES.NAVIGATE_TO_PROFILE });
      chrome.tabs.onUpdated.addListener(function listener(tabId, info) {
        if (info.status === 'complete' && tabId === currentTabId) {
          chrome.tabs.onUpdated.removeListener(listener);
          scrollDownAllFollowers();
        }
      });
    });
  }

  return (
    <div className="launch-buddy-popup-container">
      {/* <img src={logo} className="launch-buddy-popup-logo" alt="logo" />
      <Greetings /> */}
      <button onClick={(event) => navigateToProductHunt()}>Navigate to Product Hunt</button>
      {/* <button onClick={(event) => startMessagingFollowers}>Start Messaging Followerss</button> */}

    </div>
  );
};

export default Popup;
