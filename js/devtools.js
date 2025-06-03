/**
 * DevTools Script - Registers our custom panel in Chrome DevTools
 * Created: June 2, 2025
 */

// Create a panel in Chrome DevTools
chrome.devtools.panels.create(
  "AgentForce Assistant", // Panel title
  "images/icon16.png", // Panel icon
  "panel/panel.html", // Path to panel HTML
  function (panel) {
    // Panel created callback
    console.log("AgentForce Assistant tab created successfully");
  }
);
