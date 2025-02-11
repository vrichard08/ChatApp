import * as signalR from "@microsoft/signalr";


const connection = new signalR.HubConnectionBuilder()
    .withUrl("https://localhost:7105/messageHub", {
        accessTokenFactory: () => {
            return localStorage.getItem('token');
        },
        skipNegotiation: true, 
        transport: signalR.HttpTransportType.WebSockets,
    })
    .withAutomaticReconnect()
    .build();

async function startConnection() {
    try {
        await connection.start();
        console.log("SignalR Connected.");
    } catch (err) {
        console.log("SignalR Connection Error: ", err);
        setTimeout(startConnection, 5000);
    }
}

async function sendMessage(user, message) {
    try {
        await connection.invoke("SendMessage", user, message);
    } catch (err) {
        console.error("Error sending message: ", err);
    }
}

startConnection();

export {
    connection,
    sendMessage
}; 