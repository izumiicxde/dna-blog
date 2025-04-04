import { Link, useFetcher } from "@remix-run/react";
import { Button } from "./ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { ProfileUser, UserResponse } from "utils/types";
import { useUserStore } from "utils/store";

const Profile = ({ children }: { children: React.ReactNode }) => {
  const fetcher = useFetcher();
  const { user, setUser } = useUserStore();
  const [openSheet, setOpenSheet] = useState(false);

  useEffect(() => {
    if (!user) fetcher.submit(null, { method: "POST", action: "/profile" });
    if (fetcher.data) {
      const data = fetcher.data as UserResponse;
      if (data.user) setUser(data.user);
    }
  }, [fetcher.data]);

  const logout = () => {
    try {
      setUser(null);
      fetcher.submit(null, { method: "POST", action: "/logout" });
    } catch (error) {
      toast(
        error instanceof Error
          ? error.message
          : "something went wrong, try again later."
      );
    }
  };

  return (
    <Sheet open={openSheet} onOpenChange={() => setOpenSheet((prev) => !prev)}>
      <SheetTrigger> {children} </SheetTrigger>
      <SheetContent className="flex flex-col ">
        <SheetHeader className="">
          <SheetTitle className="flex gap-1  items-center select-none">
            <Button
              variant={"ghost"}
              className="hover:bg-none rounded-full "
              size={"icon"}
            >
              {user?.image ? (
                <img src={user?.image} alt="" className="cursor-pointer" />
              ) : (
                <div className="size-9 bg-black rounded-full cursor-pointer" />
              )}
            </Button>

            <div className="flex flex-col pl-1 justify-start">
              <p className="text-sm"> {user?.username}</p>
              <p className="text-xs text-gray-500">{user?.fullName}</p>
            </div>
          </SheetTitle>
        </SheetHeader>
        <div className="pt-10 ">
          {user?.Blog && user?.Blog.length > 0 ? (
            <>
              <h2 className="font-bold">Recent Blogs</h2>
              <div className="flex gap-1 flex-col pt-5">
                {user.Blog.map((blog) => (
                  <Button
                    variant={"ghost"}
                    className="text-sm text-left flex justify-start"
                    asChild
                  >
                    <Link
                      to={`blog/${blog.slug}`}
                      onClick={() => setOpenSheet(false)}
                    >
                      {blog.title}
                    </Link>
                  </Button>
                ))}
              </div>
            </>
          ) : (
            <p className="text-sm text-center w-full h-full justify-center items-center flex min-h-[50vh] text-gray-500">
              No recent blogs
            </p>
          )}
        </div>
        <div className="absolute bottom-3 left-4">
          <Button variant={"ghost"} onClick={logout}>
            Logout
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default Profile;
