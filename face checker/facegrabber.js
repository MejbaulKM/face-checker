// facegrabber.js

// Main function to get and display the Facebook profile picture
function getFacebookProfilePicture(url) {
  getCurrentUsername(url)
    .then(getUsernameId)
    .then(openFullHdPhoto)
    .catch((error) => {
      console.error("Error:", error.message);
    });
}

// Get the current tab URL
function getCurrentTabUrl() {
  return new Promise((resolve, reject) => {
    chrome.tabs.query(
      { active: true, lastFocusedWindow: true },
      (tabs) => {
        if (tabs.length === 0) {
          reject(new Error("No active tabs found."));
        } else {
          resolve(tabs[0].url);
        }
      }
    );
  });
}

// Extract the username or ID from the URL
function getCurrentUsername(link) {
  return new Promise((resolve, reject) => {
    try {
      const url = new URL(link);
      if (url.pathname.includes("/friends/")) {
        resolve(url.searchParams.get("profile_id"));
      } else if (url.pathname.includes("/groups/")) {
        const parts = url.pathname.split("/").filter((str) => str !== "");
        resolve(parts[3]);
      } else if (url.pathname.includes("/t/")) {
        const parts = url.pathname.split("/").filter((str) => str !== "");
        resolve(parts[1]);
      } else if (url.pathname === "/profile.php") {
        resolve(url.searchParams.get("id"));
      } else {
        const username = url.pathname.replace(/^\/+|\/+$/g, ""); // Trim slashes
        resolve(username);
      }
    } catch (error) {
      reject(new Error("Invalid URL format."));
    }
  });
}

// Fetch the user ID from Facebook's mobile site
function getUsernameId(username) {
  return new Promise((resolve, reject) => {
    fetch(`https://mbasic.facebook.com/${username}`)
      .then((response) => response.text())
      .then((html) => {
        const regex = /owner_id=([a-z0-9\-]+)\&?/i;
        const match = html.match(regex);
        if (match) {
          resolve(match[1]);
        } else {
          reject(new Error("Could not extract Facebook Profile ID."));
        }
      })
      .catch(() => {
        reject(new Error("Failed to fetch Facebook profile data."));
      });
  });
}

// Open the high-definition profile picture in a new tab
function openFullHdPhoto(id) {
  getFbAccessToken()
    .then((accessToken) => {
      const url = `https://graph.facebook.com/${id}/picture?width=5000&access_token=${accessToken}`;
      window.open(url, "_blank");
    })
    .catch(() => {
      alert("Failed to fetch access token.");
    });
}

// Simulate getting an access token
function getFbAccessToken() {
  return new Promise((resolve) => {
    // Facebook Android client token (example token)
    resolve("6628568379%7Cc1e620fa708a1d5696fb991c1bde5662");
  });
}
