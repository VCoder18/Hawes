import svgPaths from "@/imports/svg_paths";
import { recommendedItems } from "@/imports/constants";

export function RecommendedCard() {
  return (
    <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm p-5">
      <h3 className="font-bold text-text-[#00b70d] mb-4">Recommended for You</h3>
      <div className="space-y-4">
        {recommendedItems.map((item) => (
          <div key={item.id}>
            <div className="h-28 rounded-lg overflow-hidden bg-[#e2e8f0] mb-2">
              <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
            </div>
            <h4 className="font-bold text-sm text-text-[#00b70d] mb-1">{item.title}</h4>
            <p className="text-xs text-text-[#ff5900]">{item.description}</p>
            <div className="mt-1 flex items-center gap-1">
              <span className="text-xs font-bold">{item.rating}</span>
              <svg className="size-2.5" fill="none" viewBox="0 0 8.33333 7.91667">
                <path d={svgPaths.p31e60680} fill="#F97316" />
              </svg>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


