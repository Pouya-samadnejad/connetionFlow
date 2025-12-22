import * as signalR from "@microsoft/signalr";

let connectionIN: signalR.HubConnection | null = null;
let connectionOUT: signalR.HubConnection | null = null;

export function getConnection() {
  if (!connectionIN) {
    connectionIN = new signalR.HubConnectionBuilder()
      .withUrl(window.apiHUB1)
      .withAutomaticReconnect()
      .build();
  }
  return connectionIN;
}

export function getConnection2() {
  if (!connectionOUT) {
    connectionOUT = new signalR.HubConnectionBuilder()
      .withUrl(window.apiHUB2)
      .withAutomaticReconnect()
      .build();
  }
  return connectionOUT;
}
