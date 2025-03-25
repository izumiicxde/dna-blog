import { LoaderFunctionArgs, type MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import Navbar from "~/components/navbar";
import { getUserFromSession } from "~/services/session.server";

export const meta: MetaFunction = () => {
  return [
    { title: "DNA Blog" },
    { name: "description", content: "Welcome to dna blog" },
  ];
};

export default function Index() {
  return <div className=""></div>;
}
