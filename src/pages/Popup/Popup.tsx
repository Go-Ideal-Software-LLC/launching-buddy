import React, { ChangeEvent, useEffect, useState } from 'react';
import logo from '../../assets/img/launching-buddy-logo.png';
import { MESSAGES, STORAGE_KEYS } from '../../utils/MESSAGES_CONST';
import './Popup.css';

const Popup = () => {
  const [twitterDMMessage, setTwitterDMMessage] = useState<string>("");

  const navigateToProductHunt = async () => {
    await chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      let currentTabId = tabs[0].id as number;
      chrome.tabs.update(currentTabId, { url: "https://www.producthunt.com" });
      chrome.runtime.sendMessage({ message: MESSAGES.NAVIGATE_TO_PROFILE_SERVICE_WORKER, twitterDmText: twitterDMMessage });
    });
  }

  const onProductURLChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setTwitterDMMessage(event.target.value);
    chrome.storage.local.set({ [STORAGE_KEYS.TWITTER_DM_TEXT_POPUP]: event.target.value });
  }

  useEffect(() => {
    chrome.storage.local.get([STORAGE_KEYS.TWITTER_DM_TEXT_POPUP], function (result) {
      setTwitterDMMessage(result[STORAGE_KEYS.TWITTER_DM_TEXT_POPUP] || "");
    });
  }, []);

  return (
    <div className="launch-buddy-popup-container">
      <img src={logo} className="launch-buddy-popup-logo" alt="logo" />
      <div className='launch-buddy-popup-container__product-url'>
        <textarea className='launch-buddy-text-area' placeholder="https://www.producthunt.com/posts/launching-buddy" value={twitterDMMessage} onChange={(event) => onProductURLChange(event)}></textarea>
      </div>
      <div className={`launch-buddy-popup-container__start-button`}>
        <button disabled={twitterDMMessage.length === 0} className='' onClick={(event) => navigateToProductHunt()}>Start Messaging Campaign</button>
      </div>
    </div>
  );
};

export default Popup;
