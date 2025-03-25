import { data, redirect, type MetaFunction } from "@remix-run/node";
import { getUserFromSession } from "~/services/session.server";

export const meta: MetaFunction = () => {
  return [
    { title: "DNA Blog" },
    { name: "description", content: "Welcome to dna blog" },
  ];
};

export async function loader({ request }: { request: Request }) {
  const userId = await getUserFromSession(request);
  if (!userId) throw redirect("/login");
  return data(null);
}
export default function Index() {
  return <div className=""></div>;
}
