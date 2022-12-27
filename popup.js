document.addEventListener('DOMContentLoaded', async () => {
  // get current tab
  const [tab] = await chrome.tabs.query({
    active: true,
    lastFocusedWindow: true,
  });
  console.log(tab.url);
  const WHATSAPP_WEB_URL = 'web.whatsapp.com';

  // check if current tab is whatsapp
  if (tab.url.includes(WHATSAPP_WEB_URL)) {
    console.log('on whatsapp!');
    init();
  } else {
    const onWhatsapp = document.querySelector('.onWhatsapp');
    const notOnWhatsapp = document.querySelector('.notOnWhatsapp');

    onWhatsapp.classList.add('hidden');
    notOnWhatsapp.classList.add('block');
  }

  async function sendMessageToContentScript(messageToContentScript) {
    const response = await chrome.tabs.sendMessage(
      tab.id,
      messageToContentScript
    );
    // do something with response here, not outside the function
    console.log(response);
  }

  function init() {
    const sendButton = document.querySelector('button.send');
    console.log(sendButton);

    sendButton.addEventListener('click', () => {
      const message = document.querySelector('[id="message"]').value;
      const threshold = document.querySelector('[id="threshold"]').value;
      const timeout = document.querySelector('[id="timeout"]').value;

      sendMessageToContentScript({
        message,
        threshold,
        timeout,
      });
    });
  }
});
