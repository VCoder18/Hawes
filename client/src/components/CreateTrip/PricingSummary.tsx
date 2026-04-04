interface PricingSummaryProps {
  minParticipants: number;
  maxParticipants: number;
  pricePerPerson: number;
}

export function PricingSummary({ minParticipants, maxParticipants, pricePerPerson }: PricingSummaryProps) {
  const PLATFORM_FEE_RATE = 0.1;
  const minGross = minParticipants * pricePerPerson;
  const maxGross = maxParticipants * pricePerPerson;
  const minFee = minGross * PLATFORM_FEE_RATE;
  const maxFee = maxGross * PLATFORM_FEE_RATE;
  const minNet = minGross - minFee;
  const maxNet = maxGross - maxFee;

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
          <span className="text-text-[#ff5900]">Gross Revenue:</span>
          <span className="font-bold text-text-[#00b70d] text-right">
            {minGross.toLocaleString()} - {maxGross.toLocaleString()} DZD
          </span>
        </div>
        <div className="flex justify-between gap-2">
          <span className="text-text-[#ff5900]">Platform Fee (10%):</span>
          <span className="font-medium text-[#ff5900] text-right">
            {minFee.toLocaleString()} - {maxFee.toLocaleString()} DZD
          </span>
        </div>
        <div className="flex justify-between gap-2">
          <span className="text-text-[#ff5900]">Net Payout:</span>
          <span className="font-bold text-[#00b70d] text-right">
            {minNet.toLocaleString()} - {maxNet.toLocaleString()} DZD
          </span>
        </div>
      </div>
    </div>
  );
}


