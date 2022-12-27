chrome.runtime.onMessage.addListener(function (
  messageFromPopup,
  sender,
  sendResponse
) {
  if (Object.keys(messageFromPopup).length > 0) {
    start(messageFromPopup);
  }
});

function start(messageFromPopup) {
  const { message, threshold, timeout } = messageFromPopup;
  // *whatsApp DOM specific logic
  function sendMessage(message) {
    const mainElement = document.querySelector('#main');
    const textareaElement = mainElement.querySelector(
      'div[contenteditable="true"]'
    );

    if (!textareaElement) {
      throw new Error('There is no opened conversation');
    }

    textareaElement.focus();
    document.execCommand('insertText', false, message);
    textareaElement.dispatchEvent(new Event('change', { bubbles: true }));

    setTimeout(() => {
      (
        mainElement.querySelector('[data-testid="send"]') ||
        mainElement.querySelector('[data-icon="send"]')
      ).click();
    }, 100);
  }

  // *interval logic
  const THRESHOLD = threshold || 10;
  const TIMEOUT = timeout || 3000; // default: 3 seconds
  let intervals = 0;

  console.log({ message, THRESHOLD, TIMEOUT });

  const bruteforce = setInterval(() => {
    intervals++;
    if (intervals > THRESHOLD) {
      clearInterval(bruteforce);
      return;
    }

    sendMessage(message);
  }, TIMEOUT);
}
