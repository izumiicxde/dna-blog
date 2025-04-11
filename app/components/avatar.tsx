import { cn } from "~/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

const AvatarComponent = ({
  url,
  fallback,
  className,
}: {
  url: string;
  fallback: string;
  className?: string;
}) => {
  return (
    <Avatar className="w-fit h-full flex justify-center items-center">
      <AvatarImage src={url} className={cn("size-9 rounded-full", className)} />
      <AvatarFallback className="text-xs">{fallback}</AvatarFallback>
    </Avatar>
  );
};

export default AvatarComponent;
