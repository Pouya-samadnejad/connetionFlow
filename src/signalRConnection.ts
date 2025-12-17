import * as signalR from "@microsoft/signalr";

let connection: signalR.HubConnection | null = null;

export function getConnection() {
  if (!connection) {
    connection = new signalR.HubConnectionBuilder()
      // TODO: اگر کار نکرد فقط این آدرس را با آدرس هاب خودت عوض کن
      // مثلا: "http://192.168.20.202:5000/chathub" یا مشابه آن
      .withUrl("http://192.168.20.202:5000/chathub")
      .withAutomaticReconnect()
      .build();
  }
  return connection;
}
