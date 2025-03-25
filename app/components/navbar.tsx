import { Link } from "@remix-run/react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Search } from "lucide-react";

export default function Navbar() {
  return (
    <div className="flex w-full h-fit items-center justify-between px-12 py-5">
      <div className="flex gap-10 items-center">
        <img src="/logo.svg" alt="logo" className="w-16" />
        <div className="flex items-center gap-1 group group-focus:border border-black">
          <Search className="size-4" />
          <Input
            placeholder="enter the search term"
            className="w-96 h-8 py-0 group-focus:border-none border-none outline-none focus:outline-none focus:border-none focus:ring-0 focus-visible:ring-none focus-visible:outline-none"
          />
        </div>
      </div>

      <div className="flex gap-4 items-center">
        <Button variant={"outline"}>Create Post</Button>

        <Link to="/profile">
          <div className="size-9 rounded-full bg-black cursor-pointer" />
        </Link>
      </div>
    </div>
  );
}
