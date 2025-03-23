import { Outlet } from "@remix-run/react";
import Absolutegradient from "~/components/absolute-gradient";
import AuthLayoutContent from "~/components/auth-layout";

export default function AuthLayout() {
  return (
    <div className="w-screen h-screen overflow-hidden flex justify-center items-center relative font-poppins ">
      <Absolutegradient />
      <div className="z-20 absolute inset-0 backdrop-blur-3xl w-screen h-screen flex">
        <AuthLayoutContent />
        <div className="w-full px-10 lg:px-0 lg:w-1/2 lg:h-screen h-fit pt-10 lg:pt-0 bg-transparent flex justify-center items-center">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
