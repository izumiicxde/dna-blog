export interface DisplayBlog {
  id: string;
  title: string;
  body: string;
  coverImage: string;
  slug: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  user: User;
  tags: Tag[];
  likes: any[];
  saves: any[];
}

export interface User {
  fullName: string;
  username: string;
  image: any;
  updatedAt: string;
}

export interface Tag {
  tag: Tag2;
}

export interface Tag2 {
  id: string;
  name: string;
}

export type LikeBlogRequest = {
  userId: string;
  blogId: string;
};

// USER request for profile
export type UserResponse = {
  message: string;
  success: boolean;
  user: ProfileUser;
};
export interface ProfileUser {
  email: string;
  fullName: string;
  image: any;
  username: string;
  Blog: DisplayBlog[];
}
