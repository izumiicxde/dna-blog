import { useParams } from "@remix-run/react";

const BlogDisplayPage = () => {
  const { slug } = useParams();
  return <div>{slug}</div>;
};

export default BlogDisplayPage;
