import { Link, useFetcher } from "@remix-run/react";
import { Button } from "./ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { UserResponse } from "utils/types";
import { useUserStore } from "utils/store";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { uploadFileToServer } from "utils/uploadthing";
import AvatarComponent from "./avatar";

const Profile = () => {
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

  const handleUserAvatar = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    try {
      toast("Updating image");
      const file = event.target.files?.[0];
      if (!file) {
        toast("invalid change");
        return;
      }

      const response = await uploadFileToServer(file);
      if (response) {
        const res = await fetch("/user/update", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ url: response.url }),
        });
        const data = await res.json();
        if (data.success)
          fetcher.submit(null, { method: "POST", action: "/profile" });
        toast("profile picture updated successfully");
      }
    } catch (error) {
      toast(error instanceof Error ? error.message : "something went wrong");
    }
  };

  return (
    <>
      <Sheet
        open={openSheet}
        onOpenChange={() => setOpenSheet((prev) => !prev)}
      >
        <SheetTrigger>
          {user?.image ? (
            <AvatarComponent fallback={user.username} url={user.image} />
          ) : (
            <div className="size-9 bg-black rounded-full cursor-pointer" />
          )}
        </SheetTrigger>
        <SheetContent className="flex flex-col ">
          <SheetHeader className="">
            <SheetTitle className="flex gap-1  items-center select-none">
              <Button
                variant={"ghost"}
                className="hover:bg-none rounded-full"
                size={"icon"}
              >
                <Label htmlFor="avatar">
                  {user?.image ? (
                    <AvatarComponent
                      fallback={user.username}
                      url={user.image}
                    />
                  ) : (
                    <div className="size-9 bg-black rounded-full cursor-pointer" />
                  )}
                </Label>
                <Input
                  type="file"
                  id="avatar"
                  name="avatar"
                  accept="image/jpeg, image/jpg, image/png"
                  className="hidden"
                  onChange={handleUserAvatar}
                />
              </Button>

              <div className="flex flex-col pl-1 justify-start">
                <p className="text-sm "> {user?.username}</p>
                <p className="text-xs text-gray-500">{user?.fullName}</p>
              </div>
            </SheetTitle>
          </SheetHeader>
          <div className="pt-10 ">
            {user?.Blog && user?.Blog.length > 0 ? (
              <>
                <h2 className="font-bold">Recent Blogs</h2>
                <div className="flex gap-1 flex-col pt-5 ">
                  {user.Blog.map((blog) => (
                    <Button
                      key={blog.id}
                      variant={"ghost"}
                      className="text-sm text-left flex justify-start truncate max-w-xl p-0 lg:p-2"
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
    </>
  );
};

export default Profile;
