import { useState } from "react";
import { MapPin, X, GripVertical, Plus } from "lucide-react";
import type { MeetingLocation } from "@/imports/types";

export interface SchedulePoint extends MeetingLocation {
  pointType: "meeting" | "destination";
  stableId: string;
}

interface ReorderableMeetingListProps {
  meetingLocations: SchedulePoint[];
  onReorder: (reorderedLocations: SchedulePoint[]) => void;
  onRemove: (index: number, point: SchedulePoint) => void;
  onItemClick?: (location: SchedulePoint) => void;
  onRestoreFirstPoint?: () => void;
  candidatePoint?: MeetingLocation | null;
  showRestoreButton?: boolean;
  lockFirstItem?: boolean;
  readOnly?: boolean;
}

export function ReorderableMeetingList({
  meetingLocations,
  onReorder,
  onRemove,
  onItemClick,
  onRestoreFirstPoint,
  candidatePoint,
  showRestoreButton,
  lockFirstItem = true,
  readOnly = false,
}: ReorderableMeetingListProps) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    if (readOnly) {
      e.preventDefault();
      return;
    }

    // Prevent dragging the first item
    if (lockFirstItem && index === 0) {
      e.preventDefault();
      return;
    }
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", String(index));
    // Hide drag image to prevent transparent copy following mouse
    const emptyImage = new Image();
    e.dataTransfer.setDragImage(emptyImage, 0, 0);
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    if (readOnly) {
      return;
    }

    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverIndex(index);
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    if (readOnly) {
      return;
    }

    e.preventDefault();
    setDragOverIndex(null);

    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null);
      return;
    }

    // Prevent dropping on the first item
    if (lockFirstItem && dropIndex === 0) {
      setDraggedIndex(null);
      return;
    }

    // Reorder array
    const newLocations = [...meetingLocations];
    const [draggedItem] = newLocations.splice(draggedIndex, 1);
    newLocations.splice(dropIndex, 0, draggedItem);

    setDraggedIndex(null);
    onReorder(newLocations);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  return (
    <div className="space-y-2" role="list">
      {/* Show restore button in missing-P1 slot */}
      {showRestoreButton && (
        <div className="bg-[#fef3c7] border-2 border-[#ff5900] rounded-lg p-3">
          <button
            type="button"
            onClick={() => onRestoreFirstPoint?.()}
            className="w-full flex items-center gap-3 text-left px-2 py-1 hover:bg-white/30 rounded transition-colors cursor-pointer"
          >
            <Plus className="size-5 text-[#ff5900] shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[#854d0e]">Add as first stop</p>
              <p className="text-xs text-[#854d0e]/70">
                {candidatePoint ? candidatePoint.location : "Click to open map and select"}
              </p>
            </div>
          </button>
        </div>
      )}

      {showRestoreButton && meetingLocations.length > 0 && <hr className="my-2 border-[#d1d5db]" />}
      
      {meetingLocations.map((point, index) => (
        <div key={point.stableId}>
          <div
            draggable={readOnly ? false : lockFirstItem ? index !== 0 : true}
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, index)}
            onDragEnd={handleDragEnd}
            onClick={() => onItemClick?.(point)}
            className={`
              flex items-center gap-3 p-3 rounded-lg border-2 transition-all ${readOnly ? (onItemClick ? "cursor-pointer hover:border-[#00b70d]" : "cursor-default") : (lockFirstItem && index === 0) ? "cursor-default" : "cursor-grab active:cursor-grabbing hover:border-[#00b70d]"}
              ${draggedIndex === index ? "opacity-50 bg-[#f0f0f0]" : ""}
              ${dragOverIndex === index && draggedIndex !== index ? "border-[#00b70d] bg-[#f8fdf9]" : "border-[#e2e8f0] bg-white"}
            `}
          >
            {(readOnly || (lockFirstItem && index === 0)) ? (
              <div className="size-5 shrink-0" />
            ) : (
              <GripVertical className="size-5 text-[#6a7282] shrink-0" />
            )}
            <MapPin
              className={`size-4 shrink-0 ${
                point.pointType === "destination" ? "text-[#ff5900]" : "text-[#00b70d]"
              }`}
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[#0d2805] truncate">{point.location}</p>
              <div className="flex items-center gap-2 mt-0.5">
                {point.time && <p className="text-xs text-[#ff5900] whitespace-nowrap">{point.time}</p>}
                <span
                  className={`text-[11px] font-semibold px-1.5 py-0.5 rounded ${
                    point.pointType === "destination"
                      ? "bg-[#fff1e8] text-[#ff5900]"
                      : "bg-[#e9fbe9] text-[#0d2805]"
                  }`}
                >
                  {point.pointType === "destination" ? "Destination" : "Meeting"}
                </span>
                {point.address && <p className="text-xs text-[#6a7282] truncate">{point.address}</p>}
              </div>
            </div>
            {!readOnly && point.pointType === "meeting" ? (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove(index, point);
                }}
                className="p-1.5 hover:bg-[#fee8e0] rounded-lg transition-colors shrink-0"
              >
                <X className="size-4 text-[#ff5900]" />
              </button>
            ) : (
              <div className="size-7 shrink-0" />
            )}
          </div>
          
          {/* Separator after first item */}
          {lockFirstItem && index === 0 && meetingLocations.length > 1 && (
            <hr className="my-2 border-[#d1d5db]" />
          )}
        </div>
      ))}
    </div>
  );
}
