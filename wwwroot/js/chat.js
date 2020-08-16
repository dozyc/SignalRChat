"use strict";

// Create connection
var connection = new signalR.HubConnectionBuilder().withUrl("/chatHub").build();

// Disable send button until connection is established
document.getElementById("sendButton").disabled = true;

// Handler for connection that receives a message and user, and adds it to the messageList
connection.on(
    "ReceiveMessage", function(user, message) {
        var msg = message.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
        var encodedMsg = user + ": " + msg;
        console.debug("Received " + encodedMsg);
        var li = document.createElement("li");
        li.textContent = encodedMsg;
        document.getElementById("messageList").appendChild(li);
    }
);

// Start connection
connection.start().then(
    function() {
        document.getElementById("sendButton").disabled = false;
    }
).catch(
    function(err) {
        return console.error(err.toString());
    }
);

// Handler for sendButton that passes the message content and user name to the hub
document.getElementById("sendButton").addEventListener(
    "click", function(event) {
        var user = document.getElementById("userInput").value;
        var message = document.getElementById("messageInput").value;
        console.debug("Sent " + user + ": " + message);
        connection.invoke(
            "SendMessage", user, message
        ).catch(
            function (err) {
                return console.error(err.toString());
            }
        );
        event.preventDefault();
    }
);