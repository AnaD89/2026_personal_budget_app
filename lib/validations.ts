import { z } from "zod";

export const expenseSchema = z.object({
  date: z.string().min(1, "Date is required"),
  amount: z.coerce
    .number()
    .min(0.01, "Amount must be greater than 0"),
  details: z.string().min(1, "Details are required").max(500),
  type: z.enum(["PERSONAL", "BUSINESS"]),
  budgetId: z.string().optional(),
});

export type ExpenseInput = z.infer<typeof expenseSchema>;

export const budgetSchema = z.object({
  name: z.string().min(1, "Budget name is required"),
  month: z.string().regex(/^\d{4}-\d{2}$/, "Format must be YYYY-MM"),
  amount: z.coerce.number().min(0, "Amount must be 0 or greater"),
});

export type BudgetInput = z.infer<typeof budgetSchema>;

export const alertPreferenceSchema = z.object({
  emailEnabled: z.boolean(),
  threshold: z.coerce
    .number()
    .min(1, "Threshold must be at least 1")
    .max(100, "Threshold cannot exceed 100"),
});

export type AlertPreferenceInput = z.infer<typeof alertPreferenceSchema>;
