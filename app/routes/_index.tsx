import { data, redirect, type MetaFunction } from "@remix-run/node";
import { getUserSession } from "~/services/session.server";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export async function loader({ request }: { request: Request }) {
  const session = await getUserSession(request);
  const user = session.get("user");
  if (!user) throw redirect("/login");
  return data(null);
}
export default function Index() {
  return <div className="">Hello authenticated user?</div>;
}
