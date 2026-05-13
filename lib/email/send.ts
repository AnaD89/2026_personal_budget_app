import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

interface AlertEmailParams {
  email: string;
  name: string;
  threshold: number;
  spent: number;
  budget: number;
  percentage: number;
  month: string;
}

export async function sendAlertEmail(params: AlertEmailParams) {
  try {
    if (!process.env.RESEND_API_KEY) {
      console.warn("RESEND_API_KEY not configured, skipping email");
      return;
    }

    const { email, name, threshold, spent, budget, percentage, month } = params;

    const result = await resend.emails.send({
      from: "budget-alerts@yourapp.com",
      to: email,
      subject: `🚨 Budget Alert: You've spent ${percentage}% of your budget for ${month}`,
      html: `
        <h2>Budget Alert</h2>
        <p>Hi ${name},</p>
        <p>You've reached <strong>${percentage}%</strong> of your monthly budget (threshold: ${threshold}%).</p>
        
        <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Month:</strong> ${month}</p>
          <p><strong>Amount Spent:</strong> ${spent.toFixed(2)} RON</p>
          <p><strong>Budget:</strong> ${budget.toFixed(2)} RON</p>
          <p><strong>Remaining:</strong> ${(budget - spent).toFixed(2)} RON</p>
        </div>
        
        <p>Check your dashboard to manage your expenses: <a href="https://yourapp.com/dashboard">View Dashboard</a></p>
        <p>Best regards,<br>Budget App Team</p>
      `,
    });

    console.log("Alert email sent successfully:", result);
    return result;
  } catch (error) {
    console.error("Error sending alert email:", error);
    throw error;
  }
}

export async function sendWelcomeEmail(email: string, name: string) {
  try {
    if (!process.env.RESEND_API_KEY) {
      console.warn("RESEND_API_KEY not configured, skipping email");
      return;
    }

    const result = await resend.emails.send({
      from: "welcome@yourapp.com",
      to: email,
      subject: "Welcome to Budget App",
      html: `
        <h2>Welcome, ${name}!</h2>
        <p>Thank you for joining our budget management app.</p>
        <p>Get started by:</p>
        <ol>
          <li>Creating a budget for this month</li>
          <li>Adding your expenses</li>
          <li>Setting up budget alerts</li>
        </ol>
        <p><a href="https://yourapp.com/dashboard">Go to Dashboard</a></p>
      `,
    });

    return result;
  } catch (error) {
    console.error("Error sending welcome email:", error);
    throw error;
  }
}
