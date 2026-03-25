import { X } from "lucide-react";

interface SelectedTagProps {
  label: string;
  onRemove: () => void;
  color?: "green" | "orange";
}

export function SelectedTag({ label, onRemove, color = "green" }: SelectedTagProps) {
  const colors = {
    green: "bg-[#00b70d]/10 text-[#00b70d]",
    orange: "bg-[#ff5900]/10 text-[#ff5900]",
  };
  
  return (
    <div className={`flex items-center gap-2 ${colors[color]} px-3 py-1.5 rounded-full`}>
      <span className="text-sm font-medium">{label}</span>
      <button onClick={onRemove} className={`hover:bg-opacity-20 rounded-full p-0.5`}>
        <X className="size-4" />
      </button>
    </div>
  );
}


