import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Users, Calendar, DollarSign } from "lucide-react";

interface TripClient {
  id: string;
  joined_at: string | null;
  clientName: string;
  clientInitials: string;
  clientAvatar: string | null;
  tripTitle: string;
  tripPrice: number | null;
  tripStart: string | null;
}

export function ClientsTab() {
  const [clients, setClients] = useState<TripClient[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const fetchClients = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) { setLoading(false); return; }

        const { data: participants, error } = await supabase
          .from("trip_participants")
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
              price,
              organizer
            )
          `)
          .neq("user_id", session.user.id);

        if (error) throw error;

        if (!participants || cancelled) { setLoading(false); return; }

        const formatted: TripClient[] = [];

        for (const p of participants) {
          const profile = Array.isArray(p.profile) ? p.profile[0] : p.profile;
          const trip = Array.isArray(p.trip) ? p.trip[0] : p.trip;

          if (!trip || String(trip.organizer) !== session.user.id) continue;

          formatted.push({
            id: p.id,
            joined_at: p.joined_at,
            clientName: profile?.display_name || "Anonymous",
            clientInitials: profile?.username?.slice(0, 2).toUpperCase() || "??",
            clientAvatar: profile?.avatar_url,
            tripTitle: trip.title || "Unknown Trip",
            tripPrice: trip.price,
            tripStart: trip.start_date,
          });
        }

        formatted.sort(
          (a, b) => new Date(b.joined_at ?? 0).getTime() - new Date(a.joined_at ?? 0).getTime()
        );

        if (!cancelled) setClients(formatted);
      } catch (err) {
        console.error("Failed to fetch clients:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchClients();
    return () => { cancelled = true; };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full border-4 border-t-[#00b70d] border-gray-200 w-10 h-10" />
      </div>
    );
  }

  return (
    <div className="w-full pb-8">
      <div className="flex items-center gap-3 mb-8">
        <Users className="size-7 text-[#0d2805]" />
        <h1 className="font-['Merriweather'] font-bold text-3xl md:text-4xl text-[#0d2805]">
          Clients
        </h1>
        {clients.length > 0 && (
          <span className="text-sm text-[#6a7282] font-medium mt-2">
            ({clients.length} {clients.length === 1 ? "client" : "clients"})
          </span>
        )}
      </div>

      {clients.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
          <Users className="size-12 mx-auto text-[#d6d0c4] mb-4" />
          <p className="text-[#6a7282] font-medium">No clients yet</p>
          <p className="text-sm text-[#6a7282] mt-1">
            When someone joins your trip, they will appear here.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#e2e8f0] bg-[#f8f8f4]">
                  <th className="text-left px-6 py-4 text-xs font-bold text-[#6a7282] uppercase tracking-wider">
                    Client
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-bold text-[#6a7282] uppercase tracking-wider">
                    Trip
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-bold text-[#6a7282] uppercase tracking-wider">
                    Joined
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-bold text-[#6a7282] uppercase tracking-wider">
                    Price
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-bold text-[#6a7282] uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e2e8f0]">
                {clients.map((client) => (
                  <tr key={client.id} className="hover:bg-[#f8f8f4] transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {client.clientAvatar ? (
                          <img
                            src={client.clientAvatar}
                            alt={client.clientName}
                            className="size-10 rounded-full object-cover border border-[#e2e8f0]"
                          />
                        ) : (
                          <div className="size-10 rounded-full bg-[#00b70d]/10 border border-[#e2e8f0] flex items-center justify-center">
                            <span className="text-sm font-semibold text-[#00b70d]">
                              {client.clientInitials}
                            </span>
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-semibold text-[#0d2805]">
                            {client.clientName}
                          </p>
                          <p className="text-xs text-[#6a7282]">
                            BK-{String(client.id).slice(0, 6).toUpperCase()}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="size-4 text-[#6a7282] shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-[#0d2805]">
                            {client.tripTitle}
                          </p>
                          {client.tripStart && (
                            <p className="text-xs text-[#6a7282]">
                              {new Date(client.tripStart).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-[#6a7282]">
                        {client.joined_at
                          ? new Date(client.joined_at).toLocaleDateString()
                          : "N/A"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5">
                        <DollarSign className="size-4 text-[#6a7282]" />
                        <span className="text-sm font-semibold text-[#0d2805]">
                          {client.tripPrice != null
                            ? `${client.tripPrice.toLocaleString()} DZD`
                            : "TBA"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-[#00b70d]/10 text-[#00b70d] border border-[#00b70d]/20">
                        <span className="size-1.5 rounded-full bg-[#00b70d]" />
                        Confirmed
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="px-6 py-4 border-t border-[#e2e8f0] bg-[#f8f8f4] flex items-center justify-between">
            <span className="text-sm text-[#6a7282]">
              Showing {clients.length} of {clients.length} entries
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
