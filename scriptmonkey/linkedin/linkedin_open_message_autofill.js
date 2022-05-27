// ==UserScript==
// @name         linkedin open message
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.linkedin.com/sales/search/people*
// @match        https://www.linkedin.com/sales/lead/*
// @require http://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @require  https://gist.github.com/raw/2625891/waitForKeyElements.js
// @grant        none
// ==/UserScript==


// edit strings after "set title" and "set message content" comments


waitForKeyElements("#artdeco-hoverable-outlet__message-overlay", async function () {
    'use strict';

    await new Promise(r => setTimeout(r, 700));
    var inputElement = document.querySelector("input.compose-form__subject-field");
    if (inputElement == null || inputElement.value != "" || inputElement.getAttribute("marked") != null) {
        return;
    }
    if (document.querySelectorAll('span[aria-label="Message from you"]').length > 0) {
        inputElement.value = "Warning: you have written to this person already!";
        return;
    }

    if (document.querySelector(".mr2.pv1").innerText.includes("remaining credits")) {
        // add correct message only to Open Profile
        document.querySelector(".mr2.pv1").style.color = "red";
        inputElement.value = "Warning: do not use credits, this is not an open profile!"
            return;
    }

    console.log(document.querySelectorAll('span[data-anonymize="person-name"]'));
    var nameElem = document.querySelectorAll('span[data-anonymize="person-name"]');
    var index = 1;
    if (nameElem.length > 6)
        index = 0;
    nameElem = nameElem[index].innerText;
    var nameCopy = nameElem;
    // extract first name - remove emojis & get first word
    var regex = /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g;
    nameElem = nameElem.replace(regex, '').trim();
    nameElem = nameElem.substring(0, nameElem.indexOf(' ')).trim();
    if (nameElem.length == 0) {
        nameElem = nameCopy;
    }

    var inputElement2 = document.querySelector("textarea.compose-form__message-field");

    // SET title
    inputElement.value = "Lets network";
    // SET message content
    inputElement2.value = `Hi ${nameElem},

Saw that you have an open profile and would love to discuss an opportunity with you, let me know if you're interested!

Best wishes,
Jessica`;

    inputElement.dispatchEvent(new Event('keyup')); // to enable send button
    inputElement2.dispatchEvent(new Event('input'));
    inputElement.setAttribute("marked", "true");
});
