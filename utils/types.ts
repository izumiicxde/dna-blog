export type DisplayBlog = {
  title: string;
  body: string;
  coverImage: string;
  createdAt: Date;
  updatedAt: Date;
  user: {
    fullName: string;
    username: string;
    image: string;
  };
};
