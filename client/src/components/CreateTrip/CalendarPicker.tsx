import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CalendarPickerProps {
  startDate: string | null;
  endDate: string | null;
  onDateSelect: (date: string, isStart: boolean) => void;
}

export function CalendarPicker({
  startDate,
  endDate,
  onDateSelect,
}: CalendarPickerProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectingStart, setSelectingStart] = useState(true);

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const dayNames = ["S", "M", "T", "W", "T", "F", "S"];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    // Add empty cells for days before the first of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    // Add the days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    return days;
  };

  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const isDateInRange = (date: Date) => {
    if (!startDate || !endDate) return false;
    const dateStr = formatDate(date);
    return dateStr >= startDate && dateStr <= endDate;
  };

  const isStartOrEndDate = (date: Date) => {
    const dateStr = formatDate(date);
    return dateStr === startDate || dateStr === endDate;
  };

  const isBeforeToday = (date: Date) => {
    const today = new Date();
    const todayFormatted = formatDate(today);
    const dateFormatted = formatDate(date);
    return dateFormatted < todayFormatted;
  };

  const handleDateClick = (date: Date) => {
    if (isBeforeToday(date)) return;

    const dateStr = formatDate(date);

    if (selectingStart) {
      // If we already have a complete selection, clear the end date when starting a new selection
      if (endDate) {
        onDateSelect("", false); // Clear end date
      }
      onDateSelect(dateStr, true);
      setSelectingStart(false);
    } else {
      onDateSelect(dateStr, false);
      setSelectingStart(true);
    }
  };

  const days = getDaysInMonth(currentMonth);

  const previousMonth = () => {
    setCurrentMonth(
      new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth() - 1
      )
    );
  };

  const nextMonth = () => {
    setCurrentMonth(
      new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth() + 1
      )
    );
  };

  return (
    <div className="bg-white border border-[#e2e8f0] rounded-2xl p-6">
      {/* Month Navigation */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={previousMonth}
          className="p-2 hover:bg-bg-[#ff5900] rounded-lg transition-colors"
        >
          <ChevronLeft className="size-5 text-text-[#ff5900]" />
        </button>
        <h3 className="font-bold text-lg text-text-[#00b70d]">
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </h3>
        <button
          onClick={nextMonth}
          className="p-2 hover:bg-bg-[#ff5900] rounded-lg transition-colors"
        >
          <ChevronRight className="size-5 text-text-[#ff5900]" />
        </button>
      </div>

      {/* Day Names */}
      <div className="grid grid-cols-7 gap-2 mb-2">
        {dayNames.map((day, index) => (
          <div
            key={index}
            className="text-center text-sm font-semibold text-text-[#ff5900]"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Days */}
      <div className="grid grid-cols-7 gap-2">
        {days.map((date, index) => {
          if (!date) {
            return <div key={`empty-${index}`} />;
          }

          const isInRange = isDateInRange(date);
          const isSelected = isStartOrEndDate(date);
          const isToday = formatDate(date) === formatDate(new Date());
          const isPast = isBeforeToday(date);

          return (
            <button
              key={index}
              onClick={() => handleDateClick(date)}
              disabled={isPast}
              className={`
                aspect-square rounded-lg flex items-center justify-center text-sm font-medium transition-all
                ${
                  isPast
                    ? "bg-bg-[#ff5900] text-[#cbd5e1] cursor-not-allowed"
                    : isSelected
                      ? "bg-[#00b70d] text-white font-bold"
                      : isInRange
                        ? "bg-[#00b70d]/20 text-text-[#00b70d]"
                        : isToday
                          ? "bg-bg-[#ff5900] text-text-[#00b70d] font-semibold"
                          : "text-text-[#00b70d] hover:bg-bg-[#ff5900]"
                }
              `}
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>

      {/* Selection Hint */}
      <div className="mt-4 pt-4 border-t border-[#e2e8f0]">
        <p className="text-xs text-text-[#ff5900] text-center">
          {selectingStart ? "Select start date" : "Select end date"}
        </p>
      </div>
    </div>
  );
}


