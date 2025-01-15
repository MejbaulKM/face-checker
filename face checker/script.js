document.addEventListener("DOMContentLoaded", () => {
  const urlInput = document.getElementById("urlInput");
  const button = document.getElementById("viewProfileButton");

  // Populate the input with the current tab URL if valid
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const currentTab = tabs[0];
    if (currentTab) {
      const url = currentTab.url;
      const facebookPattern = /^https:\/\/.*\.facebook\.com\/.*/;
      const messengerPattern = /^https:\/\/www\.messenger\.com\/t\/.*/;

      if (facebookPattern.test(url) || messengerPattern.test(url)) {
        urlInput.value = url;
      } else {
        urlInput.value = ""; // Clear input if URL is not valid
      }
    }
  });

  // Add click listener to the button
  button.addEventListener("click", () => {
    const url = urlInput.value.trim();

    if (!url) {
      alert("Please enter a valid URL.");
      return;
    }

    if (url.includes("facebook.com") || url.includes("messenger.com")) {
      // Call the function to fetch the profile picture
      getFacebookProfilePicture(url);
    } else {
      alert("Invalid URL. Please enter a Facebook or Messenger URL.");
    }
  });
});

// Mock function to handle fetching the profile picture
function getFacebookProfilePicture(url) {
  console.log(`Fetching profile picture for: ${url}`);
  // Add implementation here to fetch the profile picture
}
