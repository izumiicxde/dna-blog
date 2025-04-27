import { Link } from "@remix-run/react";

const AboutPage = () => {
  const stack = [
    { name: "Remix", description: "Framework used for building the website." },
    {
      name: "Prisma",
      description: "ORM for interacting with the MySQL database.",
    },
    { name: "MySQL", description: "Database for storing data." },
    {
      name: "TailwindCSS",
      description: "Utility-first CSS framework for styling.",
    },
    { name: "ShadCN", description: "Component library for UI components." },
    {
      name: "Tiptap",
      description: "Rich text editor for creating and editing content.",
    },
    { name: "Zod", description: "Data validation library." },
    { name: "Zustand", description: "State management library." },
  ];
  return (
    <div className="flex justify-center items-center w-full h-full">
      <div className="w-full h-full p-10 ">
        <h2 className="text-3xl font-bold">About DNA</h2>
        <p className="text-lg mb-4 pt-10">
          This is a simple Remix.js project built for a college project. The
          goal is to create a functional web application that showcases the use
          of modern web development tools and technologies. This project covers
          basic routing, data fetching, and dynamic content rendering with a
          focus on clean and efficient development.
        </p>

        <p className="text-lg mb-4">
          The technologies and tools used in this project include:
        </p>

        <ul className="list-disc pl-5">
          {stack.map((item, index) => (
            <li key={index}>
              <strong>{item.name}</strong>: {item.description}
            </li>
          ))}
        </ul>

        <p className="pt-5">
          This is an open source project available on{" "}
          <Link
            to={"https://github.com/adityax0/dna-blog"}
            target="_blank"
            className="text-indigo-800 hover:underline"
          >
            github
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AboutPage;
