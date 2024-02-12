import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Modal({ func, backRef }) {
  const router = useRouter();

  const handler = async (event) => {
    console.log("handling deletion");
    event.preventDefault();
    await func();
    router.push(backRef);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-hidden h-full w-full flex items-center justify-center">
      <div className="p-8 border w-96 shadow-lg rounded-md bg-white">
        <div className="text-center">
          <h3 className="text-2xl font-bold text-gray-900">Delete run?</h3>
          <div className="mt-2 px-7 py-3">
            <p className="text-gray-500">
              Are you sure you want to delete this run?
            </p>
          </div>
          <div className="flex justify-center mt-4 gap-4">
            {/* Navigates back to the base URL - closing the modal */}
            <Link
              href={backRef}
              className="px-4 py-2 bg-green-500 text-white text-base font-medium rounded-md shadow-sm hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
            >
              Keep
            </Link>
            <button
              onClick={handler}
              className="px-4 py-2 bg-red-500 text-white text-base font-medium rounded-md shadow-sm hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
