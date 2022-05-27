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
    var nameCopy = nameElem;
    // extract first name - remove emojis & get first word
    var regex = /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g;
    nameElem = nameElem.replace(regex, '').trim();
    nameElem = nameElem.substring(0, nameElem.indexOf(' ')).trim();
    if (nameElem.length == 0) {
        nameElem = nameCopy;
    }

    // SET message content
    inputElement.value = `Hello ${nameElem},

I would love to connect with you!

All the best,
Jessica`;

    inputElement.setAttribute("marked", "true");
    $("button.connect-cta-form__send").on('click', increaseInviteCounter);
}

async function getInviteMessageLIProfileName() {
    var name = document.querySelector('div.artdeco-modal__content p span strong');
    if (name != null) {
        name = name.innerText;
        var nameCopy = name;
        // extract first name - remove emojis & get first word
        var regex = /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g;
        name = name.replace(regex, '').trim();
        name = name.substring(0, name.indexOf(' ')).trim();
        if (name.length == 0) {
            name = nameCopy;
        }

        GM_setValue("tempInviteName", name);
    }
}

async function insertInviteMessageLIProfile() {
    console.log("insert invite");
    var message = document.querySelector('textarea[id="custom-message"]');
    if (message != null && message.value.length == 0 && message.getAttribute("marked") == null) {
        var invitePersonName = GM_getValue("tempInviteName", "");

        // SET message content
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
    if (newValue % 20 == 0) { // every 20 invites, give alert
        alert("You have reached " + newValue.toString() + " invites already");
    }
}
