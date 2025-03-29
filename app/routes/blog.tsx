import { Outlet } from "@remix-run/react";

const CreateLayout = () => {
  return (
    <div className="w-full h-auto">
      <Outlet />
    </div>
  );
};

export default CreateLayout;
