"use client"; // This is needede because of the use of usePathName
import SelectProjectModal from "app/_components/project/selectProjectModal";
import { MenuIcon } from "app/_components/ui/icons";
import ReloadButton from "app/_components/ui/reloadButton";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { label: "Home", href: "/" },
  { label: "Projects", href: "/projects" },
  { label: "Runs", href: "/runs" },
  { label: "Resources", href: "/resources" },
];

const NagivationBar = () => {
  const pathName = usePathname();

  return (
    <nav className="bg-white border-gray-200 dark:bg-gray-900 dark:border-gray-700 dark:text-white sticky top-0 z-10">
      <div className="flex flex-wrap items-center justify-between mx-4 pt-2 pb-2 gap-4">
        <a href="/" className="space-x-3 rtl:space-x-reverse">
          <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">
            HELMET⛑️ Platform
          </span>
        </a>
        <SelectProjectModal />

        <div className="flex items-center flex-grow">
          <ReloadButton />
        </div>
        <button
          data-collapse-toggle="navbar-dropdown"
          type="button"
          className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
          aria-controls="navbar-dropdown"
          aria-expanded="false"
        >
          <span className="sr-only">Open main menu</span>
          <MenuIcon />
        </button>

        <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
          {links.map(({ label, href }) => {
            const isActive = href === pathName;
            return (
              <li key={label}>
                <Link
                  href={href}
                  className={`block py-2 pr-4 pl-3 ${
                    isActive ? "text-blue-700" : "text-gray-700"
                  } border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-primary-700 lg:p-0 dark:text-gray-400 lg:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-gray-700`}
                  aria-current="page"
                >
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
};

export default NagivationBar;
