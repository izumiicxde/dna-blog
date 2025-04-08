import { Link } from "@remix-run/react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Search } from "lucide-react";
import Profile from "./profile";

const Navbar = ({ success }: { success: boolean }) => {
  return (
    <div className="flex w-full h-fit items-center justify-between lg:px-12 md:px-5 px-5 py-5 sticky  inset-0 z-50 bg-inherit">
      <div className="flex gap-10 items-center">
        <Link to={"/"}>
          <img src="/logo.svg" alt="logo" className="w-16" />
        </Link>
        {success && (
          <div className="hidden md:flex items-center border border-black px-2 rounded-md ">
            <>
              <Search className="size-4 group" />
              <Input
                placeholder="enter the search term"
                className="w-96 h-8 py-0 border-none outline-none focus:outline-none focus:border-none focus:ring-0 focus-visible:ring-none focus-visible:outline-none focus-visible:ring-0 shadow-none group"
              />
            </>
          </div>
        )}
      </div>

      <div className="flex gap-4 items-center">
        <>
          {success ? (
            <>
              <Button variant={"outline"} asChild>
                <Link to={"/blog/create"}>Create Post</Link>
              </Button>

              <Profile>
                <div className="size-9 rounded-full bg-black cursor-pointer" />
              </Profile>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant={"outline"} asChild>
                <Link to={"/login"}>Login</Link>
              </Button>
              <Button variant={"secondary"} asChild>
                <Link to={"/signup"}>Create Account</Link>
              </Button>
            </div>
          )}
        </>
      </div>
    </div>
  );
};

export default Navbar;
