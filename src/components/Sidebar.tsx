import { Link, useLocation } from "react-router-dom";

interface SidebarProps {
  onClose?: () => void;
}

const Sidebar = ({ onClose }: SidebarProps) => {
  const location = useLocation();

  const links = [
    { path: "/dashboard", label: "Dashboard", icon: "📊" },
    { path: "/vendors", label: "Vendors", icon: "🏪" },
  ];

  const handleLinkClick = () => {
    onClose?.();
  };

  return (
    <div className="w-64 bg-gray-900 text-white h-screen flex flex-col">
      {/* Logo Section */}
      <div className="p-4 md:p-6">
        <h1 className="text-xl md:text-2xl font-bold whitespace-nowrap">Admin Dashboard</h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 mt-4 md:mt-8 px-0 py-0 overflow-y-auto">
        {links.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            onClick={handleLinkClick}
            className={`flex items-center px-4 md:px-6 py-3 md:py-4 text-base md:text-lg transition-colors whitespace-nowrap ${
              location.pathname === link.path
                ? "bg-blue-600 border-l-4 border-blue-400"
                : "hover:bg-gray-800"
            }`}
          >
            <span className="mr-3 text-lg">{link.icon}</span>
            {link.label}
          </Link>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 md:p-6 border-t border-gray-700 text-xs md:text-sm text-gray-400">
        <p className="truncate">v1.0.0</p>
      </div>
    </div>
  );
};

export default Sidebar;
