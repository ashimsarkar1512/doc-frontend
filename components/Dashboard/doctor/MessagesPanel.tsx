"use client";

import Image from "next/image";
import { Search, MoreHorizontal } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

const patients = [
  {
    id: 1,
    name: "Alan Cattach",
    category: "Weight Loss",
    consultationId: "#001236",
    image: "/doctor/doc-1.png",
    chatId: "001236",
  },
  {
    id: 2,
    name: "Jane Cooper",
    category: "Individual Therapy",
    consultationId: "#001237",
    image: "/doctor/doc-2.png",
    chatId: "001237",
  },
  {
    id: 3,
    name: "Albert Flores",
    category: "Anxiety & Stress",
    consultationId: "#001238",
    image: "/doctor/doc-3.png",
    chatId: "001238",
  },
  {
    id: 4,
    name: "Kristin Watson",
    category: "Clarity Consult",
    consultationId: "#001239",
    image: "/doctor/doc-4.png",
    chatId: "001239",
  },
];

export default function MessagesPanel() {
  const [search, setSearch] = useState("");

  const filtered = patients.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase()) ||
      p.consultationId.includes(search)
  );

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-5">Messages</h2>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search patients..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-colors"
        />
      </div>

      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Patients:</p>

      <div className="divide-y divide-gray-100">
        {filtered.map((patient) => (
          <div key={patient.id} className="flex items-center gap-4 py-4 hover:bg-gray-50 rounded-xl px-2 -mx-2 transition-colors group">
            <Link
              href={`/doctor?view=messages&chatId=${patient.chatId}`}
              className="flex items-center gap-4 flex-1 min-w-0"
            >
              <div className="relative w-11 h-11 rounded-full overflow-hidden flex-shrink-0 border border-gray-100">
                <Image
                  src={patient.image}
                  alt={patient.name}
                  fill
                  sizes="44px"
                  className="object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">{patient.name}</p>
                <p className="text-xs text-gray-500 truncate mt-0.5">
                  {patient.category}
                  <span className="mx-1 text-gray-300">·</span>
                  Consultation id: {patient.consultationId}
                </p>
              </div>
            </Link>
            <button className="text-gray-400 hover:text-gray-700 p-1.5 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="text-sm text-gray-400 text-center py-8">No patients found.</p>
        )}
      </div>
    </div>
  );
}
