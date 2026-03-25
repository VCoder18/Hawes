import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function PaginationControls({ currentPage, totalPages, onPageChange }: PaginationControlsProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2">
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="p-2 border border-[#e2e8f0] rounded-lg hover:bg-bg-[#ff5900] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ChevronLeft className="size-5" />
      </button>
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-3 py-1.5 rounded-lg font-medium ${
            currentPage === page
              ? "bg-[#00b70d] text-white"
              : "bg-bg-[#ff5900] text-text-[#00b70d] hover:bg-[#e2e8f0]"
          }`}
        >
          {page}
        </button>
      ))}
      <button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="p-2 border border-[#e2e8f0] rounded-lg hover:bg-bg-[#ff5900] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ChevronRight className="size-5" />
      </button>
    </div>
  );
}


