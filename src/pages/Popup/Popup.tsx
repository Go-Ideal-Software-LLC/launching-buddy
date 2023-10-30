import React, { ChangeEvent, useEffect, useState } from 'react';
import logo from '../../assets/img/launching-buddy-logo.png';
import { MESSAGES, STORAGE_KEYS } from '../../utils/MESSAGES_CONST';
import './Popup.css';

const Popup = () => {
  const [twitterDMMessage, setTwitterDMMessage] = useState<string>("");

  const navigateToProductHunt = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      let currentTabId = tabs[0].id as number;
      chrome.tabs.update(currentTabId, { url: "https://www.producthunt.com" });
      chrome.runtime.sendMessage({ message: MESSAGES.NAVIGATE_TO_PROFILE_SERVICE_WORKER, twitterDmText: twitterDMMessage });
    });
  }

  const cancelActiveCampaign = () => {
    chrome.runtime.sendMessage({ message: MESSAGES.CANCEL_ACTIVE_CAMPAIGN });
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
        <textarea className='launch-buddy-text-area' placeholder="Hello {{FIRST_NAME}},

I am launching my new product, Launching Buddy, on Product Hunt today!

It is a free and open source tool that automatically DMs all of your Product Hunt followers on Twitter.  Feel free to install and use it or star and fork it on GitHub.  

I appreciate it if you would support it by upvoting it.

https://www.producthunt.com/posts/launching-buddy

Thank you,

Rami" value={twitterDMMessage} onChange={(event) => onProductURLChange(event)}></textarea>
      </div>
      <div className='launch-buddy-popup-button-container'>
        <div className={``}>
          <button disabled={twitterDMMessage.length === 0} className='launch-buddy-start-btn' onClick={(event) => navigateToProductHunt()}>Start Messaging Campaign</button>
        </div>
        <div className={``}>
          <button className='launch-buddy-cancel-btn' onClick={(event) => cancelActiveCampaign()}>Cancel Campaign</button>
        </div>
      </div>
    </div>
  );
};

export default Popup;
