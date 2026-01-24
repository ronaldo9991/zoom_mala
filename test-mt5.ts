
import { mt5Client } from "./server/lib/rates/mt5";

async function test() {
  console.log("Testing MT5 Connection...");
  try {
    const rates = await mt5Client.getRates();
    console.log("Rates:", rates);
  } catch (error) {
    console.error("Test Failed:", error);
  }
}

test();
