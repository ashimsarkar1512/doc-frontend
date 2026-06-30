import { Order } from "@/types/orderTypes";
import { Calendar, Eye, FileText, Package, User } from "lucide-react";
import Link from "next/link";

interface OrderCardProps {
  order: Order;
  onViewDetails?: (id: string) => void;
}

export default function OrderCard({ order, onViewDetails }: OrderCardProps) {
  const canReorder = order.status === "DELIVERED" && !!order.category?.id;
  const reorderHref = `/products?categoryId=${order.category?.id ?? ""}&mode=reorder&submissionId=${order.submission?.id ?? ""}`;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACCEPTED":
      case "CONFIRMED":
      case "DELIVERED":
        return "bg-green-100 text-green-700";
      case "PENDING":
      case "PROCESSING":
        return "bg-yellow-100 text-yellow-700";
      case "REJECTED":
      case "CANCELLED":
      case "REFUNDED":
        return "bg-red-100 text-red-700";
      case "SHIPPED":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusLabel = (status: string) => {
    if (!status) return "";
    return status.charAt(0) + status.slice(1).toLowerCase().replace("_", " ");
  };

  return (
    <div className="bg-white rounded-3xl border border-gray-150 p-5 flex flex-col hover:shadow-md transition-all duration-300">
      {/* Top Badge */}
      <div className="flex items-center justify-between mb-4">
        <span
          className={`px-3 py-1 rounded-full text-[11px] font-semibold tracking-wide ${getStatusColor(
            order.status,
          )}`}
        >
          {getStatusLabel(order.status)}
        </span>
      </div>

      {/* Header Info */}
      <div className="flex items-center gap-4 mb-5">
        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
          <Package className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-gray-900 font-bold text-lg leading-tight">
            Order{" "}
            {order.orderNumber?.replace("ORD-", "#") ||
              `#${order.id.slice(0, 5)}`}
          </h3>
          <p className="text-gray-500 text-sm font-medium mt-0.5">
            {order.itemCount || 0} item(s) • $
            {order.total?.toFixed(2) || "0.00"}
          </p>
        </div>
      </div>

      {/* Details List */}
      <div className="flex flex-col gap-2.5 mb-6 flex-1">
        <div className="flex items-center gap-3 text-sm text-gray-600">
          <User className="w-4 h-4 text-gray-400 shrink-0" />
          <span className="truncate">
            Doctor: {order.reviewedBy?.name || "Pending Review"}
          </span>
        </div>
        <div className="flex items-center gap-3 text-sm text-gray-600">
          <FileText className="w-4 h-4 text-gray-400 shrink-0" />
          <span className="truncate">
            Category: {order.submission?.assessmentTitle || "General"}
          </span>
        </div>
        <div className="flex items-center gap-3 text-sm text-gray-600">
          <Calendar className="w-4 h-4 text-gray-400 shrink-0" />
          <span>
            {order.createdAt
              ? new Date(order.createdAt).toISOString().split("T")[0]
              : "N/A"}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-2 mt-auto">
        <button
          onClick={() => onViewDetails?.(order.id)}
          className="w-full bg-[#2563eb] hover:bg-[#1d4ed8] active:bg-[#1e40af] text-white py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-colors"
        >
          <Eye className="w-4 h-4" />
          View Details
        </button>

        {canReorder ? (
          <Link
            href={reorderHref}
            className="w-full border border-[#2563eb] text-[#2563eb] hover:bg-blue-50 active:bg-blue-100 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-colors"
          >
            Reorder Items
          </Link>
        ) : (
          <button
            disabled
            className="w-full border border-gray-300 text-gray-400 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-colors cursor-not-allowed"
          >
            Reorder Items
          </button>
        )}
      </div>
    </div>
  );
}
