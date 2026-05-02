import { useState } from "react";
import { StepHeader } from "@/components/CreateTrip/StepHeader";
import { includedOptions } from "@/imports/constants";
import {
  Hotel,
  Car,
  Utensils,
  Users,
  Backpack,
  Check,
  X,
  Plus,
  Zap,
  Package,
} from "lucide-react";
import type { TripData } from "@/imports/types";

interface Step5Props {
  tripData: TripData;
  onToggleIncluded: (item: string) => void;
  onAddWhatToBring: (item: string) => void;
  onRemoveWhatToBring: (item: string) => void;
  onAddCustomIncluded: (item: string) => void;
  onRemoveCustomIncluded: (item: string) => void;
  onAddExcluded: (item: string) => void;
  onRemoveExcluded: (item: string) => void;
}

export function Step5Logistics({
  tripData,
  onToggleIncluded,
  onAddWhatToBring,
  onRemoveWhatToBring,
  onAddCustomIncluded,
  onRemoveCustomIncluded,
  onAddExcluded,
  onRemoveExcluded,
}: Step5Props) {
  const [newCustomItem, setNewCustomItem] = useState("");
  const [newNotIncludedItem, setNewNotIncludedItem] = useState("");
  const [newWhatToBringItem, setNewWhatToBringItem] = useState("");
  const customItems = tripData.included.filter((item) => !includedOptions.includes(item));
  const premadeIncluded = tripData.included.filter((item) => includedOptions.includes(item));
  const customExcluded = tripData.excluded;
  return (
    <div className="space-y-6">
      <StepHeader
        title="Logistics"
        description="Specify what's included and what participants should bring"
      />

      <div>
        <label className="block font-semibold text-text-[#00b70d] mb-3">
          What's Included
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {includedOptions.map((item) => {
            const icons: Record<string, any> = {
              Accommodation: Hotel,
              Transport: Car,
              Meals: Utensils,
              Guide: Users,
              Equipment: Backpack,
              Insurance: Check,
              Entertainment: Zap,
              Miscellaneous: Package,
            };
            const Icon = icons[item];
            return (
              <button
                key={item}
                onClick={() => onToggleIncluded(item)}
                className={`px-4 py-3 rounded-xl font-medium transition-all flex items-center gap-2 ${
                  tripData.included.includes(item)
                    ? "bg-[#00b70d] text-white"
                    : "bg-bg-[#ff5900] text-text-[#00b70d] hover:bg-[#e2e8f0]"
                }`}
              >
                <Icon className="size-5" />
                <span className="break-words">{item}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="block font-semibold text-text-[#00b70d] mb-3">
            ✓ Included
          </label>
          <div className="space-y-3">
            <div className="space-y-3 bg-[#00b70d]/5 p-4 rounded-xl">
              {tripData.included.length > 0 ? (
                <>
                  {premadeIncluded.length > 0 && (
                    <ul className="space-y-2">
                      {premadeIncluded.map((item) => (
                        <li key={item} className="flex items-start gap-2 text-[#00b70d] break-words">
                          <Check className="size-5 flex-shrink-0" />
                          <span className="break-words min-w-0">{item}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  {premadeIncluded.length > 0 && customItems.length > 0 && (
                    <hr className="border-[#00b70d]/30" />
                  )}
                  {customItems.length > 0 && (
                    <ul className="space-y-2">
                      {customItems.map((item) => (
                        <li key={item} className="flex items-start justify-between gap-2 text-[#00b70d] group break-words">
                          <span className="flex items-start gap-2 min-w-0 break-words">
                            <Check className="size-5 flex-shrink-0" />
                            <span className="break-words min-w-0">{item}</span>
                          </span>
                          <button
                            onClick={() => onRemoveCustomIncluded(item)}
                            className="p-1 text-[#ff5900] opacity-0 group-hover:opacity-100 hover:bg-[#ff5900]/10 rounded transition-all flex-shrink-0"
                          >
                            <X className="size-4" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              ) : (
                <div className="text-[#9ca3af]">Nothing selected</div>
              )}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add custom item..."
                value={newCustomItem}
                onChange={(e) => setNewCustomItem(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter" && newCustomItem.trim()) {
                    onAddCustomIncluded(newCustomItem.trim());
                    setNewCustomItem("");
                  }
                }}
                className="flex-1 px-3 py-2 border border-[#e2e8f0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00b70d] text-sm"
              />
              <button
                onClick={() => {
                  if (newCustomItem.trim()) {
                    onAddCustomIncluded(newCustomItem.trim());
                    setNewCustomItem("");
                  }
                }}
                className="px-3 py-2 bg-[#00b70d] text-white rounded-lg font-medium hover:bg-[#00b70d]/90 transition-colors flex items-center gap-1"
              >
                <Plus className="size-4" />
              </button>
            </div>
          </div>
        </div>

        <div>
          <label className="block font-semibold text-text-[#ff5900] mb-3">
            ✗ Not Included
          </label>
          <div className="space-y-3">
            <div className="space-y-3 bg-[#ff5900]/5 p-4 rounded-xl">
              {customExcluded.length > 0 ? (
                <>
                  {customExcluded.length > 0 && (
                    <ul className="space-y-2">
                      {customExcluded.map((item) => (
                        <li key={item} className="flex items-start justify-between gap-2 text-[#ff5900] group break-words">
                          <span className="flex items-start gap-2 min-w-0 break-words">
                            <X className="size-5 flex-shrink-0" />
                            <span className="break-words min-w-0">{item}</span>
                          </span>
                          <button
                            onClick={() => onRemoveExcluded(item)}
                            className="p-1 text-[#ff5900] opacity-0 group-hover:opacity-100 hover:bg-[#ff5900]/10 rounded transition-all flex-shrink-0"
                          >
                            <X className="size-4" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              ) : (
                <div className="text-[#9ca3af]">Nothing added</div>
              )}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add custom item..."
                value={newNotIncludedItem}
                onChange={(e) => setNewNotIncludedItem(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter" && newNotIncludedItem.trim()) {
                    onAddExcluded(newNotIncludedItem.trim());
                    setNewNotIncludedItem("");
                  }
                }}
                className="flex-1 px-3 py-2 border border-[#e2e8f0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff5900] text-sm"
              />
              <button
                onClick={() => {
                  if (newNotIncludedItem.trim()) {
                    onAddExcluded(newNotIncludedItem.trim());
                    setNewNotIncludedItem("");
                  }
                }}
                className="px-3 py-2 bg-[#ff5900] text-white rounded-lg font-medium hover:bg-[#ff5900]/90 transition-colors flex items-center gap-1"
              >
                <Plus className="size-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div>
        <label className="block font-semibold text-text-[#00b70d] mb-3">
          What Participants Should Bring
        </label>
        <div className="space-y-3">
          <div className="space-y-3 bg-[#00b70d]/5 p-4 rounded-xl">
            {tripData.whatToBring.length > 0 ? (
              <ul className="space-y-2">
                {tripData.whatToBring.map((item) => (
                  <li key={item} className="flex items-start justify-between gap-2 text-[#00b70d] group break-words">
                    <span className="flex items-start gap-2 min-w-0 break-words">
                      <Backpack className="size-5 flex-shrink-0" />
                      <span className="break-words min-w-0">{item}</span>
                    </span>
                    <button
                      onClick={() => onRemoveWhatToBring(item)}
                      className="p-1 text-[#ff5900] opacity-0 group-hover:opacity-100 hover:bg-[#ff5900]/10 rounded transition-all flex-shrink-0"
                    >
                      <X className="size-4" />
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-[#9ca3af]">No items yet</div>
            )}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Add item to bring..."
              value={newWhatToBringItem}
              onChange={(e) => setNewWhatToBringItem(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter" && newWhatToBringItem.trim()) {
                  onAddWhatToBring(newWhatToBringItem.trim());
                  setNewWhatToBringItem("");
                }
              }}
              className="flex-1 px-3 py-2 border border-[#e2e8f0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00b70d] text-sm"
            />
            <button
              onClick={() => {
                if (newWhatToBringItem.trim()) {
                  onAddWhatToBring(newWhatToBringItem.trim());
                  setNewWhatToBringItem("");
                }
              }}
              className="px-3 py-2 bg-[#00b70d] text-white rounded-lg font-medium hover:bg-[#00b70d]/90 transition-colors flex items-center gap-1"
            >
              <Plus className="size-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
