import React, { useState } from "react";
import { ChevronDown, PackageX } from "lucide-react";
import OrderCard from "./OrderCard";

import { useGetMyOrdersQuery } from "@/Redux/features/patient/orders/orderApi";
import { OrderDateRange, OrderStatus } from "@/types/orderTypes";
import OrderDetails from "./OrderDetails";


export default function MyOrdersDomain() {
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | "ALL">("ALL");
  const [selectedDate, setSelectedDate] = useState<OrderDateRange>("ALL");
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

console.log(selectedOrderId)

  
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [isDateOpen, setIsDateOpen] = useState(false);

  const statuses: { label: string; value: OrderStatus | "ALL" }[] = [
    { label: "All Statuses", value: "ALL" },
    { label: "Pending", value: "PENDING" },
    { label: "Confirmed", value: "CONFIRMED" },
    { label: "Processing", value: "PROCESSING" },
    { label: "Shipped", value: "SHIPPED" },
    { label: "Delivered", value: "DELIVERED" },
    { label: "Cancelled", value: "CANCELLED" },
    { label: "Refunded", value: "REFUNDED" },
  ];



  const dateRanges: { label: string; value: OrderDateRange }[] = [
    { label: "All Time", value: "ALL" },
    { label: "Today", value: "TODAY" },
    { label: "Last 7 Days", value: "LAST_7_DAYS" },
    { label: "Last Month", value: "LAST_MONTH" },
    { label: "Last Year", value: "LAST_YEAR" },
  ];

  const getQueryStatus = () => {
    if (selectedStatus !== "ALL") return selectedStatus;
    return undefined;
  };

  const { data: ordersResponse, isLoading } = useGetMyOrdersQuery({
    status: getQueryStatus(),
    dateRange: selectedDate !== "ALL" ? selectedDate : undefined,
  }, { pollingInterval: 5000 });

  const orders = ordersResponse?.orders || [];



  if (selectedOrderId) {
    return <OrderDetails orderId={selectedOrderId} onBack={() => setSelectedOrderId(null)} />;
  }

  return (
    <div className="flex flex-col w-full animate-in fade-in duration-300">
      
      {/* Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 border-b border-gray-150 pt-2">
        {/* Status Tabs */}
        <div className="flex items-center gap-6 overflow-x-auto select-none scrollbar-none w-full sm:w-auto">
          {statuses.map((status) => {
            const isActive = selectedStatus === status.value;
            return (
              <button
                key={status.value}
                onClick={() => setSelectedStatus(status.value as any)}
                className={`
                  pb-4 text-[14px] font-semibold flex items-center gap-2 whitespace-nowrap transition-all duration-150 border-b-2
                  ${
                    isActive
                      ? "text-[#2563eb] border-[#2563eb]"
                      : "text-gray-500 border-transparent hover:text-gray-800"
                  }
                `}
              >
                <span>{status.label}</span>
                {isActive && (
                  <span className="w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center text-white bg-[#2563eb]">
                    {orders.length}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Date Dropdown */}
        <div className="flex items-center pb-4 sm:pb-0">
          <div className="relative">
            <button
              onClick={() => setIsDateOpen(!isDateOpen)}
              onBlur={() => setTimeout(() => setIsDateOpen(false), 200)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              {dateRanges.find((d) => d.value === selectedDate)?.label}
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </button>

            {isDateOpen && (
              <div className="absolute right-0 mt-1 w-40 bg-white border border-gray-100 rounded-xl shadow-lg z-10 py-1 overflow-hidden">
                {dateRanges.map((d) => (
                  <button
                    key={d.value}
                    onClick={() => {
                      setSelectedDate(d.value);
                      setIsDateOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-blue-50 transition-colors ${
                      selectedDate === d.value
                        ? "bg-blue-50/50 text-blue-600 font-medium"
                        : "text-gray-700"
                    }`}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Orders Grid */}
      {isLoading ? (
        <div className="w-full flex items-center justify-center py-20">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : orders.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} onViewDetails={setSelectedOrderId} />
          ))}
        </div>
      ) : (
        <div className="w-full py-20 flex flex-col items-center justify-center bg-white rounded-3xl border border-gray-150 shadow-[0_2px_8px_rgba(0,0,0,0.01)] mb-12">
          <PackageX className="h-12 w-12 text-gray-300 mb-4" />
          <h4 className="font-semibold text-gray-800 text-lg">No Orders Found</h4>
          <p className="text-sm text-gray-400 mt-1 max-w-sm text-center">
            You don't have any orders that match your current filters.
          </p>
        </div>
      )}
    </div>
  );
}
