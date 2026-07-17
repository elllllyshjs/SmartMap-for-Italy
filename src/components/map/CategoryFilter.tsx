import { CATEGORY_CONFIGS } from "../../config/constants";
import { useMapStore } from "../../store/useMapStore";

export default function CategoryFilter() {
  const activeCategory = useMapStore((s) => s.activeCategory);
  const setActiveCategory = useMapStore((s) => s.setActiveCategory);

  return (
    <div className="flex gap-2">
      {CATEGORY_CONFIGS.map((config) => {
        const isActive = activeCategory === config.id;
        return (
          <button
            key={config.id}
            onClick={() => setActiveCategory(config.id)}
            className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
              isActive
                ? "text-white shadow"
                : "bg-white text-gray-600 shadow-sm hover:bg-gray-50"
            }`}
            style={isActive ? { backgroundColor: config.color } : undefined}
          >
            {config.label}
          </button>
        );
      })}
    </div>
  );
}
