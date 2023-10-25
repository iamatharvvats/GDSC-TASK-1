# GDSC-TASK-1 - 
Creating a fully functional Chrome Extension involves several components: manifest files, background scripts, content scripts, and user interfaces. 
Step 1: Set Up Your Project
Create a new folder for your extension and inside it, create the following files:

1. manifest.json: This file contains metadata about the extension and points to the scripts and resources.
<br>
2. background.js: This script runs in the background and manages the extension's behavior.

3. content.js: This script runs in the context of web pages and can manipulate DOM elements.

The manifest.json file is a crucial part of any Chrome extension.
It provides essential metadata about the extension to the Chrome browser, defining its permissions, capabilities, and how it should behave.
<br>
Manifest.json file :-
The manifest.json file is a crucial part of any Chrome extension.<br>
It provides essential metadata about the extension to the Chrome browser, defining its permissions, capabilities, and how it should behave.<br>
Explanation of Manifest Properties:<br>
manifest_version: Specifies the version of the Chrome extension manifest file. In this case, it's version 3.<br>
name: The name of your extension as it appears in the Chrome Extensions page.<br>
version: The version number of your extension. You can update this whenever you release a new version of your extension.<br>
permissions: An array specifying the permissions required by your extension. <br>
In this case, the extension requests permissions to interact with tabs, access active tab details, use storage, and listen for web navigation events.<br>
icons: An object specifying the icons used for your extension. The "48" key indicates a 48x48-pixel icon named "icon.png". <br>
Icons are used in various places, such as the toolbar and the Extensions page.<br>
background: Specifies the background script for your extension. In this case, a service worker script named "background.js" is used. <br>
The background script runs in the background, allowing your extension to respond to events even when the popup is closed.<br>
content_scripts: An array of content scripts that are injected into web pages. <br>
In this case, a content script named "content.js" is injected into all URLs ("<all_urls>"). Content scripts can manipulate the DOM and interact with web pages.<br>
action: Specifies the browser action for your extension, which typically appears as a clickable icon in the browser toolbar. <br>
The "default_popup" property indicates the HTML file (popup.html) that will be shown when the user clicks the extension icon.<br> 
The "default_icon" property specifies the icon used for the browser action.<br>

Explanation of the background.js script:
```
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
```
This line sets up an event listener that listens for updates to the tabs, specifically the onUpdated event. When a tab is updated (e.g., when a page finishes loading), the provided function will be executed.
```
if (changeInfo.status === 'complete') {
```
This conditional checks if the tab update is complete (i.e., the page has finished loading). 
This ensures that the tab grouping and title updating only occur when the page has fully loaded.
```
chrome.tabs.query({ active: true, lastFocusedWindow: true }, function (tabs) {
```
This line queries the current active tab in the last focused window. It obtains information about the currently active tab, including its URL and group information.
```
const activeTab = tabs[0];
```
It extracts the active tab from the result of the query, storing it in the activeTab variable.
```
const url = activeTab.url;
```
It extracts the URL of the active tab.
```
if (isValidUrl(url)) {
```
This condition checks if the URL is valid by calling the isValidUrl function. If it's a valid URL, the extension proceeds with grouping and title updating.
```
const domain = new URL(url).hostname;
```
This line extracts the domain (hostname) from the URL. For example, it extracts "www.example.com" from "https://www.example.com/page1".
```
if (activeTab.groupId !== undefined) {
```
This condition checks if the active tab has a group ID, indicating that it is already in a group. If so, it updates the group title with the extracted domain.
```
chrome.tabGroups.update(activeTab.groupId, { title: domain }, function(group) {
```
This line attempts to update the title of the tab's group with the extracted domain. The callback function handles any errors, and if there is an error, it's logged to the console.
} else {

If the tab is not part of any group (i.e., activeTab.groupId is undefined), it creates a new tab group and updates the title to the extracted domain.
```
chrome.tabs.group({ tabIds: tabId }, function(group) {
```
This line creates a new tab group for the tab specified by tabId (the active tab) and assigns it to the group variable.
```
chrome.tabGroups.update(group, { title: domain }, function(updatedGroup) {
```
If the group creation is successful, it updates the title of the newly created group to the extracted domain. As with the previous chrome.tabGroups.update call, error handling is included.<br>
} else {
This branch handles errors if there are any issues when creating the group or updating the group title.<br>
} else {
This line handles the case where the URL is not valid. If the URL is not valid, it logs an error message to the console. This is useful for debugging or handling invalid URLs.<br>
```
function isValidUrl(url) {
```
This line defines a function named isValidUrl that checks if a URL is valid.<br>
try {
The try block attempts to create a URL object from the provided URL string.<br>
new URL(url);
This line creates a URL object from the URL string. If the URL is not valid, it will throw an error.<br>
return true;<br>
If creating a URL object is successful (i.e., the URL is valid), the function returns true.<br>
} catch (error) {<br>
The catch block captures any errors that occur when trying to create a URL object.<br>
return false;<br>
If an error occurs, the function returns false, indicating that the URL is not valid.<br>
This background.js script handles tab grouping and title updating for active tabs in your Chrome extension. It also includes error handling to address potential issues during the process.<br>
***********************************************************************************************************************************************************************
Here's an explanation of each line of the content.js script:<br>
```
const body = document.body;<br>
const domain = window.location.hostname;<br>
```
<br>
1.) First line selects the <body> element of the current webpage and stores it in the variable body. 
It allows the script to manipulate the body content of the webpage.
2.) Next  line retrieves the hostname (domain) of the current webpage's URL using window.location.hostname. 
It stores the domain in the variable domain for later use. For example, if the current URL is "https://www.example.com/page1", domain would be "www.example.com".

```
body.classList.add(`extension-domain-${domain}`);
```
This line adds a CSS class to the <body> element of the webpage. 
The class name is dynamically generated based on the current domain. 
For example, if the domain is "www.example.com", the class added would be extension-domain-www.example.com. 
This class is used for applying specific styles to the webpage related to its domain.
```
const observer = new MutationObserver(function(mutationsList, observer) { ... });
```
This line creates a new MutationObserver that watches for changes in the DOM structure of the webpage.
```
for (let mutation of mutationsList) { ... }
```
This loop iterates over the list of mutations detected by the observer.
```
if (mutation.type === 'childList') { ... }
```
This condition checks if the type of mutation is a change in the child nodes of the observed DOM element. It ensures that the observer reacts specifically to changes in the child elements of the webpage.
```
mutation.addedNodes.forEach(function(node) { ... });
```
This loop iterates over the nodes that were added to the DOM.
```
if (node.nodeType === Node.ELEMENT_NODE) { ... }
```
This condition checks if the added node is an HTML element (as opposed to a text node or other types of nodes).
```
node.classList.add(extension-domain-${domain});
```
For each added HTML element, this line adds the same dynamic CSS class (extension-domain-${domain}) that was added to the <body> element earlier. 
This ensures that new elements added to the DOM also have the appropriate class.

```
observer.observe(body, { childList: true, subtree: true });
```
This line instructs the MutationObserver to start observing changes in the specified DOM element (body). 
The options passed ({ childList: true, subtree: true }) indicate that the observer should watch for changes in the child nodes and 
the entire subtree (nested elements) of the specified element.
<br>
In summary, the content.js script adds a specific CSS class to the <body> element of the webpage based on its domain. 
Additionally, it uses a MutationObserver to dynamically add the same CSS class to any new elements added to the DOM, ensuring consistent 
styling across the entire webpage, including newly loaded or dynamically generated content.
<br>
Certainly! popup.html<link rel="stylesheet" href="popup.css">: 
Links an external CSS file (popup.css) for styling the popup content. is an HTML file that defines the structure and content of the popup window displayed
when a user clicks the extension icon in the Chrome toolbar. 


