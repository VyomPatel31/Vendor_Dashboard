interface Props {
  title: string;
  value: string | number;
  icon?: React.ComponentType<any>;
  color?: string;
}

const StatCard = ({ title, value, icon: Icon, color = "bg-blue-100" }: Props) => {
  const colorClasses: Record<string, string> = {
    "bg-blue-100": "text-blue-600",
    "bg-green-100": "text-green-600",
    "bg-yellow-100": "text-yellow-600",
    "bg-red-100": "text-red-600",
    "bg-purple-100": "text-purple-600",
    "bg-indigo-100": "text-indigo-600",
    "bg-pink-100": "text-pink-600",
    "bg-orange-100": "text-orange-600",
  };

  const textColor = colorClasses[color] || "text-blue-600";

  return (
    <div className="bg-white shadow-md rounded-lg p-4 md:p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-xs md:text-sm text-gray-600 font-medium truncate">{title}</p>
          <p className="text-lg md:text-2xl font-bold text-gray-900 mt-2 break-words">{value}</p>
        </div>
        {Icon && (
          <div className={`${color} rounded-lg p-2 md:p-3 flex-shrink-0 ml-2`}>
            <Icon className={`w-5 h-5 md:w-6 md:h-6 ${textColor}`} />
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
