// "use client";

// import { ArrowLeft } from "lucide-react";
// import Image from "next/image";
// import Link from "next/link";
// import { useState } from "react";
// import RequestRefillModal from "./RequestRefillModal";
// import AssessmentDeclineModal from "./AssessmentDeclineModal";
// import { useSearchParams } from "next/navigation";
// import { useGetConsultationByIdQuery } from "@/Redux/features/doctorDashboard/doctorDashboardApi";

// function QuestionCheckbox({ label, defaultChecked = false }: { label: string; defaultChecked?: boolean }) {

//   const [checked, setChecked] = useState(defaultChecked);
//   return (
//     <label className="flex items-start gap-3 text-sm text-gray-700 cursor-pointer group">
//       <input
//         type="checkbox"
//         checked={checked}
//         onChange={(e) => setChecked(e.target.checked)}
//         className="w-4 h-4 rounded text-blue-600 border-gray-300 focus:ring-blue-500 mt-0.5 cursor-pointer flex-shrink-0"
//       />
//       <span className="group-hover:text-gray-900 transition-colors">{label}</span>
//     </label>
//   );
// }

// function QuestionRadio({ label, name, defaultChecked = false }: { label: string; name: string; defaultChecked?: boolean }) {
//   const [selected, setSelected] = useState(defaultChecked);
//   return (
//     <label className="flex items-start gap-3 text-sm text-gray-700 cursor-pointer group" onClick={() => setSelected(true)}>
//       <input
//         type="radio"
//         name={name}
//         checked={selected}
//         onChange={() => setSelected(true)}
//         className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 mt-0.5 cursor-pointer flex-shrink-0 accent-blue-600"
//       />
//       <span className={`transition-colors ${selected ? "text-gray-900 font-medium" : "group-hover:text-gray-900"}`}>{label}</span>
//     </label>
//   );
// }


// // main component here 

// export default function ConsultationDetails() {

//   const [isRefillModalOpen, setIsRefillModalOpen] = useState(false);
//   const [isDeclineModalOpen, setIsDeclineModalOpen] = useState(false);

//     const searchParams = useSearchParams();

//   const id = searchParams.get("consultationId"); // 👈 THIS IS YOUR ID

//   console.log(id);
//   console.log(id)

//   const { data, isLoading } = useGetConsultationByIdQuery(id);
//   const detailesData=data?.data
//   console.log(detailesData)

//   if (isLoading) return <p>Loading...</p>;



//   return (
//     <div className="mb-12">
//       {/* Back Link */}
//       <Link href="/doctor" className="inline-flex items-center gap-2 text-sm font-semibold text-gray-800 mb-6 hover:text-blue-600 transition-colors">
//         <ArrowLeft className="w-4 h-4" />
//         Weight Loss / GLP-1 Assessment 
//       </Link>

//       <div className="rounded-xl border border-gray-200 bg-white p-4 md:p-6 mb-8">
//         {/* Header */}
//         <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-5">
//           <div className="flex items-center gap-3">
//             <div className="relative w-12 h-12 rounded-full overflow-hidden border border-gray-100">
//               <Image src="/doctor/profile-doc.png" alt="Patient" fill className="object-cover" />
//             </div>
//             <div>
//               <h2 className="text-base font-bold text-gray-900">Patient: Alan Gattuso</h2>
//               <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500 mt-0.5">
//                 <span>Consultation id: #{id}</span>
//                 <span>Submitted: 15 May, 2026</span>
//               </div>
//             </div>
//           </div>
//           <div className="bg-[#eff6ff] text-[#2563eb] text-xs font-semibold px-3 py-1.5 rounded-full w-fit">
//             Weight Loss
//           </div>
//         </div>

//         {/* Cover Image */}
//         <div className="relative w-full h-[240px] md:h-[320px] rounded-xl overflow-hidden mb-5">
//           <Image src="/doctor/doc-1.jpg" alt="Assessment" fill className="object-cover" />
//         </div>

//         <p className="text-gray-600 text-sm leading-relaxed">
//           Weight loss is about more than diet and exercise alone. Weight Loss MD provides medical support to help you overcome these challenges.
//         </p>
//       </div>

//       {/* Questions */}
//       <div className="space-y-4 mb-10">

//         {/* Q1 */}
//         <div className="border border-gray-100 rounded-xl p-5 hover:border-gray-200 transition-colors">
//           <h3 className="font-semibold text-gray-900 text-sm mb-3">How much weight are you looking to lose?</h3>
//           <QuestionRadio label="< 20 lbs" name="weight_goal" defaultChecked />
//         </div>

//         {/* Q2 */}
//         <div className="border border-gray-100 rounded-xl p-5 hover:border-gray-200 transition-colors">
//           <h3 className="font-semibold text-gray-900 text-sm mb-4">What is your age, current weight & height?</h3>
//           <div className="space-y-2 text-sm text-gray-600 mb-4 ml-1">
//             <div className="grid grid-cols-[80px_1fr] gap-2"><span className="text-gray-500">Age:</span><span className="font-medium text-gray-900">24 years</span></div>
//             <div className="grid grid-cols-[80px_1fr] gap-2"><span className="text-gray-500">Height:</span><span className="font-medium text-gray-900">6 feet</span></div>
//             <div className="grid grid-cols-[80px_1fr] gap-2"><span className="text-gray-500">Weight:</span><span className="font-medium text-gray-900">220 lbs</span></div>
//           </div>
//           <div className="bg-[#fce7f3] rounded-lg p-3 px-4 text-xs">
//             <p className="font-semibold text-gray-900 mb-1">Health Snapshot:</p>
//             <p className="text-red-500 font-medium">BMI 29.8 (Overweight)</p>
//           </div>
//         </div>

//         {/* Q3 */}
//         <div className="border border-gray-100 rounded-xl p-5 hover:border-gray-200 transition-colors">
//           <h3 className="font-semibold text-gray-900 text-sm mb-4">What do you want to accomplish with the Weight Loss MD Body Program I want to...</h3>
//           <div className="space-y-3">
//             <QuestionCheckbox label="Lose weight" defaultChecked />
//             <QuestionCheckbox label="Improve my general physical health" defaultChecked />
//             <QuestionCheckbox label="Increase confidence about my appearance" defaultChecked />
//           </div>
//         </div>

//         {/* Q4 */}
//         <div className="border border-gray-100 rounded-xl p-5 hover:border-gray-200 transition-colors">
//           <h3 className="font-semibold text-gray-900 text-sm mb-4">Do you currently have, or have you ever been diagnosed with, any of the following heart or heart-related conditions?</h3>
//           <div className="space-y-3">
//             <QuestionCheckbox label="Atrial fibrillation or flutter" defaultChecked />
//             <QuestionCheckbox label="Heart failure" defaultChecked />
//             <QuestionCheckbox label="Heart disease, stroke, or peripheral vascular disease" defaultChecked />
//             <QuestionCheckbox label="Hypertension (High blood pressure)" defaultChecked />
//           </div>
//         </div>

//         {/* Q5 */}
//         <div className="border border-gray-100 rounded-xl p-5 hover:border-gray-200 transition-colors">
//           <h3 className="font-semibold text-gray-900 text-sm mb-4">Do you currently have, or have you ever been diagnosed with, any of these hormone, kidney, or liver conditions?</h3>
//           <div className="space-y-3">
//             <QuestionCheckbox label="Multiple Endocrine Neoplasia syndrome type 2 (MEN2)" defaultChecked />
//             <QuestionCheckbox label="Family history of thyroid cancer" defaultChecked />
//             <QuestionCheckbox label="Type-2 Diabetes" defaultChecked />
//           </div>
//         </div>

//         {/* Q6 */}
//         <div className="border border-gray-100 rounded-xl p-5 hover:border-gray-200 transition-colors">
//           <h3 className="font-semibold text-gray-900 text-sm mb-4">Do you currently have, or have history of, any of these gastrointestinal conditions or procedures?</h3>
//           <div className="space-y-3">
//             <QuestionCheckbox label="Pancreatitis" defaultChecked />
//             <QuestionCheckbox label="GERD / Acid Reflux requiring insulin" defaultChecked />
//           </div>
//         </div>

//         {/* Q7 */}
//         <div className="border border-gray-100 rounded-xl p-5 hover:border-gray-200 transition-colors">
//           <h3 className="font-semibold text-gray-900 text-sm mb-4">Do you currently have, or have you ever been diagnosed with, any of these additional following conditions?</h3>
//           <div className="space-y-3">
//             <QuestionCheckbox label="Chronic candidiasis (Fungal infection)" defaultChecked />
//             <QuestionCheckbox label="Eating disorder" defaultChecked />
//             <QuestionCheckbox label="Metabolic syndrome" defaultChecked />
//           </div>
//         </div>

//         {/* Q8 */}
//         <div className="border border-gray-100 rounded-xl p-5 hover:border-gray-200 transition-colors">
//           <h3 className="font-semibold text-gray-900 text-sm mb-3">Do you have an ALLERGY to GLP-1 agonist medications?</h3>
//           <QuestionRadio label="No, I do not have an allergy to GLP-1 medication" name="allergy" defaultChecked />
//         </div>

//         {/* Q9 */}
//         <div className="border border-gray-100 rounded-xl p-5 hover:border-gray-200 transition-colors">
//           <h3 className="font-semibold text-gray-900 text-sm mb-3">Are you currently taking a GLP-1 medication in the past 30 days?</h3>
//           <QuestionRadio label="No, I am not currently taking a GLP-1 medication in the past 30 days." name="glp1_current" defaultChecked />
//         </div>

//         {/* Q10 */}
//         <div className="border border-gray-100 rounded-xl p-5 hover:border-gray-200 transition-colors">
//           <h3 className="font-semibold text-gray-900 text-sm mb-4">Do you currently take any of the following medications?</h3>
//           <div className="space-y-3">
//             <QuestionCheckbox label="Insulin" defaultChecked />
//             <QuestionCheckbox label="Diuretics such as (but not limited to) furosemide (Lasix), bumetanide (Bumex), hydrochlorothiazide/HCTZ" defaultChecked />
//           </div>
//         </div>

//         {/* Q11 */}
//         <div className="border border-gray-100 rounded-xl p-5 hover:border-gray-200 transition-colors">
//           <h3 className="font-semibold text-gray-900 text-sm mb-3">Do you take any medications?</h3>
//           <QuestionRadio label="I don't take any medications" name="other_meds" defaultChecked />
//         </div>

//         {/* Q12 */}
//         <div className="border border-gray-100 rounded-xl p-5 hover:border-gray-200 transition-colors">
//           <h3 className="font-semibold text-gray-900 text-sm mb-3">Is there anything else you want your healthcare provider to know about your health?</h3>
//           <QuestionRadio label="No" name="extra_info" defaultChecked />
//         </div>
//       </div>

//       {/* Summary Section */}
//       <div className="rounded-xl border border-gray-200 bg-white p-4 md:p-6 mb-4">
//         <h3 className="text-lg font-bold text-gray-900 mb-1">Product & Payment Summary</h3>
//         <p className="text-sm text-gray-500 mb-6">Patient selected two products:</p>

//         <div className="flex flex-col md:flex-row justify-between gap-8">
//           <div className="flex-1 flex flex-col gap-4">
//             {/* Product 1 */}
//             <div className="flex items-center gap-4 bg-gray-50/50 p-3 rounded-xl border border-gray-100">
//               <div className="w-12 h-12 bg-[#1e293b] rounded-lg relative overflow-hidden flex-shrink-0">
//                 <Image src="/doctor/doc-1.jpg" alt="Product" fill className="object-cover opacity-70" />
//               </div>
//               <div className="flex-1">
//                 <div className="flex justify-between items-center mb-0.5">
//                   <h4 className="font-semibold text-sm text-gray-900">Phentermine</h4>
//                   <span className="font-semibold text-sm text-blue-600">$48</span>
//                 </div>
//                 <p className="text-xs text-gray-500">Medium Flora, Bone Marrow, Butter</p>
//               </div>
//             </div>
//             {/* Product 2 */}
//             <div className="flex items-center gap-4 bg-gray-50/50 p-3 rounded-xl border border-gray-100">
//               <div className="w-12 h-12 bg-[#1e293b] rounded-lg relative overflow-hidden flex-shrink-0">
//                 <Image src="/doctor/doc-2.jpg" alt="Product" fill className="object-cover opacity-70" />
//               </div>
//               <div className="flex-1">
//                 <div className="flex justify-between items-center mb-0.5">
//                   <h4 className="font-semibold text-sm text-gray-900">Vitamin C Ascorbic Acid</h4>
//                   <span className="font-semibold text-sm text-blue-600">$48</span>
//                 </div>
//                 <p className="text-xs text-gray-500">Medium Flora, Bone Marrow, Butter</p>
//               </div>
//             </div>
//           </div>

//           <div className="w-full md:w-64 space-y-2.5 text-sm pt-2 md:pt-0">
//             <div className="flex justify-between text-gray-500 font-medium">
//               <span>Subtotal</span><span>$96.00</span>
//             </div>
//             <div className="flex justify-between text-gray-500 font-medium">
//               <span>Service Duration</span><span>1 month</span>
//             </div>
//             <div className="flex justify-between text-gray-500 font-medium">
//               <span>Service Fees</span><span>$20.00</span>
//             </div>
//             <div className="flex justify-between text-gray-500 font-medium">
//               <span>Shipping charge</span><span>$10.00</span>
//             </div>
//             <div className="flex justify-between text-gray-500 font-medium">
//               <span>Discount</span><span className="text-green-600">-$15.00</span>
//             </div>
//             <div className="flex justify-between font-bold text-gray-900 pt-3 border-t border-gray-200 mt-3">
//               <span>Total</span>
//               <span className="text-blue-600">$151.00</span>
//             </div>
//             <div className="flex justify-between items-center pt-2">
//               <span className="text-gray-500 font-medium">Payment Status:</span>
//               <span className="bg-[#eff6ff] text-[#2563eb] text-xs font-semibold px-2.5 py-1 rounded-md">Paid</span>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Bottom Actions */}
//       <div className="flex flex-wrap gap-4 mt-8">
//         <button className="bg-[#2563eb] hover:bg-blue-700 transition-colors text-white text-sm font-semibold py-2.5 px-6 rounded-full shadow-sm">
//           Approve & Provide Consultation
//         </button>
//         <button
//           onClick={() => setIsRefillModalOpen(true)}
//           className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-colors text-sm font-semibold py-2.5 px-6 rounded-full shadow-sm"
//         >
//           Request Refill Information
//         </button>
//         <button
//           onClick={() => setIsDeclineModalOpen(true)}
//           className="bg-white border border-red-200 text-red-500 hover:bg-red-50 hover:border-red-300 transition-colors text-sm font-semibold py-2.5 px-8 rounded-full shadow-sm"
//         >
//           Decline
//         </button>
//       </div>

//       {/* Request Refill Modal */}
//       <RequestRefillModal
//         isOpen={isRefillModalOpen}
//         onClose={() => setIsRefillModalOpen(false)}
//         patientName="Alan Gattuso"
//         consultationId={id}
//         submittedDate="15 May, 2026"
//       />

//       {/* Assessment Decline Modal */}
//       <AssessmentDeclineModal
//         isOpen={isDeclineModalOpen}
//         onClose={() => setIsDeclineModalOpen(false)}
//         patientName="Alan Gattuso"
//         consultationId={id}
//         submittedDate="15 May, 2026"
//       />
//     </div>
//   );
// }




"use client";

import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import RequestRefillModal from "./RequestRefillModal";
import AssessmentDeclineModal from "./AssessmentDeclineModal";
import { useSearchParams } from "next/navigation";
import { useGetConsultationByIdQuery } from "@/Redux/features/doctorDashboard/doctorDashboardApi";

/**
 * Single checkbox row — PURE DISPLAY, not interactive.
 * `checked` is decided entirely by the backend data (is this option's id in
 * patientAnswer.selectedOptions). No useState, no onChange — clicking does nothing.
 * - checked   -> dark/bold label, normal opacity
 * - unchecked -> still rendered (so the doctor sees the full option list), but dimmed
 */
function QuestionCheckbox({ label, checked }: { label: string; checked: boolean }) {
  return (
    <div className={`flex items-start gap-3 text-sm transition-opacity ${checked ? "text-gray-700" : "opacity-60"}`}>
      <input
        type="checkbox"
        checked={checked}
        disabled
        readOnly
        className="w-4 h-4 rounded text-blue-600 border-gray-300 mt-0.5 flex-shrink-0 cursor-default"
      />
      <span className={checked ? "text-gray-900 font-medium" : "text-gray-400"}>{label}</span>
    </div>
  );
}

/**
 * Single radio row — PURE DISPLAY, not interactive. Same logic as the checkbox above.
 */
function QuestionRadio({ label, name, checked }: { label: string; name: string; checked: boolean }) {
  return (
    <div className={`flex items-start gap-3 text-sm transition-opacity ${checked ? "text-gray-700" : "opacity-60"}`}>
      <input
        type="radio"
        name={name}
        checked={checked}
        disabled
        readOnly
        className="w-4 h-4 text-blue-600 border-gray-300 mt-0.5 flex-shrink-0 cursor-default accent-blue-600"
      />
      <span className={checked ? "text-gray-900 font-medium" : "text-gray-400"}>{label}</span>
    </div>
  );
}


// main component here 

export default function ConsultationDetails() {

  const [isRefillModalOpen, setIsRefillModalOpen] = useState(false);
  const [isDeclineModalOpen, setIsDeclineModalOpen] = useState(false);

    const searchParams = useSearchParams();

  const id = searchParams.get("consultationId"); // 👈 THIS IS YOUR ID

  const { data, isLoading } = useGetConsultationByIdQuery(id);
  const detailesData = data?.data; // full submission object from backend (see your sample payload)

  if (isLoading) return <p>Loading...</p>;

  // Pull out the pieces we render below. Optional chaining so nothing crashes
  // if a field is missing while the API/shape is still settling.
  const assessment = detailesData?.assessment; // { id, title, thumbnail, category, ... }
  const questions = detailesData?.questions || []; // dynamic length, can be 1 question or 50
  const paymentSummary = detailesData?.paymentSummary; // { products, subtotal, ... }

  // Backend doesn't send a dedicated `patientName` field yet.
  // We fall back to whichever question's text contains "name" (matches your
  // "Your name?" question) and use its typed answer as the patient's name.
  const nameQuestion = questions.find((q: any) => q.questionText?.toLowerCase().includes("name"));
  const patientName = nameQuestion?.patientAnswer?.textResponse || "Patient";

  return (
    <div className="mb-12">
      {/* Back Link — text now comes from assessment.title instead of being hardcoded */}
      <Link href="/doctor" className="inline-flex items-center gap-2 text-sm font-semibold text-gray-800 mb-6 hover:text-blue-600 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        {assessment?.title}
      </Link>

      <div className="rounded-xl border border-gray-200 bg-white p-4 md:p-6 mb-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-5">
          <div className="flex items-center gap-3">
            <div className="relative w-12 h-12 rounded-full overflow-hidden border border-gray-100">
              <Image src="/doctor/profile-doc.png" alt="Patient" fill className="object-cover" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">Patient: {patientName}</h2>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500 mt-0.5">
                {/* `id` is the URL query param (?consultationId=...), kept exactly as before */}
                <span>Consultation id: #{id}</span>
                {/* submittedAt isn't in your sample payload yet — will just be blank until backend sends it */}
                <span>Submitted: {detailesData?.submittedAt}</span>
              </div>
            </div>
          </div>
          {/* category pill — was hardcoded "Weight Loss", now assessment.category */}
          <div className="bg-[#eff6ff] text-[#2563eb] text-xs font-semibold px-3 py-1.5 rounded-full w-fit">
            {assessment?.category}
          </div>
        </div>

        {/* Cover Image — now assessment.thumbnail (the signed S3 URL) instead of a static file */}
        <div className="relative w-full h-[240px] md:h-[320px] rounded-xl overflow-hidden mb-5">
          <Image src={assessment?.thumbnail} alt="Assessment" fill className="object-cover" />
        </div>

        {/* description isn't in your sample payload yet — will be blank until backend sends it */}
        <p className="text-gray-600 text-sm leading-relaxed">
          {assessment?.description}
        </p>
      </div>

      {/* Questions — loops over the dynamic `questions` array from backend */}
      <div className="space-y-4 mb-10">
        {questions.map((question: any) => {
          // ids of the option(s) the patient actually picked
          const selectedIds: string[] = question.patientAnswer?.selectedOptions || [];
          const options = question.options || [];
          const file = question.patientAnswer?.file;
          const textResponse = question.patientAnswer?.textResponse;

          // Decide which UI to render for this question:
          // 1) Trust the backend's own `type` field when it explicitly says CHECKBOX or RADIO.
          // 2) If `type` is something else/unknown but the question still has options,
          //    guess from the answer shape: more than one selected id -> treat as checkbox,
          //    otherwise treat as radio. This keeps future/unexpected type values from breaking.
          const isCheckboxStyle =
            question.type === "CHECKBOX" ||
            (question.type !== "RADIO" && options.length > 0 && selectedIds.length > 1);
          const isRadioStyle = options.length > 0 && !isCheckboxStyle;

          return (
            <div key={question.id} className="border border-gray-100 rounded-xl p-5 hover:border-gray-200 transition-colors">
              {isCheckboxStyle ? (
                // ----- CHECKBOX question -----
                // Render EVERY option (not just selected ones). Each box is checked
                // if its id is in selectedIds, unchecked + muted otherwise.
                <>
                  <h3 className="font-semibold text-gray-900 text-sm mb-4">{question.questionText}</h3>
                  <div className="space-y-3">
                    {options.map((opt: any) => (
                      <QuestionCheckbox
                        key={opt.id}
                        label={opt.label}
                        checked={selectedIds.includes(opt.id)}
                      />
                    ))}
                  </div>
                </>
              ) : isRadioStyle ? (
                // ----- RADIO question -----
                // Same idea as checkbox: render every option, only the matching one
                // shows as selected/bold, the rest are muted.
                <>
                  <h3 className="font-semibold text-gray-900 text-sm mb-3">{question.questionText}</h3>
                  <div className="space-y-3">
                    {options.map((opt: any) => (
                      <QuestionRadio
                        key={opt.id}
                        label={opt.label}
                        name={question.id}
                        checked={selectedIds.includes(opt.id)}
                      />
                    ))}
                  </div>
                </>
              ) : file ? (
                // ----- File-upload answer ----- (no options, patientAnswer.file is set)
                <>
                  <h3 className="font-semibold text-gray-900 text-sm mb-3">{question.questionText}</h3>
                  <a
                    href={file}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 font-medium hover:underline"
                  >
                    View attached file
                  </a>
                </>
              ) : (
                // ----- Free text answer ----- (covers type: "INPUT" and any other text-based type)
                <>
                  <h3 className="font-semibold text-gray-900 text-sm mb-3">{question.questionText}</h3>
                  <p className="text-sm text-gray-900 font-medium">{textResponse || "—"}</p>
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* Summary Section — products list now comes from paymentSummary.products */}
      <div className="rounded-xl border border-gray-200 bg-white p-4 md:p-6 mb-4">
        <h3 className="text-lg font-bold text-gray-900 mb-1">Product & Payment Summary</h3>
        <p className="text-sm text-gray-500 mb-6">Patient selected two products:</p>

        <div className="flex flex-col md:flex-row justify-between gap-8">
          <div className="flex-1 flex flex-col gap-4">
            {paymentSummary?.products?.map((product: any, idx: number) => (
              <div key={idx} className="flex items-center gap-4 bg-gray-50/50 p-3 rounded-xl border border-gray-100">
                <div className="w-12 h-12 bg-[#1e293b] rounded-lg relative overflow-hidden flex-shrink-0">
                  <Image src={product.image} alt="Product" fill className="object-cover opacity-70" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-0.5">
                    <h4 className="font-semibold text-sm text-gray-900">{product.name}</h4>
                    <span className="font-semibold text-sm text-blue-600">${product.price}</span>
                  </div>
                  <p className="text-xs text-gray-500">{product.size}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Right-side cost breakdown — every line now reads from paymentSummary */}
          <div className="w-full md:w-64 space-y-2.5 text-sm pt-2 md:pt-0">
            <div className="flex justify-between text-gray-500 font-medium">
              <span>Subtotal</span><span>${paymentSummary?.subtotal?.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-500 font-medium">
              <span>Service Duration</span><span>{paymentSummary?.serviceDuration}</span>
            </div>
            <div className="flex justify-between text-gray-500 font-medium">
              <span>Service Fees</span><span>${paymentSummary?.serviceFees?.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-500 font-medium">
              <span>Shipping charge</span><span>${paymentSummary?.shippingCharge?.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-500 font-medium">
              <span>Discount</span><span className="text-green-600">-${paymentSummary?.discount?.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-gray-900 pt-3 border-t border-gray-200 mt-3">
              <span>Total</span>
              <span className="text-blue-600">${paymentSummary?.total?.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center pt-2">
              <span className="text-gray-500 font-medium">Payment Status:</span>
              {/* "Paid" left as-is since your sample payload has no paymentStatus field — swap in the real field once it exists */}
              <span className="bg-[#eff6ff] text-[#2563eb] text-xs font-semibold px-2.5 py-1 rounded-md">Paid</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Actions — unchanged, always visible like the original */}
      <div className="flex flex-wrap gap-4 mt-8">
        <button className="bg-[#2563eb] hover:bg-blue-700 transition-colors text-white text-sm font-semibold py-2.5 px-6 rounded-full shadow-sm">
          Approve & Provide Consultation
        </button>
        <button
          onClick={() => setIsRefillModalOpen(true)}
          className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-colors text-sm font-semibold py-2.5 px-6 rounded-full shadow-sm"
        >
          Request Refill Information
        </button>
        <button
          onClick={() => setIsDeclineModalOpen(true)}
          className="bg-white border border-red-200 text-red-500 hover:bg-red-50 hover:border-red-300 transition-colors text-sm font-semibold py-2.5 px-8 rounded-full shadow-sm"
        >
          Decline
        </button>
      </div>

      {/* Request Refill Modal — patientName/consultationId/submittedDate now dynamic */}
      <RequestRefillModal
        isOpen={isRefillModalOpen}
        onClose={() => setIsRefillModalOpen(false)}
        patientName={patientName}
        consultationId={id}
        submittedDate={detailesData?.submittedAt}
      />

      {/* Assessment Decline Modal — same dynamic props as above */}
      <AssessmentDeclineModal
        isOpen={isDeclineModalOpen}
        onClose={() => setIsDeclineModalOpen(false)}
        patientName={patientName}
        consultationId={id}
        submittedDate={detailesData?.submittedAt}
      />
    </div>
  );
}