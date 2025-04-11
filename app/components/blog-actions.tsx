import { Edit3, Trash2Icon } from "lucide-react";
import { ReactNode } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Button } from "./ui/button";
import { Link } from "@remix-run/react";

export const BlogActions = ({
  children,
  blogId,
}: {
  children: ReactNode;
  blogId: string;
}) => {
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
        <DropdownMenuItem className="flex gap-2">
          <Trash2Icon className="size-4" /> <span>Delete</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
