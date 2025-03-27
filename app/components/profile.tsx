import { useFetcher } from "@remix-run/react";
import { Button } from "./ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { useEffect } from "react";
import { toast } from "sonner";

const Profile = ({ children }: { children: React.ReactNode }) => {
  const fetcher = useFetcher();
  const logout = () => {
    fetcher.submit(null, { method: "POST", action: "/logout" });
  };

  return (
    <Sheet>
      <SheetTrigger> {children} </SheetTrigger>
      <SheetContent className="flex flex-col justify-between ">
        <SheetHeader className="">
          <SheetTitle>User name here</SheetTitle>
          <SheetDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </SheetDescription>
        </SheetHeader>
        <div className="">
          <Button variant={"ghost"} onClick={logout}>
            {" "}
            Logout
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default Profile;
