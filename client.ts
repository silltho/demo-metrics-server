import WebSocket from "ws";

const ws = new WebSocket("ws://localhost:3001");

ws.on("open", function open() {
  ws.send("something");
});

ws.on("message", function incoming(data: any) {
  console.log(data);
});
