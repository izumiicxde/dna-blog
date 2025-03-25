import { Outlet } from "@remix-run/react";
import Navbar from "~/components/navbar";

const CreateLayout = () => {
  return (
    <div className="w-screen overflow-x-hidden h-screen ">
      {/* <Navbar /> */}
      <Outlet />
    </div>
  );
};

export default CreateLayout;
