import { MapPin, X } from "lucide-react";

interface MeetingLocationItemProps {
  location: string;
  time: string;
  onRemove: () => void;
}

export function MeetingLocationItem({ location, time, onRemove }: MeetingLocationItemProps) {
  return (
    <div className="flex items-center gap-2 bg-bg-[#ff5900] p-3 rounded-lg">
      <MapPin className="size-4 text-text-[#ff5900] shrink-0" />
      <div className="flex-1">
        <span className="font-medium text-text-[#00b70d]">{location}</span>
        <span className="text-text-[#ff5900] ml-2">{time}</span>
      </div>
      <button onClick={onRemove} className="p-1 hover:bg-[#e2e8f0] rounded">
        <X className="size-4 text-text-[#ff5900]" />
      </button>
    </div>
  );
}


