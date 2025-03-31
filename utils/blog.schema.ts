import { z } from "zod";

export const blogSchema = z.object({
  title: z.string().min(10).max(225),
  body: z.string().min(40),
  coverImage: z.string(),
  tags: z.string().array(),
  userId: z.string().optional(),
});
export type BlogSchema = z.infer<typeof blogSchema>;
