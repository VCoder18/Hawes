import { Plus, Minus } from "lucide-react";

interface ParticipantControlProps {
  label: string;
  value: number;
  onIncrement: () => void;
  onDecrement: () => void;
  onChange: (value: number) => void;
}

export function ParticipantControl({ label, value, onIncrement, onDecrement, onChange }: ParticipantControlProps) {
  return (
    <div className="w-full">
      <label className="block font-semibold text-text-[#00b70d] mb-2">
        {label} <span className="text-red-500">*</span>
      </label>
      <div className="flex items-center gap-2 w-full">
        <button
          onClick={onDecrement}
          className="p-2 bg-bg-[#ff5900] hover:bg-[#e2e8f0] rounded-lg transition-colors shrink-0"
        >
          <Minus className="size-5" />
        </button>
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value) || value)}
          className="flex-1 min-w-0 px-4 py-3 border border-[#e2e8f0] rounded-xl text-center font-bold text-lg focus:outline-none focus:ring-2 focus:ring-[#00b70d]"
        />
        <button
          onClick={onIncrement}
          className="p-2 bg-bg-[#ff5900] hover:bg-[#e2e8f0] rounded-lg transition-colors shrink-0"
        >
          <Plus className="size-5" />
        </button>
      </div>
    </div>
  );
}


