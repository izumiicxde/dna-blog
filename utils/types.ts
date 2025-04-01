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
