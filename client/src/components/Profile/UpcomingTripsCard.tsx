import large3 from "@/assets/images/large_3.png";

export function UpcomingTripsCard() {
  const largeTripImage = large3;
  return (
    <div className="bg-white relative rounded-xl border border-[#e2e8f0] shadow-sm w-full">
      <div className="content-stretch flex flex-col gap-4 items-start p-[21px] relative w-full">
        <div className="relative shrink-0 w-full">
          <div className="flex flex-row items-center size-full">
            <div className="bg-clip-padding border-0 border-transparent border-solid content-stretch flex items-center justify-between relative w-full">
              <div className="flex flex-col font-bold h-6 justify-center leading-[0] not-italic relative shrink-0 text-text-[#00b70d]">
                <p className="leading-6">Upcoming Trips</p>
              </div>
              <div className="content-stretch flex flex-col items-start relative shrink-0">
                <div className="flex flex-col font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#00b70d] text-xs whitespace-nowrap">
                  <p className="leading-4">View All</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="h-[173.5px] relative shrink-0 w-full">
          <div className="bg-clip-padding border-0 border-transparent border-solid relative size-full">
            <div className="absolute content-stretch flex flex-col h-32 items-start justify-center left-0 overflow-clip right-0 rounded-lg top-0">
              <div className="flex-[1_0_0] min-h-px min-w-px relative w-full">
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  <img alt="Upcoming Trip" className="absolute h-[217.19%] left-0 max-w-none top-[-58.59%] w-full" src={largeTripImage} />
                </div>
              </div>
              <div className="absolute bg-[rgba(255,255,255,0.9)] content-stretch flex flex-col items-start px-2 py-1 right-2 rounded top-2">
                <div className="flex flex-col font-bold h-[15px] justify-center leading-[0] not-italic relative shrink-0 text-[#00b70d] text-[10px]">
                  <p className="leading-[15px]">DEC 12-18</p>
                </div>
              </div>
            </div>
            <div className="absolute content-stretch flex flex-col items-start left-0 right-0 top-[136px]">
              <div className="flex flex-col font-bold h-[18px] justify-center leading-[0] not-italic relative shrink-0 text-text-[#00b70d] text-sm w-full">
                <p className="leading-[17.5px]">Ghardaia Oasis Trek</p>
              </div>
            </div>
            <div className="absolute content-stretch flex flex-col items-start left-0 right-0 top-[157.5px]">
              <div className="flex flex-col font-normal h-4 justify-center leading-[0] not-italic relative shrink-0 text-text-[#ff5900] text-xs">
                <p className="leading-4">8 spots left • $450</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


