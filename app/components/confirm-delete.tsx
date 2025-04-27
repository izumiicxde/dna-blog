import React from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Button } from "./ui/button";
import { useParams } from "@remix-run/react";
import { toast } from "sonner";

const ConfirmDelete = ({ children }: { children: React.ReactNode }) => {
  const params = useParams();
  const blogId = params.blogId;
  const handleBlogDelete = () => {
    try {
      if (!blogId) toast("failed to delete blog");
    } catch (error) {
      toast(error instanceof Error ? error.message : "failed to delete blog");
    }
  };

  return (
    <Dialog>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you sure you want to delete the blog?</DialogTitle>
          <DialogDescription>This action cannot be undone.</DialogDescription>
        </DialogHeader>
      </DialogContent>
      <DialogFooter>
        <DialogClose asChild>
          <Button type="button" variant="secondary">
            Cancel
          </Button>
          <Button onClick={handleBlogDelete}>Confirm</Button>
        </DialogClose>
      </DialogFooter>
    </Dialog>
  );
};

export default ConfirmDelete;
