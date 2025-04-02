import { PrismaClient, User } from "@prisma/client";
import { blogSchema, BlogSchema } from "utils/blog.schema";
import { compareHash, hashPassword } from "utils/password";
import { loginSchema, signupSchema } from "utils/user.schema";
import { z } from "zod";
import { getUserFromSession } from "./services/session.server";

declare global {
  var __prisma: PrismaClient;
}
if (!global.__prisma) {
  global.__prisma = new PrismaClient();
}
global.__prisma.$connect();
export const prisma = global.__prisma;

export const signup = async (req: z.infer<typeof signupSchema>) => {
  const { success, data, error } = signupSchema.safeParse(req);

  if (!success) throw new Error(JSON.stringify(error.flatten().fieldErrors));

  const user = await prisma.user.findFirst({
    where: {
      OR: [{ email: data.email }, { username: data.username }],
    },
  });

  if (user !== null) {
    if (user.email === data.email)
      throw new Error("user with this email already exists");
    if (user.username === data.username)
      throw new Error("Username already taken");
  }

  const hash = await hashPassword(data.password);

  const { password, ...created } = await prisma.user.create({
    data: {
      email: data.email,
      password: hash,
      username: data.username,
      fullName: data.fullName,
    },
  });
  return created;
};

export type Credentials = {
  identifier: string;
  password: string;
};

export const login = async ({
  identifier,
  password,
}: Credentials): Promise<User | null> => {
  const result = loginSchema.safeParse({ identifier, password });
  if (!result.success)
    throw new Error(JSON.stringify(result.error.flatten().fieldErrors));

  const user = await prisma.user.findFirst({
    where: {
      OR: [{ email: identifier }, { username: identifier }],
    },
  });

  if (!user) throw new Error("invalid credentials");

  const isPasswordCorrect = await compareHash({
    hash: user.password,
    password,
  });

  if (!isPasswordCorrect) throw new Error("invalid credentials");
  return user;
};

export const createBlog = async (BlogData: BlogSchema) => {
  const { success, data, error } = blogSchema.safeParse(BlogData);
  if (!success) throw Error(JSON.stringify(error.flatten().fieldErrors));
  if (!data.userId) throw Error("unauthorized");

  const { title, body, coverImage, tags } = data;

  const blog = await prisma.blog.create({
    data: {
      title,
      body,
      coverImage,
      userId: data.userId,
      slug: title.split(" ").join("_"),
    },
  });

  if (tags && Array.isArray(tags) && tags.length > 0) {
    const validTags = tags
      .map((tag) => tag.trim())
      .filter((tag) => tag !== "#" && tag !== "" && tag !== ",");

    console.log(validTags);
    for (const tagName of validTags) {
      let tag = await prisma.tag.findUnique({
        where: { name: tagName },
      });

      if (!tag) {
        tag = await prisma.tag.create({ data: { name: tagName } });
      }

      await prisma.blogTag.create({
        data: { blogId: blog.id, tagId: tag.id },
      });
    }
  }

  return { status: true, message: "blog created successfully", blog };
};

export const getBlogs = async (page: number = 1, pagesize: number = 10) => {
  const blogs = await prisma.blog.findMany({
    skip: (page - 1) * pagesize,
    take: pagesize,
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: {
          fullName: true,
          image: true,
          username: true,
        },
      },
    },
  });

  const totalBlogs = await prisma.blog.count();

  return {
    blogs,
    total: totalBlogs,
    totalPages: Math.ceil(totalBlogs / pagesize),
    currentPage: page,
  };
};

export const getBlogBySlug = async (slug: string) => {
  const blog = await prisma.blog.findFirst({
    where: {
      slug,
    },
    include: {
      user: {
        select: {
          fullName: true,
          username: true,
          image: true,
          updatedAt: true,
        },
      },
      tags: {
        select: {
          tag: true,
        },
      },
      likes: {
        select: {
          id: true,
          blogId: true,
          userId: true,
        },
      },
      saves: {
        select: {
          id: true,
          blogId: true,
          userId: true,
        },
      },
    },
  });

  return { success: blog ? true : false, blog: blog ?? null };
};
