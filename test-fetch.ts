
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

async function test() {
  try {
    const res = await fetch("https://web.mekness.com/api/auth/start?version=3000&agent=WebAPI&login=906706&type=manager", {
        headers: {
            "User-Agent": "MT5WebAPI/1.0"
        }
    });
    console.log("Status:", res.status);
    const text = await res.text();
    console.log("Body:", text);
  } catch (e) {
    console.error("Fetch Error:", e);
  }
}

test();
