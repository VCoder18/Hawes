import React, { useState } from 'react';
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import p from "@/assets/images/meeting-point.png";
import tass from "@/assets/images/tassili.jpg";
import f from "@/assets/images/flash.png";
import b from "@/assets/images/compass.png";
import download from "@/assets/images/download.png";
import a from "@/assets/images/accomodation.png";
import l from "@/assets/images/lunch.png";
import camp from "@/assets/images/camping.png";
import bus from "@/assets/images/bus.png";
import pro from "@/assets/images/protection.png";
import t from "@/assets/images/user.png";
import d from "@/assets/images/drama.png";
import pu from "@/assets/images/puzzle.png";
import cal from "@/assets/images/calendar-range.png";
import cl from "@/assets/images/clock.png";
import share from "@/assets/images/share.png";
import secure from "@/assets/images/shield-check.png";
import check from "@/assets/images/check.png";
import x from "@/assets/images/x.png";
import up from "@/assets/images/chevron-up.png";
import down from "@/assets/images/chevron-down.png";




const JoinTrip = () => {
  return (
    <div className="min-h-screen bg-[#FDFCF0] font-sans text-[#1A2E05] pb-10">
      
      {/* section en heut l'image*/}
      <div className="relative bg-center h-[350px] w-full">
        <img 
          src={tass} 
          className="w-full h-full object-cover"
          alt="Tassili n'Ajjer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="absolute bottom-8 left-6 md:left-12 text-white">
          <div className="flex gap-2 mb-4">
            <Badge className="bg-[#2D3E20]/80 hover:bg-[#2D3E20] border-none text-[10px] py-1 px-3 flex items-center gap-1">
              <span className="text-[8px]"><img src={b} alt="" className='h-[20px] w-[20px]' /></span> Trekking
            </Badge>
            <Badge className="bg-[#FF5722] hover:bg-[#FF5722] border-none text-[10px] py-1 px-3 flex items-center gap-1">
              <span className="text-[10px]"><img src={f} alt="" className='h-[20px] w-[20px]' /></span> Hard
            </Badge>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-2">Tassili n'Ajjer Expedition</h1>
          <p className="flex items-center gap-1 text-[11px] font-medium text-white/90">
            <span className="!text-[#FDFCF0] text-sm"><img src={p} alt="meeting point"className=' h-[20px] w-[20px]' /></span> Meeting Point: Djanet Airport, Algeria
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 pt-10 space-y-12">
        
        {/* TRIP OVERVIEW  */}
        <section>
          <h2 className="text-xl font-bold mb-4">Trip Overview</h2>
          <p className="text-gray-600 text-sm leading-relaxed text-justify">
            Embark on a mesmerizing journey into the heart of the Algerian Sahara. Experience the vast golden dunes of Erg Admer, majestic sandstone towers of Tassili n'Ajjer, and ancient Tuareg traditions. This expedition is designed for those who seek adventure and cultural immersion in one of the world's most breathtaking environments.
          </p>
          <div className="flex flex-wrap gap-2 mt-6">
            {['Trekking', '4x4 Desert Safari', 'Stargazing', 'Touareg Culture', 'Rock Art Exploring'].map(tag => (
              <Badge key={tag} className="bg-[#E8F5E9] hover:bg-[#E8F5E9] text-[#4CAF50] border-none rounded-lg px-3 py-1.5 text-[10px] font-bold">
                {tag}
              </Badge>
            ))}
          </div>
        </section>

        {/* DAILY ITINERARY  */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-[#1A2E05]">Daily Itinerary</h2>
            <Button className="bg-[#E8F5E9] text-[#4CAF50] hover:bg-[#D7EBD8] border-none rounded-xl text-[10px] font-bold gap-1 h-9">
              <span className="text-sm"><img src={download} alt=""className='h-[20px] w-[20px]' /></span> Download PDF
            </Button>
          </div>
          
          <div className="relative bg-white border border-gray-50 rounded-[35px] p-8 shadow-sm">
            {/* Ligne verticale verte */}
            <div className="absolute left-[39px] top-12 bottom-12 w-[1.5px] bg-[#4CAF50]/40" />
            
            <div className="space-y-8">
              {[
                { day: 1, title: "Arrival in Djanet & Oasis Welcome", active: true, desc: "Meet your Touareg guide at Djanet Airport. Short transfer to the palm grove for a traditional welcome tea. Afternoon briefing and exploration of the local oasis." },
                { day: 2, title: "Tadrat Rouge & Rock Art" },
                { day: 3, title: "Erg Admer Dunes & Touareg Camp" },
                { day: 4, title: "Tegharghart & The Crying Cow" },
                { day: 5, title: "Djanet Market & Departure" }
              ].map((item, i) => (
                <div key={i} className="relative pl-10">
                  <div className="absolute left-[-5px] top-1 w-3 h-3 rounded-full bg-[#4CAF50] border-[3px] border-white z-10 shadow-[0_0_0_1px_rgba(74,175,80,0.3)]" />
                  <div className="flex justify-between items-center group cursor-pointer">
                    <span className="font-bold text-[14px]">Day {item.day}: {item.title}</span>
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center ${item.active ? 'bg-[#E8F5E9]' : 'bg-gray-50'}`}>
                       <span className="text-[#4CAF50] text-[10px]">{item.active ? (<img src={up} alt="up" className="h-[20px] w-[20px]" />) : (<img src={down} alt="down" className="h-[20px] w-[20px]" />)}</span>
                    </div>
                  </div>
                  {item.active && (
                    <p className="mt-4 text-gray-500 text-[12px] leading-relaxed max-w-2xl">
                      {item.desc}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/*WHAT'S INCLUDED*/}
        <section>
          <h2 className="text-xl font-bold mb-6">What's Included & Excluded</h2>
          
          {/* Grille d'icônes */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
            {[
              {icon: a, label: "Accommodation"}, {icon: l, label: "Meals"}, 
              {icon: camp, label: "Equipment"}, {icon: d, label: "Entertainment"},
              {icon: pu, label: "Miscellaneous"}, {icon: t, label: "Guide"},
              {icon: pro, label: "Insurance"}, {icon: bus, label: "Transport"}
            ].map((item, i) => (
              <div key={i} className="bg-white border border-gray-100 p-3 rounded-2xl flex items-center gap-3 shadow-sm">
                <span className="text-lg bg-[#F1F8E9] p-1.5 rounded-xl"><img src={item.icon} alt={item.label} className="h-[20px] w-[20px] object-contain" /></span>
                <span className="text-[11px] font-bold text-gray-700">{item.label}</span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Boîte Inclus */}
            <div className="bg-white border border-[#E8F5E9] rounded-[30px] p-6 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2 font-bold text-[13px]">
                   <div className="w-6 h-6 rounded-full bg-[#E8F5E9] text-[#4CAF50] flex items-center justify-center text-[10px]"><img src={check} alt="" className='h-[20px] w-[20px]' /></div>
                   Included
                </div>
                <span className="text-gray-300"><img src={up} alt="up" className="h-[20px] w-[20px]" /></span>
              </div>
              <ul className="space-y-4">
                {[
                  {b:"Accommodation", t:"Traditional Touareg camp and guesthouse stays are covered for all nights."},
                  {b:"Meals", t:"Enjoy three fully-catered traditional meals a day throughout the expedition."},
                  {b:"Equipment", t:"We provide all necessary camping gear including tents and sleeping mattresses."},
                  {b:"Guide", t:"An experienced, English-speaking local Touareg guide will lead your journey."},
                  {b:"Transport", t:"All 4x4 desert transfers from the Djanet meeting point are completely covered."},
                ].map((li, i) => (
                  <li key={i} className="flex gap-2 text-[11px] leading-relaxed">
                    <span className="text-[#4CAF50] mt-0.5"><img src={check} alt="" className='h-[20px] w-[20px]' /></span>
                    <span><b className="text-[#1A2E05]">{li.b}:</b> <span className="text-gray-500">{li.t}</span></span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Boîte Exclus */}
            <div className="bg-white border border-[#FBE9E7] rounded-[30px] p-6 shadow-sm h-fit">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2 font-bold text-[13px] text-gray-400">
                   <div className="w-6 h-6 rounded-full bg-[#FBE9E7] text-[#FF5722] flex items-center justify-center text-[10px]"><img src={x} alt="" className='h-[20px] w-[20px]' /></div>
                   Not Included
                </div>
                <span className="text-gray-300"><img src={up} alt="up" className="h-[20px] w-[20px]" /></span>
              </div>
              <ul className="space-y-4">
                <li className="flex gap-2 text-[11px] leading-relaxed">
                  <span className="text-[#FF5722] mt-0.5"><img src={x} alt="" className='h-[20px] w-[20px]' /></span>
                  <span><b className="text-gray-400">Insurance:</b> <span className="text-gray-400 italic">Personal travel insurance, medical coverage, and visa fees are your responsibility.</span></span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/*  WHAT TO BRING  */}
        <section>
          <h2 className="text-xl font-bold mb-6">What to Bring</h2>
          <div className="bg-white border border-gray-50 rounded-[35px] p-10 shadow-sm">
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-12">
              {['Water Bottle', 'Sunscreen & Hat', 'Headlamp', 'Warm Layers', 'Hiking Boots', 'Multi-tool'].map(item => (
                <li key={item} className="flex items-center gap-3 text-sm font-bold text-gray-600">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#4CAF50]" /> {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/*  PRICING & BOOKING  */}
        <div className="pt-8">
          <Card className="bg-[#FDFCF0] border border-[#FF5722]/30 rounded-[45px] p-8 shadow-xl shadow-orange-900/5">
             <div className="space-y-8">
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[2px]">Total Price</p>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-5xl font-black">2000</span>
                    <span className="text-2xl font-bold">DA</span>
                    <span className="text-gray-400 text-xs font-bold ml-2">/ person</span>
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-gray-100">
                   <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-gray-50"><img src={cal} alt="calender"className=' h-[20px] w-[20px]' /></div>
                      <div>
                        <p className="text-[13px] font-bold">Nov 12 - Nov 18</p>
                        <p className="text-[10px] text-gray-400 font-medium">Fixed Departure</p>
                      </div>
                   </div>
                   <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-gray-50"><img src={cl} alt="clock"className=' h-[20px] w-[20px]' /></div>
                      <div>
                        <p className="text-[13px] font-bold">5 Days / 4 Nights</p>
                        <p className="text-[10px] text-gray-400 font-medium">Immersive Experience</p>
                      </div>
                   </div>
                </div>

                <div className="bg-[#D1F2D1]/50 p-5 rounded-[25px] flex justify-between items-center border border-[#B8EBB8]">
                  <div className="text-[12px] font-bold">
                    <p className="text-[#1A2E05]">Limited Availability</p>
                    <p className="text-[#1A2E05]/60 text-[10px]">12 / 15 spots filled</p>
                  </div>
                  <div className="w-9 h-9 rounded-full bg-[#4CAF50] flex items-center justify-center text-white text-[11px] font-black">
                    3
                  </div>
                </div>

                <Button className="w-full bg-[#FF5722] hover:bg-[#E64A19] text-white font-bold py-8 rounded-[22px] text-base shadow-lg shadow-orange-200 uppercase tracking-wide">
                  Join This Trip →
                </Button>
                
                <div className="flex justify-center gap-8 text-[10px] font-bold text-gray-400">
                   <span className="flex items-center gap-1 cursor-pointer hover:text-green-600"><img src={secure} alt=""className=' h-[20px] w-[20px]' /> Secure Booking</span>
                   <span className="flex items-center gap-1 cursor-pointer hover:text-green-600"><img src={share} alt=""className=' h-[20px] w-[20px]' /> Share</span>
                </div>
             </div>
          </Card>
        </div>

      </div>
    </div>
  );
};

export default JoinTrip;