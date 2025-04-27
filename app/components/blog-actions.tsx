import { Edit3, Trash2Icon } from "lucide-react";
import { ReactNode, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { json, Link, useNavigate } from "@remix-run/react";
import { toast } from "sonner";

type DeleteBlogResponse = {
  message: string;
  status: boolean;
};

export const BlogActions = ({
  children,
  blogId,
  slug,
}: {
  children: ReactNode;
  blogId: string;
  slug: string;
}) => {
  const navigator = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleBlogDelete = async () => {
    try {
      const response = await fetch(`/blog/${slug}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ blogId }),
      });
      // const data: DeleteBlogResponse = await response.json();

      if (response.ok) {
        toast("blog deleted successfully");
        navigator("/");
      } else toast("failed to delete blog........");
    } catch (error) {
      toast("failed to delete blog");
    } finally {
      // navigator("/");
      setIsSubmitting(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>{children}</DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Blog Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild className="flex gap-2">
          <Link to={`/blog/edit/${blogId}`}>
            <Edit3 className="size-4" /> <span>Edit</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="flex gap-2"
          onClick={handleBlogDelete}
          disabled={isSubmitting}
        >
          <Trash2Icon className="size-4" />
          <span>Delete</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
