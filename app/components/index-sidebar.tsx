import { Link } from "@remix-run/react";
import { sidebarLinks, socials } from "utils/homepage";

const IndexSidebar = ({ authenticated }: { authenticated: boolean }) => {
  return (
    <>
      <div className="flex flex-col w-full h-auto">
        {sidebarLinks?.map((item) => (
          <Link
            key={item.text}
            to={authenticated ? item.link : "/login"}
            className="w-full p-2 flex gap-4 items-center hover:bg-blue-300/10 rounded-lg group"
          >
            <span className="text-xl">{item.emoji}</span>
            <span className="group-hover:underline">{item.text}</span>
          </Link>
        ))}
      </div>
      {/* SOCIAL LINKS */}
      <div className="flex gap-3 pt-10 flex-wrap">
        {socials?.map((social) => (
          <Link
            to={social.link}
            key={social.link}
            className="p-2 hover:bg-blue-300/20 hover:text-blue-500 rounded-lg"
          >
            {<social.icon className="size-6" />}
          </Link>
        ))}
      </div>
    </>
  );
};

export default IndexSidebar;
