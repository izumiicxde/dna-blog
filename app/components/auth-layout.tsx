import Logo from "./logo";

const siteInfo = [
  {
    heading: "Your Developer Hub",
    para: "DNA is a platform where developers share insights, discuss ideas, and grow together. Write blogs, engage with the community, and stay ahead in tech.",
  },
  {
    heading: "A Community for Developers",
    para: "Publish your thoughts, explore new technologies, and be part of a thriving developer community on DNA.",
  },
];

export default function AuthLayoutContent() {
  return (
    <div className="w-1/2 lg:h-screen hidden lg:flex flex-col items-center justify-start pt-20 bg-transparent select-none ">
      <Logo />
      <p className="text-md pt-3 font-medium ">
        Join us today and unlock new possibilities
      </p>
      <div className="flex flex-col pl-16 justify-center pt-20">
        <h1 className="text-5xl text-left font-black ">Write. Share. Grow.</h1>
        {siteInfo.map((info, index) => (
          <div key={index} className="pt-5">
            <h3 className="text-xl font-bold">{info.heading}</h3>
            <p>{info.para}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
