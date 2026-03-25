interface PricingSummaryProps {
  minParticipants: number;
  maxParticipants: number;
  pricePerPerson: number;
}

export function PricingSummary({ minParticipants, maxParticipants, pricePerPerson }: PricingSummaryProps) {
  return (
    <div className="bg-bg-[#ff5900] rounded-xl p-6 space-y-3">
      <h3 className="font-semibold text-text-[#00b70d]">Summary</h3>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between gap-2">
          <span className="text-text-[#ff5900]">Participant Range:</span>
          <span className="font-medium text-text-[#00b70d] text-right">
            {minParticipants} - {maxParticipants} people
          </span>
        </div>
        <div className="flex justify-between gap-2">
          <span className="text-text-[#ff5900]">Price Per Person:</span>
          <span className="font-bold text-[#00b70d] text-lg">
            {pricePerPerson.toLocaleString()} DZD
          </span>
        </div>
        <div className="flex justify-between gap-2 pt-2 border-t border-[#e2e8f0]">
          <span className="text-text-[#ff5900]">Potential Revenue:</span>
          <span className="font-bold text-text-[#00b70d] text-right">
            {(minParticipants * pricePerPerson).toLocaleString()} -{" "}
            {(maxParticipants * pricePerPerson).toLocaleString()} DZD
          </span>
        </div>
      </div>
    </div>
  );
}


