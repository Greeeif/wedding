'use client';

import { useEffect, useState } from 'react';
import { RSVPWithUser } from '@/types';

export default function AdminRSVPPage() {
  const [rsvps, setRsvps] = useState<RSVPWithUser[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    attending: 0,
    notAttending: 0,
    totalGuests: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRSVPs();
  }, []);

  const fetchRSVPs = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/rsvp');
      const data = await response.json();

      if (data.success) {
        setRsvps(data.data);
        calculateStats(data.data);
      } else {
        setError(data.error || 'Failed to fetch RSVPs');
      }
    } catch (err) {
      setError('Error fetching RSVPs');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (RSVPWithUser: RSVPWithUser[]) => {
    const attending = RSVPWithUser.filter((r) => r.attending).length;
    const notAttending = RSVPWithUser.filter((r) => !r.attending).length;
    const totalGuests = RSVPWithUser
      .filter((r) => r.attending)
      .reduce((sum, r) => sum + r.guests, 0);

    setStats({
      total: RSVPWithUser.length,
      attending,
      notAttending,
      totalGuests,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <p className="text-stone-600">Loading RSVPs...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchRSVPs}
            className="px-4 py-2 bg-stone-800 text-white rounded hover:bg-stone-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-light text-stone-800 mb-8">RSVP Admin Dashboard</h1>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <p className="text-sm text-stone-600 uppercase tracking-wide mb-2">Total Responses</p>
            <p className="text-3xl font-light text-stone-800">{stats.total}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <p className="text-sm text-stone-600 uppercase tracking-wide mb-2">Attending</p>
            <p className="text-3xl font-light text-green-600">{stats.attending}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <p className="text-sm text-stone-600 uppercase tracking-wide mb-2">Not Attending</p>
            <p className="text-3xl font-light text-red-600">{stats.notAttending}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <p className="text-sm text-stone-600 uppercase tracking-wide mb-2">Total Guests</p>
            <p className="text-3xl font-light text-stone-800">{stats.totalGuests}</p>
          </div>
        </div>

        {/* RSVP List */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-stone-200">
            <h2 className="text-xl font-light text-stone-800">All RSVPs</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-stone-50 border-b border-stone-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-stone-600 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-stone-600 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-stone-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-stone-600 uppercase tracking-wider">
                    Guests
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-stone-600 uppercase tracking-wider">
                    Dietary
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-stone-600 uppercase tracking-wider">
                    Message
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-stone-600 uppercase tracking-wider">
                    Submitted
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                {rsvps.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-4 text-center text-stone-500">
                      No RSVPs yet
                    </td>
                  </tr>
                ) : (
                  rsvps.map((rsvp) => (
                    <tr key={rsvp.id} className="hover:bg-stone-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-stone-800">
                        {rsvp.user.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-600">
                        {rsvp.user.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            rsvp.attending
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {rsvp.attending ? 'Attending' : 'Not Attending'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-600">
                        {rsvp.attending ? rsvp.guests : '-'}
                      </td>
                      <td className="px-6 py-4 text-sm text-stone-600">
                        {rsvp.dietaryRestrictions || '-'}
                      </td>
                      <td className="px-6 py-4 text-sm text-stone-600 max-w-xs truncate">
                        {rsvp.message || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-600">
                        {new Date(rsvp.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Refresh Button */}
        <div className="mt-8 flex justify-center">
          <button
            onClick={fetchRSVPs}
            className="px-6 py-3 bg-stone-800 text-white rounded hover:bg-stone-700 transition-colors"
          >
            Refresh Data
          </button>
        </div>
      </div>
    </div>
  );
}
