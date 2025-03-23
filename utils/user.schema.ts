import { z } from "zod";

export const loginSchema = z.object({
  identifier: z
    .string()
    .min(1, "Identifier is required")
    .refine(
      (val) =>
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) || /^[a-zA-Z0-9_]+$/.test(val),
      {
        message: "Identifier must be a valid email or username",
      }
    ),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export const signupSchema = z
  .object({
    email: z.string().email({ message: "Invalid email format" }),
    username: z
      .string()
      .min(3, { message: "Username must be at least 3 characters" })
      .max(20, { message: "Username must be at most 20 characters" })
      .regex(/^[a-zA-Z0-9_]+$/, {
        message: "Username can only contain letters, numbers, and underscores",
      }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long" })
      .regex(/[A-Z]/, {
        message: "Password must contain at least one uppercase letter",
      })
      .regex(/[a-z]/, {
        message: "Password must contain at least one lowercase letter",
      })
      .regex(/[0-9]/, { message: "Password must contain at least one number" })
      .regex(/[\W_]/, {
        message: "Password must contain at least one special character",
      }),
    confirmPassword: z
      .string()
      .min(8, { message: "Confirm Password is required" }),
    fullName: z
      .string()
      .min(2, { message: "Full name must be at least 2 characters long" })
      .max(50, { message: "Full name must be at most 50 characters long" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"], // Error will be attached to confirmPassword field
  });
