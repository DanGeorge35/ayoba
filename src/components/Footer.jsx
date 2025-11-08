import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="absolute bottom-4 w-full grid grid-cols-12">
      <div className="col-span-10 col-start-2 bg-gray-800 px-4 py-6 text-center text-sm text-gray-600 flex flex-col items-center space-y-3">
        <div className="flex space-x-6 links">
          <Link
            to="/privacy"
            className="text-white hover:text-gray-200 font-bold"
          >
            Privacy Policy
          </Link>

          <Link
            to="/terms"
            className="text-white hover:text-gray-200 font-bold"
          >
            Terms of Service
          </Link>
        </div>
      </div>
    </footer>
  );
}
