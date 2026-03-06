import { NavLink, useNavigate } from "react-router-dom";

export default function TrainerNavbar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const linkClass = ({ isActive }) =>
    `px-4 py-2 rounded-lg text-sm font-semibold transition
     ${
       isActive
         ? "bg-indigo-100 text-indigo-600"
         : "text-gray-600 hover:text-indigo-600"
     }`;

  return (
    <nav className="bg-white border-b border-gray-200 px-10 py-4 flex justify-between items-center sticky top-0 z-50">

      {/* Brand */}
      <div className="flex items-center gap-8">
        <h1 className="text-2xl font-bold text-indigo-600">
          SkillQuest
        </h1>

        <NavLink to="/trainer" className={linkClass}>
          My Modules
        </NavLink>
      </div>

      {/* Right */}
      <button
        onClick={logout}
        className="text-sm font-semibold text-red-500 hover:text-red-600"
      >
        Logout
      </button>
    </nav>
  );
}