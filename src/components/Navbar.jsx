import { Link } from "react-router-dom";
import logo from "../assets/quiz_logo.svg";

export default function Navbar() {
  return (
    <nav className="bg-nav">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <img src={logo} alt="Quiz Logo" className="h-8" />
          <span className="text-xl font-bold text-blue-600">QuizLead</span>
        </Link>
        <div className="text-[#5735E1] hidden md:flex space-x-6 text-sm font-medium">
          <Link to="/" className="hover:text-blue-600 mt-2 ">
            Quiz
          </Link>
          <Link to="/about" className="hover:text-blue-600 mt-2">
            About
          </Link>
          <Link to="/pricing" className="hover:text-blue-600 m-2">
            Pricing
          </Link>
          <Link
            to="/account"
            className="ml-10 px-4 py-1 capsule border border-blue-600 text-blue-600 rounded hover:bg-blue-50 text-sm"
          >
            Create Quiz
          </Link>
        </div>
      </div>
    </nav>
  );
}
