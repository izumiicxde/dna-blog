import { z } from "zod";

export const blogSchema = z.object({
  title: z
    .string()
    .min(10, { message: "Title must have at least 10 characters." })
    .max(225, { message: "Title must not exceed 225 characters." }),
  body: z
    .string()
    .min(40, { message: "Body must have at least 40 characters." }),
  coverImage: z.string(),
  tags: z.string(),
  userId: z.string().optional(),
});

export type BlogSchema = z.infer<typeof blogSchema>;
