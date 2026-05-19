import React from "react";
interface StatItem {
  label: string;
  value: string;
}

const stats: StatItem[] = [
  {
    label: "Total Patients",
    value: "1,234",
  },
  {
    label: "Active Providers",
    value: "45",
  },
  {
    label: "Active Services",
    value: "28",
  },
  {
    label: "Assessments Taken",
    value: "1250",
  },
];

interface ActivityItem {
  patientName: string;
  avatarInitials: string;
  assessment: string;
  userType: "New Patient" | "Repeat Patient";
  status: "Approved" | "Declined" | "Pending";
  payment: string;
  date: string;
}

const recentActivity: ActivityItem[] = [
  {
    patientName: "Emily Chen",
    avatarInitials: "SJ",
    assessment: "Fitness Evaluation",
    userType: "New Patient",
    status: "Approved",
    payment: "$99",
    date: "5/27/15",
  },
  {
    patientName: "Michael Roberts",
    avatarInitials: "SJ",
    assessment: "Nutrition Intake Form",
    userType: "Repeat Patient",
    status: "Declined",
    payment: "$99",
    date: "5/19/12",
  },
  {
    patientName: "David Wilson",
    avatarInitials: "SJ",
    assessment: "Initial Health Assessment",
    userType: "New Patient",
    status: "Approved",
    payment: "$99",
    date: "2/11/12",
  },
  {
    patientName: "Jessica Martinez",
    avatarInitials: "SJ",
    assessment: "Follow-up Assessment",
    userType: "Repeat Patient",
    status: "Pending",
    payment: "$99",
    date: "4/4/18",
  },
];
const AdminDashboardHome = () => {
  return (
    <div>
      {" "}
      <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8 font-sans">
        {/* Welcome Message Banner */}
        <div className="space-y-1">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900 leading-tight">
            Welcome to your Dashboard!
          </h2>
          <p className="text-sm text-gray-400 font-light leading-none">
            Latest patient assessments and their statuses
          </p>
        </div>

        {/* Stats Cards Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="
              relative overflow-hidden rounded-2xl p-6 min-h-[140px] flex flex-col justify-between shadow-sm border border-gray-800/10
              bg-gradient-to-r from-[#222429] via-[#1f283d] to-[#2d497c] text-white group hover:shadow-md transition-shadow duration-300
            "
            >
              {/* Visual shine ring backing the number for premium depth */}
              <div className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-blue-500/10 blur-xl pointer-events-none group-hover:scale-125 transition-transform duration-500" />

              <span className="text-sm font-light text-gray-300 tracking-wide uppercase leading-none">
                {stat.label}
              </span>
              <span className="text-3xl md:text-[34px] font-bold tracking-tight mt-4 select-all">
                {stat.value}
              </span>
            </div>
          ))}
        </div>

        {/* Recent Activity Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-gray-900 tracking-tight leading-none pl-1">
            Recent Assessment Activity
          </h3>

          {/* Table Container Frame */}
          <div className="bg-white rounded-2xl border border-gray-150 overflow-hidden shadow-sm">
            <div className="overflow-x-auto w-full">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/50">
                    <th className="py-4 px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Patient
                    </th>
                    <th className="py-4 px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Assessment
                    </th>
                    <th className="py-4 px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      User Type
                    </th>
                    <th className="py-4 px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="py-4 px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Payment
                    </th>
                    <th className="py-4 px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {recentActivity.map((activity, index) => {
                    // User Type Badge style configs
                    const userTypeStyles =
                      activity.userType === "New Patient"
                        ? "text-[#3b82f6] bg-[#eff6ff] border-[#dbe8ff]"
                        : "text-[#8b5cf6] bg-[#f5f3ff] border-[#ede9fe]";

                    // Status Badge style configs
                    const statusStyles =
                      activity.status === "Approved"
                        ? "text-emerald-700 bg-emerald-50/80 border-emerald-100"
                        : activity.status === "Declined"
                          ? "text-rose-700 bg-rose-50/80 border-rose-100"
                          : "text-amber-700 bg-amber-50/80 border-amber-100";

                    return (
                      <tr
                        key={index}
                        className="hover:bg-gray-50/30 transition-colors duration-150"
                      >
                        {/* Patient column with circular initials */}
                        <td className="py-4 px-6 flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-blue-100/70 text-blue-700 flex items-center justify-center font-semibold text-xs border border-blue-200/20 shadow-sm select-none">
                            {activity.avatarInitials}
                          </div>
                          <span className="text-sm font-semibold text-gray-700 leading-tight">
                            {activity.patientName}
                          </span>
                        </td>

                        {/* Assessment Title */}
                        <td className="py-4 px-6">
                          <span className="text-sm text-gray-500 font-light">
                            {activity.assessment}
                          </span>
                        </td>

                        {/* User Type Badge */}
                        <td className="py-4 px-6">
                          <span
                            className={`
                            inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border
                            ${userTypeStyles}
                          `}
                          >
                            {activity.userType}
                          </span>
                        </td>

                        {/* Status Badge */}
                        <td className="py-4 px-6">
                          <span
                            className={`
                            inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border
                            ${statusStyles}
                          `}
                          >
                            {activity.status}
                          </span>
                        </td>

                        {/* Payment */}
                        <td className="py-4 px-6">
                          <span className="text-sm text-gray-500 font-light">
                            {activity.payment}
                          </span>
                        </td>

                        {/* Date */}
                        <td className="py-4 px-6">
                          <span className="text-sm text-gray-500 font-light">
                            {activity.date}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardHome;
