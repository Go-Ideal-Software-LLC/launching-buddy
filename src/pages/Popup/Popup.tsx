import React, { ChangeEvent, useEffect, useState } from 'react';
import logo from '../../assets/img/launching-buddy-logo.png';
import { MESSAGES } from '../../utils/MESSAGES_CONST';
import './Popup.css';

const Popup = () => {
  const [urlOfProduct, setURLOfProduct] = useState<string>("");

  const navigateToProductHunt = async () => {
    await chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      let currentTabId = tabs[0].id as number;
      chrome.tabs.update(currentTabId, { url: "https://www.producthunt.com" });
      chrome.runtime.sendMessage({ message: MESSAGES.NAVIGATE_TO_PROFILE_SERVICE_WORKER, twitterDmText: urlOfProduct });
    });
  }

  const onProductURLChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setURLOfProduct(event.target.value);
  }

  return (
    <div className="launch-buddy-popup-container">
      <img src={logo} className="launch-buddy-popup-logo" alt="logo" />
      <div className='launch-buddy-popup-container__product-url'>
        <textarea className='' placeholder="https://www.producthunt.com/posts/launching-buddy" value={urlOfProduct} onChange={(event) => onProductURLChange(event)}></textarea>
      </div>
      <div className={`launch-buddy-popup-container__start-button`}>
        <button disabled={urlOfProduct.length === 0} className='' onClick={(event) => navigateToProductHunt()}>Start Messaging Campaign</button>
      </div>
    </div>
  );
};

export default Popup;
