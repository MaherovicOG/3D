import { NextResponse } from "next/server";
import os from "os";

export async function GET() {
  try {
    const interfaces = os.networkInterfaces();
    let localIp = "localhost";

    // Loop through network interfaces to find IPv4
    for (const name of Object.keys(interfaces)) {
      const ifaces = interfaces[name];
      if (!ifaces) continue;

      for (const iface of ifaces) {
        // Skip loopback (127.0.0.1) and non-IPv4 addresses
        if (iface.family === "IPv4" && !iface.internal) {
          // Skip link-local IP addresses (169.254.x.x) which are unroutable
          if (iface.address.startsWith("169.254.")) {
            continue;
          }
          // Prioritize standard Wi-Fi (en0 on Mac, wlan/ethernet on Windows/Linux)
          localIp = iface.address;
          if (name.startsWith("en") || name.startsWith("wlan") || name.startsWith("eth")) {
            break;
          }
        }
      }
    }

    return NextResponse.json({ localIp });
  } catch (error) {
    console.error("Info API Error:", error);
    return NextResponse.json({ localIp: "localhost" });
  }
}
