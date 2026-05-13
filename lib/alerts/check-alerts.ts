import { prisma } from "@/lib/prisma";
import { sendAlertEmail } from "@/lib/email/send";

export async function checkBudgetAlerts() {
  try {
    // Get all users with alert preferences enabled
    const usersWithAlerts = await prisma.alertPreference.findMany({
      where: { emailEnabled: true },
      include: { user: true },
    });

    for (const alertPref of usersWithAlerts) {
      // Get current month's expenses for this user
      const now = new Date();
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);

      const totalSpent = await prisma.expense.aggregate({
        where: {
          userId: alertPref.userId,
          date: {
            gte: monthStart,
            lte: monthEnd,
          },
        },
        _sum: {
          amount: true,
        },
      });

      // Get current month's budgets for this user
      const monthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
      const budgets = await prisma.budget.findMany({
        where: {
          month: monthStr,
          members: {
            some: { userId: alertPref.userId },
          },
        },
      });

      // Calculate total budget and percentage spent
      const totalBudget = budgets.reduce((sum, b) => sum + b.amount, 0);
      const amountSpent = totalSpent._sum.amount || 0;
      const percentageSpent =
        totalBudget > 0 ? (amountSpent / totalBudget) * 100 : 0;

      // Check if alert threshold is exceeded
      if (percentageSpent >= alertPref.threshold) {
        await sendAlertEmail({
          email: alertPref.user.email!,
          name: alertPref.user.name || "User",
          threshold: alertPref.threshold,
          spent: amountSpent,
          budget: totalBudget,
          percentage: Math.round(percentageSpent),
          month: monthStr,
        });
      }
    }
  } catch (error) {
    console.error("Error checking budget alerts:", error);
  }
}
