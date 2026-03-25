import React from "react";
import { Edit2 } from "lucide-react";

interface ReviewSectionProps {
  title: string;
  onEdit: () => void;
  content: React.ReactNode;
}

export function ReviewSection({
  title,
  onEdit,
  content,
}: ReviewSectionProps) {
  return (
    <div className="bg-bg-[#ff5900] rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-semibold text-text-[#00b70d]">{title}</h4>
        <button
          onClick={onEdit}
          className="flex items-center gap-1 text-sm text-[#00b70d] hover:text-[#00a00c] font-medium"
        >
          <Edit2 className="size-4" />
          Edit
        </button>
      </div>
      {content}
    </div>
  );
}


