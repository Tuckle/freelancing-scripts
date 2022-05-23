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

    var inputElement2 = document.querySelector("textarea.compose-form__message-field");

    // set title
    inputElement.value = "Lets network";
    // set message content
    inputElement2.value = `Hi ${nameElem},

Saw that you have an open profile and would love to discuss an opportunity with you, let me know if you're interested!

Best wishes,
Jessica`;

    inputElement.dispatchEvent(new Event('keyup')); // to enable send button
    inputElement2.dispatchEvent(new Event('input'));
    inputElement.setAttribute("marked", "true");
});
