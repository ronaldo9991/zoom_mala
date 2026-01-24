import net from "net";

const client = new net.Socket();
client.connect(443, "web.mekness.com", () => {
  console.log("Connected");
  setTimeout(() => {
    console.log("Writing...");
    client.write("GET / HTTP/1.1\r\nHost: web.mekness.com\r\n\r\n");
  }, 2000);
});

client.on("data", (data) => {
  console.log("Received: " + data);
  client.destroy(); // kill client after server's response
});

client.on("close", () => {
  console.log("Connection closed");
});

client.on("error", (err) => {
  console.error("Connection error: " + err.message);
});
