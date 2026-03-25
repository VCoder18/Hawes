import { regionOptions } from "../../imports/constants";

interface RegionFilterProps {
  selectedRegion: string;
  onRegionChange: (region: string) => void;
}

export function RegionFilter({ selectedRegion, onRegionChange }: RegionFilterProps) {
  return (
    <div className="bg-bg-[#ff5900] rounded-xl p-4 space-y-4">
      <div>
        <h3 className="font-semibold text-text-[#00b70d] mb-2">Region</h3>
        <select
          value={selectedRegion}
          onChange={(e) => onRegionChange(e.target.value)}
          className="w-full px-4 py-2 border border-[#e2e8f0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00b70d] bg-white"
        >
          {regionOptions.map((region) => (
            <option key={region} value={region}>
              {region}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}


