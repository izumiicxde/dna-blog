import {
  Link,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useRouteError,
} from "@remix-run/react";
import type { LinksFunction, LoaderFunctionArgs } from "@remix-run/node";

import "./tailwind.css";
import { Toaster } from "./components/ui/sonner";
import { Button } from "./components/ui/button";
import { getUserFromSession } from "./services/session.server";
import Navbar from "./components/navbar";

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Boldonse&display=swap",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Poppins:wght@200;300;400;500;600;700;800;900&display=swap",
  },
];

export async function loader({ request }: LoaderFunctionArgs) {
  const userId = await getUserFromSession(request);
  return Response.json(
    { success: userId ? true : false },
    { status: userId?.id ? 200 : 400 }
  );
}

export function Layout({ children }: { children: React.ReactNode }) {
  const { success } = useLoaderData<typeof loader>();

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Navbar success={success} />
        <Toaster />
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  if (!error) return null;

  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center text-gray-900">
      <h1 className="text-8xl font-extrabold uppercase tracking-widest">
        OOPS!!
      </h1>
      <p className="text-lg mt-4 text-gray-700">
        Something went wrong. Please try again.
      </p>
      <Button
        asChild
        variant="secondary"
        className="mt-6 px-12 py-3 text-lg border border-gray-400 hover:border-gray-600"
      >
        <Link to="/">Return Home</Link>
      </Button>
    </div>
  );
}

export default function App() {
  return <Outlet />;
}
