import tls from "tls";

const options = {
  host: "192.109.17.202",
  port: 443,
  rejectUnauthorized: false,
  // servername: "web.mekness.com",
  minVersion: "TLSv1" as tls.SecureVersion,
  ciphers: "ALL@SECLEVEL=0",
};

console.log("Connecting to", options.host, ":", options.port);

const socket = tls.connect(options, () => {
  console.log("Connected!", socket.authorized ? "Authorized" : "Unauthorized");
  console.log("Protocol:", socket.getProtocol());
  console.log("Cipher:", socket.getCipher());
  process.exit(0);
});

socket.on("error", (err) => {
  console.error("Connection error:", err);
});

socket.on("end", () => {
  console.log("Connection ended");
});
