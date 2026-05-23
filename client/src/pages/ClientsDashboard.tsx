import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

const ClientsDashboard = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        // Get current user session
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          setError('User not authenticated');
          setLoading(false);
          return;
        }

        // Fetch service bookings for services owned by the current user
        const { data: serviceBookings, error: serviceBookingsError } = await supabase
          .from('service_bookings')
          .select(`
            id,
            created_at,
            profile:profile_id (
              display_name,
              username,
              avatar_url
            ),
            service:service_id (
              name,
              category
            ),
            form_data
          `)
          .neq('profile_id', session.user.id); // Exclude own bookings

        if (serviceBookingsError) throw serviceBookingsError;

        // Fetch trip participants for trips organized by the current user
        const { data: tripParticipants, error: tripParticipantsError } = await supabase
          .from('trip_participants')
          .select(`
            id,
            joined_at,
            profile:user_id (
              display_name,
              username,
              avatar_url
            ),
            trip:trip_id (
              title,
              start_date,
              end_date,
              price
            )
          `)
          .neq('user_id', session.user.id); // Exclude own participation

        if (tripParticipantsError) throw tripParticipantsError;

        // Combine and format the data
        const formattedClients = [];

        // Process service bookings
        if (serviceBookings) {
          serviceBookings.forEach(booking => {
            formattedClients.push({
              id: booking.id,
              type: 'service',
              clientName: booking.profile?.display_name || 'Anonymous',
              clientInitials: booking.profile?.username?.slice(0, 2).toUpperCase() || '??',
              clientAvatar: booking.profile?.avatar_url,
              destination: `${booking.service?.name} (${booking.service?.category})`,
              date: booking.created_at ? new Date(booking.created_at).toLocaleDateString() : 'N/A',
              amount: 'Service Booking', // Would need to parse form_data or have price in service
              status: 'Confirmed', // Default status, could be enhanced
              bookingData: booking
            });
          });
        }

        // Process trip participants
        if (tripParticipants) {
          tripParticipants.forEach(participant => {
            formattedClients.push({
              id: participant.id,
              type: 'trip',
              clientName: participant.profile?.display_name || 'Anonymous',
              clientInitials: participant.profile?.username?.slice(0, 2).toUpperCase() || '??',
              clientAvatar: participant.profile?.avatar_url,
              destination: participant.trip?.title || 'Unknown Trip',
              date: participant.joined_at ? new Date(participant.joined_at).toLocaleDateString() : 'N/A',
              amount: participant.trip?.price ? `${participant.trip.price} DZD` : 'Price TBA',
              status: 'Confirmed', // Could check trip status
              bookingData: participant
            });
          });
        }

        // Sort by date (newest first)
        formattedClients.sort((a, b) => 
          new Date(b.date) - new Date(a.date)
        );

        setClients(formattedClients);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching clients data:', err);
        setError(err.message || 'Failed to load client data');
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full border-4 border-t-[#00B70D] border-gray-200 w-12 h-12"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-red-500 text-center p-6">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-yellow-50">
      {/* Header */}
      <div className="w-[1440px] h-24 flex items-center justify-between px-20 pt-3 pb-[0.80px] bg-yellow-50 border-b-[0.80px] border-yellow-100">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 bg-green-600"></div>
          <h1 className="text-5xl font-bold font-[Merriweather] text-lime-950">Clients information</h1>
        </div>
        <div className="flex items-center gap-6">
          <div className="bg-white/80 rounded-2xl shadow-sm px-6 py-3.5 flex items-center gap-3.5">
            <div className="w-11 h-11 bg-orange-600/10 rounded-full flex items-center justify-center">
              <div className="w-6 h-6 bg-orange-600/20 rounded-full flex items-center justify-center">
                <div className="w-3 h-1.5 bg-orange-600"></div>
                <div className="w-2 h-2 bg-orange-600"></div>
                <div className="w-2.8 h-1.5 bg-orange-600"></div>
                <div className="w-2.8 h-2 bg-orange-600"></div>
              </div>
            </div>
            <div className="flex flex-col">
              <div className="text-xs font-[Outfit] uppercase text-slate-500 tracking-wide">Active Bookings</div>
              <div className="text-3xl font-bold font-[Outfit] text-lime-950">{clients.length}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-[1440px] h-[900px] relative">
        {/* Sidebar Navigation */}
        <div className="w-96 h-[485.86px] absolute left-[-16px] top-21px bg-white border-r border-green-600/20">
          <div className="flex flex-col gap-1">
            <div className="w-80 h-12 px-4 rounded-3xl inline-flex justify-start items-center gap-4">
              <div className="w-7 h-7 bg-lime-950/70 rounded"></div>
              <span className="text-xl font-medium font-[Inter] text-lime-950/70 leading-8">Home</span>
            </div>
            <div className="w-80 h-12 px-4 rounded-3xl inline-flex justify-start items-center gap-4">
              <div className="w-7 h-7 bg-lime-950/70 rounded"></div>
              <span className="text-xl font-medium font-[Inter] text-lime-950/70 leading-8">My Trips</span>
            </div>
            <div className="w-80 h-12 px-4 rounded-3xl inline-flex justify-start items-center gap-4">
              <div className="w-7 h-7 bg-lime-950/70 rounded"></div>
              <span className="text-xl font-medium font-[Inter] text-lime-950/70 leading-8">Explore</span>
            </div>
            <div className="w-80 h-14 px-4 rounded-3xl inline-flex justify-start items-center gap-4">
              <div className="w-6 h-6 bg-lime-950/70 rounded"></div>
              <span className="text-xl font-medium font-[Inter] text-lime-950/70 leading-8">Services</span>
            </div>
            <div className="w-96 h-10 px-4 rounded-xl inline-flex justify-start items-center gap-3 bg-green-600/10">
              <div className="w-4 h-5 bg-green-600/20 rounded"></div>
              <span className="text-base font-medium font-[Inter] text-lime-950 leading-6">Business</span>
            </div>
            <div className="w-96 h-10 px-4 rounded-xl inline-flex justify-start items-center gap-3">
              <div className="w-4 h-5 bg-green-600/20 rounded"></div>
              <span className="text-base font-medium font-[Inter] text-lime-950 leading-6">Clients</span>
            </div>
            <div className="w-96 h-12 px-4 rounded-xl inline-flex justify-start items-center gap-3.5">
              <div className="w-4 h-5 bg-green-600/20 rounded"></div>
              <span className="text-lg font-medium font-[Inter] text-lime-950/70 leading-7">Feedback</span>
            </div>
            <div className="w-96 h-12 px-4 rounded-xl inline-flex justify-start items-center gap-3.5">
              <div className="w-4 h-5 bg-green-600/20 rounded"></div>
              <span className="text-lg font-medium font-[Inter] text-lime-950/70 leading-7">Finances</span>
            </div>
          </div>
          <div className="h-4"></div>
          <div className="w-72 flex items-center px-16 bg-white rounded-[19.05px] shadow-md">
            <span className="text-xl font-bold font-[Inter] text-orange-600 leading-7">Create New Trip</span>
          </div>
          <div className="h-4"></div>
          <div className="w-80 flex flex-col gap-4 px-10 rounded-[19.05px]">
            <div className="w-14 h-7 flex items-center justify-start">
              <span className="text-xl font-medium font-[Inter] text-lime-950/70 leading-7">Profile</span>
            </div>
            <div className="w-28 h-7 flex items-center justify-start">
              <span className="text-xl font-medium font-[Inter] text-lime-950/70 leading-7">Community</span>
            </div>
            <div className="w-20 h-7 flex items-center justify-start">
              <span className="text-xl font-medium font-[Inter] text-lime-950/70 leading-7">Settings</span>
            </div>
          </div>
        </div>

        {/* Clients Table Header */}
        <div className="w-[1008.54px] h-14 absolute left-1px top-0.28px bg-stone-50 border-b-1 border-zinc-400/80 flex items-start">
          <div className="w-48 h-12 left-28.08px top-18.72px justify-start text-neutral-500 text-sm font-bold font-[Outfit] uppercase leading-5 tracking-wide">Client</div>
          <div className="w-52 h-12 left-281.73px top-18.72px justify-start text-neutral-500 text-sm font-bold font-[Outfit] uppercase leading-5 tracking-wide">Destination &amp; Date</div>
          <div className="w-28 h-12 left-551.40px top-18.72px justify-start text-neutral-500 text-sm font-bold font-[Outfit] uppercase leading-5 tracking-wide">Amount</div>
          <div className="w-32 h-12 left-717.46px top-18.72px justify-start text-neutral-500 text-sm font-bold font-[Outfit] uppercase leading-5 tracking-wide">Status</div>
          <div className="w-20 h-12 left-894.63px top-18.72px text-right justify-start text-neutral-500 text-sm font-bold font-[Outfit] uppercase leading-5 tracking-wide">Actions</div>
        </div>

        {/* Clients Table Body */}
        <div className="w-[1008.54px] h-[504px] absolute left-1px top-504.28px bg-white/50 border-t-1 border-gray-100 inline-flex justify-between items-center px-7 py-5">
          <div className="w-36 h-5 flex justify-start items-start">
            <div className="justify-start text-gray-600 text-sm font-medium font-[Outfit] leading-5">
              Showing {clients.length} of {clients.length} entries
            </div>
          </div>
          <div className="w-64 h-9 flex justify-start items-start gap-1">
            {/* Pagination would go here */}
            <div className="w-16 h-9 relative opacity-50 rounded-xl outline outline-1 outline-offset-[-1.17px] outline-gray-400">
              <div className="left-15.21px top-5.85px absolute text-center justify-start text-gray-600 text-base font-semibold font-[Outfit] leading-6">Prev</div>
            </div>
            <div className="w-10 h-9 relative rounded-xl outline outline-1 outline-offset-[-1.17px] outline-gray-200">
              <div className="left-15.21px top-5.85px absolute text-center justify-start text-slate-600 text-base font-semibold font-[Outfit] leading-6">1</div>
            </div>
            <div className="w-10 h-9 relative rounded-xl outline outline-1 outline-offset-[-1.17px] outline-gray-200">
              <div className="left-15.21px top-5.85px absolute text-center justify-start text-slate-600 text-base font-semibold font-[Outfit] leading-6">2</div>
            </div>
            <div className="w-10 h-9 relative rounded-xl outline outline-1 outline-offset-[-1.17px] outline-gray-200">
              <div className="left-15.21px top-5.85px absolute text-center justify-start text-slate-600 text-base font-semibold font-[Outfit] leading-6">3</div>
            </div>
            <div className="flex-1 h-9 relative rounded-xl outline outline-1 outline-offset-[-1.17px] outline-gray-200">
              <div className="left-15.21px top-5.85px absolute text-center justify-start text-slate-600 text-base font-semibold font-[Outfit] leading-6">Next</div>
            </div>
          </div>
        </div>

        {/* Client Cards/List */}
        <div className="w-[1008.54px] h-20 absolute left-[1px] top-[0.28px] overflow-y-auto" style={{ height: '351px' }}>
          {clients.length > 0 ? (
            clients.map((client, index) => (
              <div key={client.id} className="w-full h-20 left-0 top-0 absolute border-b-1 border-gray-100">
                <div className="w-48 h-12 left-28.08px top-20.47px absolute inline-flex justify-start items-center gap-3.5">
                  {client.clientAvatar ? (
                    <img 
                      className="size-12 relative rounded-full shadow-[0px_1.1700000762939453px_2.3400001525878906px_-1.1700000762939453px_rgba(0,0,0,0.10)] shadow-[0px_1.1700000762939453px_3.509999990463257px_0px_rgba(0,0,0,0.10)] border-1 border-gray-200"
                      src={client.clientAvatar} 
                      alt={client.clientName}
                    />
                  ) : (
                    <div className="w-12 h-12 relative rounded-full shadow-[0px_1.1700000762939453px_2.3400001525878906px_-1.1700000762939453px_rgba(0,0,0,0.10)] shadow-[0px_1.1700000762939453px_3.509999990463257px_0px_rgba(0,0,0,0.10)] border-1 border-gray-200 flex items-center justify-center">
                      <span className="text-[12px] font-medium text-slate-800">{client.clientInitials}</span>
                    </div>
                  )}
                  <div className="w-28 h-12 inline-flex flex-col justify-start items-start">
                    <div className="w-28 flex-1 relative">
                      <div className="left-0 top-0 absolute justify-start text-slate-800 text-lg font-semibold font-[Outfit] leading-7">{client.clientName}</div>
                    </div>
                    <div className="w-28 h-5 inline-flex justify-start items-start">
                      <div className="flex-1 justify-start text-slate-400 text-sm font-medium font-[Outfit] leading-5">BK-{8020 + index}</div>
                    </div>
                  </div>
                </div>
                <div className="w-52 h-12 left-281.73px top-19.30px absolute inline-flex flex-col justify-start items-start gap-0.5">
                  <div className="w-52 flex-1 relative">
                    <div className="left-0 top-0 absolute justify-start text-lime-950 text-lg font-bold font-[Outfit] leading-7">{client.destination}</div>
                  </div>
                  <div className="w-52 h-5 inline-flex justify-start items-start">
                    <div className="flex-1 justify-start text-slate-500 text-sm font-medium font-[Outfit] leading-5">{client.date}</div>
                  </div>
                </div>
                <div className="w-40 h-20 left-523.32px top-0 absolute">
                  <div className="left-28.08px top-29.83px absolute justify-start text-slate-700 text-lg font-bold font-[Outfit] leading-7">{client.amount}</div>
                </div>
                <div className="w-28 h-8 left-717.46px top-28.66px absolute bg-green-600/10 rounded-full outline outline-1 outline-offset-[-1.17px] outline-green-600/20">
                  <div className="size-4 left-12.87px top-7.02px absolute overflow-hidden">
                    <div className="size-3.5 left-1.37px top-1.36px absolute outline outline-[1.36px] outline-offset-[-0.68px] outline-green-600" />
                    <div className="w-1 h-[2.73px] left-6.14px top-6.82px absolute outline outline-[1.36px] outline-offset-[-0.68px] outline-green-600" />
                  </div>
                  <div className="left-36.27px top-5.85px absolute justify-start text-green-600 text-sm font-semibold font-[Outfit] leading-5">{client.status}</div>
                </div>
                <div className="w-20 h-9 left-894.63px top-25.15px absolute opacity-80 inline-flex justify-end items-center gap-2.5">
                  <div className="size-9 px-2.5 pt-2.5 rounded-xl inline-flex flex-col justify-start items-start">
                    <div className="self-stretch h-5 relative overflow-hidden">
                      <div className="size-3.5 left-2.34px top-2.34px absolute outline outline-[1.56px] outline-offset-[-0.78px] outline-slate-400" />
                    </div>
                  </div>
                  <div className="size-9 px-2.5 pt-2.5 rounded-xl inline-flex flex-col justify-start items-start">
                    <div className="self-stretch h-5 relative overflow-hidden">
                      <div className="w-3 h-4 left-3.12px top-1.56px absolute outline outline-[1.56px] outline-offset-[-0.78px] outline-slate-400" />
                      <div className="size-1.5 left-6.24px top-6.24px absolute outline outline-[1.56px] outline-offset-[-0.78px] outline-slate-400" />
                      <div className="w-0 h-2 left-9.36px top-5.07px absolute outline outline-[1.56px] outline-offset-[-0.78px] outline-slate-400" />
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="w-full h-20 left-0 top-0 absolute flex items-center justify-center text-gray-500">
              No client bookings yet
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientsDashboard;