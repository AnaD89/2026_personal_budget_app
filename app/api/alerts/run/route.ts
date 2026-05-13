import { NextResponse } from "next/server";
import { checkBudgetAlerts } from "@/lib/alerts/check-alerts";

export async function POST(req: Request) {
  try {
    // Verify the request has the correct API key for triggering alerts
    // This could be from a cron job or internal service
    const authHeader = req.headers.get("authorization");
    const expectedKey = process.env.ALERT_TRIGGER_KEY;

    if (!expectedKey || authHeader !== `Bearer ${expectedKey}`) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    await checkBudgetAlerts();

    return NextResponse.json(
      { message: "Alerts checked successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error running alerts:", error);
    return NextResponse.json(
      { error: "Failed to run alerts" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  // Health check endpoint
  return NextResponse.json(
    { status: "Alert service is running" },
    { status: 200 }
  );
}
