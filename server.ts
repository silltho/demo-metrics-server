import WebSocket from 'ws';

const wss = new WebSocket.Server({ port: 3001 });

type Data = Chunk[]

interface Chunk {
    eventId: string
    feedId: string
    value: number
    timestamp: number
}

const data: Data[] = []

wss.on("connection", function connection(ws) {
  ws.send("something");
});

setInterval(() => {
    wss.clients.forEach(sendData)
}, 1000)

function sendData(client: WebSocket) {
    if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(generateNextData()));
    }
}

function generateNextData() {
    const s1 = getNextFeedData("s1");
    const s2 = getNextFeedData("s2");
    const unique = createChunk("unique_devices", s1.value + s2.value);
    const next = [s1, s2, unique];
    data.push(next)
    return next
}



function getNextFeedData(feedId: string) {
    const lastFeedData = data.slice(-1)[0]?.find((el) => el.feedId === feedId).value 
    const value = !lastFeedData 
          ? Math.floor(Math.random() * 99 + 1)
          : getValue(lastFeedData)
    return createChunk(feedId, value);
}

function createChunk(feedId:string, value: number) {
    return {
      eventId: "event1",
      feedId,
      value,
      timestamp: getTimestamp()
    };
}

function getRandomPercentage() {
    const prefix = Math.round(Math.random()) == 1 ? 1 : -1;
    return Math.floor(prefix * Math.random() * 50)
}

function getValue(previous: number) {
    const change = previous * getRandomPercentage() / 100;
    return Math.floor(previous + change);
}

function getTimestamp () {
    return  Math.floor(Date.now() / 1000) - 1
}