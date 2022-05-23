// ==UserScript==
// @name         linkedin invite message
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.linkedin.com/sales/search/people*
// @match        https://www.linkedin.com/sales/lead/*
// @match        https://www.linkedin.com/search/results/people/*
// @match        https://www.linkedin.com/in/*
// @require http://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @require  https://gist.github.com/raw/2625891/waitForKeyElements.js
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_listValues
// @grant       GM_deleteValue
// ==/UserScript==


// edit the strings after "set message content" comments


waitForKeyElements(".connect-cta-form__header-container", insertInviteMessage);
waitForKeyElements("#send-invite-modal", getInviteMessageLIProfileName);
waitForKeyElements('#custom-message', insertInviteMessageLIProfile);

async function insertInviteMessage() {
    'use strict';

    var inputElement = document.querySelector("textarea.mt3");
    if (inputElement.value != "" || inputElement.getAttribute("marked") != null) {
        return;
    }

    var nameElem = document.querySelector('div[data-anonymize="person-name"]').innerText;
    var lastSpace = nameElem.lastIndexOf(" ");
    nameElem = nameElem.slice(0, lastSpace);

    // set message content
    inputElement.value = `Hello ${nameElem},

I would love to connect with you!

All the best,
Jessica`;

    $("button.connect-cta-form__send").on('click', increaseInviteCounter);
    inputElement.setAttribute("marked", "true");
}

async function getInviteMessageLIProfileName() {
    var name = document.querySelector('div.artdeco-modal__content p span strong');
    if (name != null) {
        name = name.innerText;
        var lastSpace = name.lastIndexOf(" ");
        name = name.slice(0, lastSpace);
        GM_setValue("tempInviteName", name);
    }
}

async function insertInviteMessageLIProfile() {
    console.log("insert invite");
    var message = document.querySelector('textarea[id="custom-message"]');
    if (message != null && message.value.length == 0 && message.getAttribute("marked") == null) {
        var invitePersonName = GM_getValue("tempInviteName", "");

	// set message content
        message.value = `Hello ${invitePersonName},

I would love to connect with you!

All the best,
Jessica`;

        message.dispatchEvent(new Event('input'));
        message.setAttribute("marked", "true");
        $('button[aria-label="Send now"]').on('click', increaseInviteCounter);
    }
}

async function increaseInviteCounter() { // increase invite counter and alert when every 20 invites are reached
    // get first day of week
    var currentDate = new Date();
    var firstDayOfWeek = new Date(currentDate.setDate(currentDate.getDate() - currentDate.getDay())).toLocaleDateString('en-us', {
        weekday: "long",
        year: "numeric",
        month: "short",
        day: "numeric"
    });

    var keyName = "invite_count_for_" + firstDayOfWeek;
    var newValue = GM_getValue(keyName, 0) + 1;
    GM_setValue(keyName, newValue);
    console.log("invite counter = " + newValue.toString())
    let arrayOfKeys = GM_listValues();
    // cleanup old keys for invite count
    for (var i = 0; i < arrayOfKeys.length; i++) {
        if (arrayOfKeys[i].startsWith("invite_count_for_") && arrayOfKeys[i] != keyName) {
            GM_deleteValue(arrayOfKeys[i]);
        }
    }
    if (newValue % 20 == 0) {  // every 20 invites, give alert
        alert("You have reached " + newValue.toString() + " invites already");
    }
}
