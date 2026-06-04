import { NextResponse, NextRequest } from "next/server";
import os from "os";

export async function GET(req: NextRequest) {
  try {
    // 1. Get host from request headers
    const host = req.headers.get("host") || "";
    const isProduction = host && 
      !host.includes("localhost") && 
      !host.includes("127.0.0.1") && 
      !host.includes("169.254.");

    if (isProduction) {
      // If running on Vercel/production, return the public host name
      return NextResponse.json({ localIp: host });
    }

    // 2. Fallback to local network IP for local development/Wi-Fi sharing
    const interfaces = os.networkInterfaces();
    let localIp = "localhost";

    for (const name of Object.keys(interfaces)) {
      const ifaces = interfaces[name];
      if (!ifaces) continue;

      for (const iface of ifaces) {
        if (iface.family === "IPv4" && !iface.internal) {
          // Skip link-local IP addresses (169.254.x.x)
          if (iface.address.startsWith("169.254.")) {
            continue;
          }
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
