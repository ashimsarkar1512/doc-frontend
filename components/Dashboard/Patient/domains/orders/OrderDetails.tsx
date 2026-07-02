import React from "react";
import Image from "next/image";
import {
  ArrowLeft,
  Box,
  CheckSquare,
  Package,
  Truck,
  MapPin,
  CreditCard,
  User,
  FileText,
  CheckCircle2,
} from "lucide-react";
import { useGetMyOrderByIdQuery } from "@/Redux/features/patient/orders/orderApi";

interface OrderDetailsProps {
  orderId: string;
  onBack: () => void;
  onViewSubmission?: (submissionId: string) => void;
}

export default function OrderDetails({ orderId, onBack, onViewSubmission }: OrderDetailsProps) {
  const {
    data: response,
    isLoading,
    isError,
  } = useGetMyOrderByIdQuery(orderId);
  const order = response?.data;
  const topRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    topRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  if (isLoading) {
    return (
      <div className="w-full flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-[#2563eb] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="w-full py-20 flex flex-col items-center justify-center bg-white rounded-3xl border border-gray-150 shadow-[0_2px_8px_rgba(0,0,0,0.01)]">
        <p className="text-gray-500">Failed to load order details.</p>
        <button
          onClick={onBack}
          className="mt-4 text-[#2563eb] hover:underline font-medium"
        >
          Go Back
        </button>
      </div>
    );
  }

  // Helper to format date
  const formatDate = (dateString?: string | null) => {
    if (!dateString) return "--/--/--";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // Progress Bar Steps Mapping based on timeline
  const steps = [
    {
      label: "Order submitted",
      date: order.timeline?.submittedAt,
      icon: CheckSquare,
    },
    {
      label: "Order approved",
      date: order.timeline?.confirmedAt,
      icon: CheckSquare,
    },
    {
      label: "Order in progress",
      date: order.timeline?.processingAt,
      icon: Package,
    },
    { label: "Order shipped", date: order.timeline?.shippedAt, icon: Truck },
    {
      label: "Order delivered",
      date: order.timeline?.deliveredAt,
      icon: Package,
    },
  ];

  // Determine current active step (last step that has a date)
  let activeStepIndex = -1;
  for (let i = steps.length - 1; i >= 0; i--) {
    if (steps[i].date) {
      activeStepIndex = i;
      break;
    }
  }

  // Fallback to order status for progress bar if timeline dates are missing
  const statusToStepMap: Record<string, number> = {
    DELIVERED: 4,
    SHIPPED: 3,
    PROCESSING: 2,
    IN_PROGRESS: 2,
    APPROVED: 1,
    CONFIRMED: 1,
    SUBMITTED: 0,
    PENDING: 0,
  };

  const statusStr = order.status?.toUpperCase() || "";
  if (
    statusToStepMap[statusStr] !== undefined &&
    statusToStepMap[statusStr] > activeStepIndex
  ) {
    activeStepIndex = statusToStepMap[statusStr];
  }

  return (
    <div className="flex flex-col w-full animate-in fade-in duration-300 font-sans text-gray-900 pb-12">
      <div ref={topRef} />
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <button
          onClick={onBack}
          className="p-1 hover:bg-gray-100 rounded-lg transition-colors flex items-center justify-center"
        >
          <ArrowLeft className="w-5 h-5 text-gray-800" />
        </button>
        <h2 className="text-2xl font-bold tracking-tight">
          Order{" "}
          {order.orderNumber?.replace("ORD-", "#") ||
            `#${order.id.slice(0, 5)}`}
        </h2>
      </div>

      <div className="flex flex-col gap-10">
        {/* Progress Timeline */}
        <div className="flex w-full items-start justify-between overflow-x-auto hide-scrollbar gap-2">
          {steps.map((step, index) => {
            const isCompleted = index <= activeStepIndex;
            const StepIcon = step.icon;

            return (
              <div key={index} className="flex flex-col flex-1 min-w-[120px]">
                {/* Icon and Line Row */}
                <div className="flex items-center w-full mb-3 gap-2">
                  <StepIcon
                    className={`w-[18px] h-[18px] flex-shrink-0 ${isCompleted ? "text-[#2563eb]" : "text-gray-300"}`}
                    strokeWidth={2.5}
                  />
                  <div
                    className={`h-[3px] rounded-full w-full ${isCompleted ? "bg-[#2563eb]" : "bg-gray-200"}`}
                  />
                </div>
                {/* Text Row */}
                <div className="flex flex-col">
                  <span
                    className={`text-lg font-medium ${isCompleted ? "text-[#0A0A0A]" : "text-gray-500"}`}
                  >
                    {step.label}
                  </span>
                  <span className="text-sm text-[#6A7282] mt-1">
                    Date: {formatDate(step.date)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Order Information Container */}
        <div className="bg-[#F3F4F5] rounded-[16px] p-6 border border-gray-100">
          <div className="flex items-center gap-2 text-xl font-semibold text-[#0A0A0A] mb-6">
            <Box className="w-[18px] h-[18px] text-gray-600" />
            Order Information
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-y-6 gap-x-4">
            <div className="flex flex-col gap-1.5">
              <span className="text-sm text-[#6A7282]">Order ID</span>
              <span className="text-lg text-[#0A0A0A] font-medium">
                {order.orderNumber?.replace("ORD-", "#") || "N/A"}
              </span>
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="text-sm text-[#6A7282]">Order Date</span>
              <span className="text-lg text-[#0A0A0A] font-medium">
                {formatDate(order.timeline?.submittedAt)}
              </span>
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="text-sm text-[#6A7282]">Transaction ID</span>
              <span className="text-lg text-[#0A0A0A] font-medium break-all">
                {order.orderInfo?.transactionId || "N/A"}
              </span>
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="text-sm text-[#6A7282]">Order Status</span>
              <span className="text-lg text-[#0A0A0A] font-medium capitalize">
                {order.status?.toLowerCase() || "N/A"}
              </span>
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="text-sm text-[#6A7282]">Patient Name</span>
              <span className="text-lg text-[#0A0A0A] font-medium">
                {order.orderInfo?.patientName?.name ||
                  order.orderInfo?.patientName ||
                  "N/A"}
              </span>
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="text-sm text-[#6A7282]">Approve by</span>
              <span className="text-lg text-[#0A0A0A] font-medium">
                {order.orderInfo?.approvedBy?.name ||
                  order.orderInfo?.approvedBy ||
                  "N/A"}
              </span>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="flex flex-col">
          <div className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-4 px-1">
            <FileText className="w-[18px] h-[18px] text-gray-600" />
            Order Items
          </div>

          <div className="flex flex-col gap-3">
            {order.items?.map((item: any, idx: number) => (
              <div
                key={idx}
                className="bg-[#F3F4F5] rounded-[16px] p-4 flex items-center justify-between border border-gray-100"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-[#292C2D] border border-gray-200 overflow-hidden relative flex-shrink-0">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover p-1"
                      unoptimized
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-gray-900">
                      {item.name}
                    </span>
                    <span className="text-xs text-[#6A7282] mt-0.5">
                      Size: {item.size || "Standard"}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-sm font-semibold text-gray-900">
                    $
                    {item.totalPrice?.toFixed(2) ||
                      (item.unitPrice * item.quantity).toFixed(2)}
                  </span>
                  <span className="text-xs text-[#6A7282] mt-0.5">
                    Qty: {item.quantity}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Total Amount Bar */}
          <div className="mt-4 bg-[#2563eb] text-white rounded-[12px] px-6 py-4 flex items-center justify-between font-semibold">
            <span className="text-[14px]">Total Amount</span>
            <span className="text-[15px]">${order.total?.toFixed(2)}</span>
          </div>
        </div>

        {/* Shipping Address */}
        <div className="flex flex-col">
          <div className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-4 px-1">
            <MapPin className="w-[18px] h-[18px] text-gray-600" />
            Shipping Address
          </div>
          <div className="bg-[#F3F4F5] rounded-[16px] p-6 border border-gray-100 flex flex-col gap-4">
            <div className="flex justify-between items-start">
              <span className="text-sm text-gray-500">Receiver name:</span>
              <span className="text-sm font-medium text-gray-900 text-right">
                {order.shippingAddress?.name || "N/A"}
              </span>
            </div>
            <div className="flex justify-between items-start">
              <span className="text-sm text-gray-500">Contact number:</span>
              <span className="text-sm font-medium text-gray-900 text-right">
                --
              </span>
            </div>
            <div className="flex justify-between items-start">
              <span className="text-sm text-gray-500">Address:</span>
              <span className="text-sm font-medium text-gray-900 text-right leading-relaxed">
                {order.shippingAddress?.address}
                <br />
                {order.shippingAddress?.city}, {order.shippingAddress?.state}{" "}
                {order.shippingAddress?.zip}
              </span>
            </div>
          </div>
        </div>

        {/* Payment Details */}
        <div className="flex flex-col">
          <div className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-4 px-1">
            <CreditCard className="w-[18px] h-[18px] text-gray-600" />
            Payment Details
          </div>
          <div className="bg-[#F3F4F5] rounded-[16px] p-6 border border-gray-100 flex flex-col gap-4">
            <div className="flex justify-between items-start">
              <span className="text-[13px] text-gray-500">Payment Date:</span>
              <span className="text-[13px] font-medium text-gray-900 text-right">
                {formatDate(order.paymentDetails?.paymentDate)}
              </span>
            </div>
            <div className="flex justify-between items-start">
              <span className="text-sm text-gray-500">Transaction ID:</span>
              <span className="text-sm font-medium text-gray-900 text-right break-all max-w-[60%]">
                {order.paymentDetails?.transactionId || "N/A"}
              </span>
            </div>
            <div className="flex justify-between items-start">
              <span className="text-sm text-gray-500">Card Details:</span>
              <span className="text-sm font-medium text-gray-900 text-right">
                {order.paymentDetails?.cardBrand} **** **** ****{" "}
                {order.paymentDetails?.last4}
              </span>
            </div>
            <div className="flex justify-between items-start">
              <span className="text-sm text-gray-500">Total Amount:</span>
              <span className="text-sm font-medium text-gray-900 text-right">
                ${order.paymentDetails?.totalAmount?.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[13px] text-gray-500">Payment Status:</span>
              <span className="text-[10px] font-bold text-[#10b981] bg-[#d1fae5] px-2.5 py-1 rounded-[6px] uppercase tracking-wide">
                {order.paymentDetails?.paymentStatus || "PAID"}
              </span>
            </div>
          </div>
        </div>

        {/* Shipping Information */}
        <div className="flex flex-col">
          <div className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-4 px-1">
            <Truck className="w-[18px] h-[18px] text-gray-600" />
            Shipping Information
          </div>
          <div className="bg-[#F3F4F5] rounded-[16px] p-6 border border-gray-100 flex flex-col gap-4">
            <div className="flex justify-between items-start">
              <span className="text-sm text-gray-500">Carrier Name:</span>
              <span className="text-sm font-medium text-gray-900 text-right">
                {order.shippingInfo?.trackingCarrier || "Pending"}
              </span>
            </div>
            <div className="flex justify-between items-start">
              <span className="text-sm text-gray-500">
                Tracking Number:
              </span>
              <span className="text-sm font-medium text-gray-900 text-right">
                {order.shippingInfo?.trackingNumber || "Pending"}
              </span>
            </div>
          </div>
        </div>

        {/* View Service Assessment Details Button (Commented out per user request) */}
        
        {order.submission?.id && (
          <div className="mt-2">
            <button 
              onClick={() => onViewSubmission && onViewSubmission(order.submission.id)}
              className="px-5 py-2.5 bg-white border border-gray-300 text-gray-700 font-semibold rounded-full text-[13px] hover:bg-gray-50 transition-colors"
            >
              View Service Assessment Details
            </button>
          </div>
        )}
       
      </div>
    </div>
  );
}
