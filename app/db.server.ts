import { PrismaClient, User } from "@prisma/client";
import { blogSchema, BlogSchema } from "utils/blog.schema";
import { compareHash, hashPassword } from "utils/password";
import { loginSchema, signupSchema } from "utils/user.schema";
import { z } from "zod";
import slugify from "slugify";
import { LikeBlogRequest } from "utils/types";
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

export const getUser = async (request: Request) => {
  const userId = await getUserFromSession(request);
  if (!userId) throw new Error("not authorized.");
  const user = await prisma.user.findFirst({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      fullName: true,
      image: true,
      username: true,
      Blog: true,
    },
    orderBy: { createdAt: "desc" },
  });
  if (!user) return { message: "No user found.", success: false, user: null };
  return { message: "user found successfully", user, success: true };
};

export const createBlog = async (BlogData: BlogSchema) => {
  const { success, data, error } = blogSchema.safeParse(BlogData);
  if (!success) throw Error(JSON.stringify(error.flatten().fieldErrors));
  if (!data.userId) throw Error("unauthorized");

  const { title, body, coverImage, tags } = data;
  const slug = slugify(title, {
    lower: true,
    strict: true,
    trim: true,
  });

  const blog = await prisma.blog.create({
    data: {
      title,
      body,
      coverImage,
      userId: data.userId,
      slug,
    },
  });

  if (tags) {
    const validTags = tags
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag !== "#" && tag !== "" && tag !== ",");

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

export const updateBlog = async (
  userId: string,
  blogId: string,
  BlogData: BlogSchema
) => {
  const { success, data, error } = blogSchema.safeParse(BlogData);
  if (!success) throw Error(JSON.stringify(error.flatten().fieldErrors));

  const { title, body, coverImage, tags } = data;
  const slug = slugify(title, {
    lower: true,
    strict: true,
    trim: true,
  });

  const blog = await prisma.blog.update({
    where: {
      id: blogId,
      userId,
    },
    data: {
      title,
      body,
      coverImage,
      userId,
      slug,
    },
  });

  if (tags) {
    const validTags = tags
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag !== "#" && tag !== "" && tag !== ",");

    for (const tagName of validTags) {
      let tag = await prisma.tag.findUnique({
        where: { name: tagName },
      });

      if (!tag) {
        tag = await prisma.tag.create({ data: { name: tagName } });
      }
      const existingBlogTag = await prisma.blogTag.findUnique({
        where: {
          blogId_tagId: {
            blogId: blogId,
            tagId: tag.id,
          },
        },
      });
      if (!existingBlogTag)
        await prisma.blogTag.create({
          data: { blogId: blog.id, tagId: tag.id },
        });
    }
  }

  return { status: true, message: "blog updated successfully", blog };
};

export const getBlogs = async (page: number = 1, pagesize: number = 10) => {
  const blogs = await prisma.blog.findMany({
    skip: (page - 1) * pagesize,
    take: pagesize,
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: {
          id: true,
          fullName: true,
          image: true,
          username: true,
        },
      },
      tags: {
        include: {
          tag: {
            select: {
              name: true,
              id: true,
            },
          },
        },
      },
      likes: true,
      saves: true,
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
          id: true,
          fullName: true,
          username: true,
          image: true,
          updatedAt: true,
        },
      },
      tags: {
        select: {
          tag: {
            select: {
              name: true,
              blogs: true,
            },
          },
        },
      },
      likes: true,
      saves: true,
    },
  });

  return { success: blog ? true : false, blog: blog ?? null };
};

export const getBlogById = async (id: string) => {
  const blog = await prisma.blog.findFirst({
    where: {
      id,
    },
    include: {
      user: {
        select: {
          id: true,
          fullName: true,
          username: true,
          image: true,
          updatedAt: true,
        },
      },
      tags: {
        select: {
          tag: {
            select: {
              name: true,
              blogs: true,
            },
          },
        },
      },
      likes: true,
      saves: true,
    },
  });

  return { success: blog ? true : false, blog: blog ?? null };
};

export const deleteBlogPost = async (blogId: string) => {
  try {
    await prisma.blogTag.deleteMany({ where: { blogId } });
    await prisma.blog.delete({ where: { id: blogId } });
    return { message: "Blog deleted successfully", status: true };
  } catch (error) {
    return {
      message:
        error instanceof Error ? error.message : "failed to delete message",
      status: false,
    };
  }
};

export const likeUnlikeBlogPost = async (userId: string, blogId: string) => {
  const existingLike = await prisma.like.findUnique({
    where: {
      userId_blogId: {
        userId,
        blogId,
      },
    },
  });

  if (existingLike) {
    await prisma.like.delete({
      where: {
        id: existingLike.id,
      },
    });
    return { status: true };
  } else {
    // not liked yet, so like it (create)
    await prisma.like.create({
      data: {
        userId,
        blogId,
      },
    });
    return { status: true };
  }
};

export const saveUnsaveBlogPost = async (userId: string, blogId: string) => {
  const existingSave = await prisma.save.findUnique({
    where: {
      userId_blogId: {
        userId,
        blogId,
      },
    },
  });

  if (existingSave) {
    await prisma.save.delete({
      where: {
        id: existingSave.id,
      },
    });
    return { status: true };
  } else {
    await prisma.save.create({
      data: {
        userId,
        blogId,
      },
    });
    return { status: true };
  }
};
