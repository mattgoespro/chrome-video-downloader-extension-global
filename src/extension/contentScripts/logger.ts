chrome.runtime.onMessage.addListener(async (message) => {
  if (message.subject === "logMessage") {
    console.log(message.payload.message, ...message.payload.args);
  }
});
