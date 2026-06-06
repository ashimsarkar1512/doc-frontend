"use client";

import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

function QuestionCheckbox({ label, defaultChecked = false }: { label: string; defaultChecked?: boolean }) {
  const [checked, setChecked] = useState(defaultChecked);
  return (
    <label className="flex items-start gap-3 text-sm text-gray-700 cursor-pointer group">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => setChecked(e.target.checked)}
        className="w-4 h-4 rounded text-blue-600 border-gray-300 focus:ring-blue-500 mt-0.5 cursor-pointer flex-shrink-0"
      />
      <span className="group-hover:text-gray-900 transition-colors">{label}</span>
    </label>
  );
}

function QuestionRadio({ label, name, defaultChecked = false }: { label: string; name: string; defaultChecked?: boolean }) {
  const [selected, setSelected] = useState(defaultChecked);
  return (
    <label className="flex items-start gap-3 text-sm text-gray-700 cursor-pointer group" onClick={() => setSelected(true)}>
      <input
        type="radio"
        name={name}
        checked={selected}
        onChange={() => setSelected(true)}
        className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 mt-0.5 cursor-pointer flex-shrink-0 accent-blue-600"
      />
      <span className={`transition-colors ${selected ? "text-gray-900 font-medium" : "group-hover:text-gray-900"}`}>{label}</span>
    </label>
  );
}


export default function ConsultationDetails({ id }: { id: string }) {
  return (
    <div className="mb-12">
      {/* Back Link */}
      <Link href="/doctor" className="inline-flex items-center gap-2 text-sm font-semibold text-gray-800 mb-6 hover:text-blue-600 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Weight Loss / GLP-1 Assessment
      </Link>

      <div className="rounded-xl border border-gray-200 bg-white p-4 md:p-6 mb-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-5">
          <div className="flex items-center gap-3">
            <div className="relative w-12 h-12 rounded-full overflow-hidden border border-gray-100">
              <Image src="/doctor/profile-doc.png" alt="Patient" fill className="object-cover" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">Patient: Alan Gattuso</h2>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500 mt-0.5">
                <span>Consultation id: #{id}</span>
                <span>Submitted: 15 May, 2026</span>
              </div>
            </div>
          </div>
          <div className="bg-[#eff6ff] text-[#2563eb] text-xs font-semibold px-3 py-1.5 rounded-full w-fit">
            Weight Loss
          </div>
        </div>

        {/* Cover Image */}
        <div className="relative w-full h-[240px] md:h-[320px] rounded-xl overflow-hidden mb-5">
          <Image src="/doctor/doc-1.jpg" alt="Assessment" fill className="object-cover" />
        </div>

        <p className="text-gray-600 text-sm leading-relaxed">
          Weight loss is about more than diet and exercise alone. Weight Loss MD provides medical support to help you overcome these challenges.
        </p>
      </div>

      {/* Questions */}
      <div className="space-y-4 mb-10">

        {/* Q1 */}
        <div className="border border-gray-100 rounded-xl p-5 hover:border-gray-200 transition-colors">
          <h3 className="font-semibold text-gray-900 text-sm mb-3">How much weight are you looking to lose?</h3>
          <QuestionRadio label="< 20 lbs" name="weight_goal" defaultChecked />
        </div>

        {/* Q2 */}
        <div className="border border-gray-100 rounded-xl p-5 hover:border-gray-200 transition-colors">
          <h3 className="font-semibold text-gray-900 text-sm mb-4">What is your age, current weight & height?</h3>
          <div className="space-y-2 text-sm text-gray-600 mb-4 ml-1">
            <div className="grid grid-cols-[80px_1fr] gap-2"><span className="text-gray-500">Age:</span><span className="font-medium text-gray-900">24 years</span></div>
            <div className="grid grid-cols-[80px_1fr] gap-2"><span className="text-gray-500">Height:</span><span className="font-medium text-gray-900">6 feet</span></div>
            <div className="grid grid-cols-[80px_1fr] gap-2"><span className="text-gray-500">Weight:</span><span className="font-medium text-gray-900">220 lbs</span></div>
          </div>
          <div className="bg-[#fce7f3] rounded-lg p-3 px-4 text-xs">
            <p className="font-semibold text-gray-900 mb-1">Health Snapshot:</p>
            <p className="text-red-500 font-medium">BMI 29.8 (Overweight)</p>
          </div>
        </div>

        {/* Q3 */}
        <div className="border border-gray-100 rounded-xl p-5 hover:border-gray-200 transition-colors">
          <h3 className="font-semibold text-gray-900 text-sm mb-4">What do you want to accomplish with the Weight Loss MD Body Program I want to...</h3>
          <div className="space-y-3">
            <QuestionCheckbox label="Lose weight" defaultChecked />
            <QuestionCheckbox label="Improve my general physical health" defaultChecked />
            <QuestionCheckbox label="Increase confidence about my appearance" defaultChecked />
          </div>
        </div>

        {/* Q4 */}
        <div className="border border-gray-100 rounded-xl p-5 hover:border-gray-200 transition-colors">
          <h3 className="font-semibold text-gray-900 text-sm mb-4">Do you currently have, or have you ever been diagnosed with, any of the following heart or heart-related conditions?</h3>
          <div className="space-y-3">
            <QuestionCheckbox label="Atrial fibrillation or flutter" defaultChecked />
            <QuestionCheckbox label="Heart failure" defaultChecked />
            <QuestionCheckbox label="Heart disease, stroke, or peripheral vascular disease" defaultChecked />
            <QuestionCheckbox label="Hypertension (High blood pressure)" defaultChecked />
          </div>
        </div>

        {/* Q5 */}
        <div className="border border-gray-100 rounded-xl p-5 hover:border-gray-200 transition-colors">
          <h3 className="font-semibold text-gray-900 text-sm mb-4">Do you currently have, or have you ever been diagnosed with, any of these hormone, kidney, or liver conditions?</h3>
          <div className="space-y-3">
            <QuestionCheckbox label="Multiple Endocrine Neoplasia syndrome type 2 (MEN2)" defaultChecked />
            <QuestionCheckbox label="Family history of thyroid cancer" defaultChecked />
            <QuestionCheckbox label="Type-2 Diabetes" defaultChecked />
          </div>
        </div>

        {/* Q6 */}
        <div className="border border-gray-100 rounded-xl p-5 hover:border-gray-200 transition-colors">
          <h3 className="font-semibold text-gray-900 text-sm mb-4">Do you currently have, or have history of, any of these gastrointestinal conditions or procedures?</h3>
          <div className="space-y-3">
            <QuestionCheckbox label="Pancreatitis" defaultChecked />
            <QuestionCheckbox label="GERD / Acid Reflux requiring insulin" defaultChecked />
          </div>
        </div>

        {/* Q7 */}
        <div className="border border-gray-100 rounded-xl p-5 hover:border-gray-200 transition-colors">
          <h3 className="font-semibold text-gray-900 text-sm mb-4">Do you currently have, or have you ever been diagnosed with, any of these additional following conditions?</h3>
          <div className="space-y-3">
            <QuestionCheckbox label="Chronic candidiasis (Fungal infection)" defaultChecked />
            <QuestionCheckbox label="Eating disorder" defaultChecked />
            <QuestionCheckbox label="Metabolic syndrome" defaultChecked />
          </div>
        </div>

        {/* Q8 */}
        <div className="border border-gray-100 rounded-xl p-5 hover:border-gray-200 transition-colors">
          <h3 className="font-semibold text-gray-900 text-sm mb-3">Do you have an ALLERGY to GLP-1 agonist medications?</h3>
          <QuestionRadio label="No, I do not have an allergy to GLP-1 medication" name="allergy" defaultChecked />
        </div>

        {/* Q9 */}
        <div className="border border-gray-100 rounded-xl p-5 hover:border-gray-200 transition-colors">
          <h3 className="font-semibold text-gray-900 text-sm mb-3">Are you currently taking a GLP-1 medication in the past 30 days?</h3>
          <QuestionRadio label="No, I am not currently taking a GLP-1 medication in the past 30 days." name="glp1_current" defaultChecked />
        </div>

        {/* Q10 */}
        <div className="border border-gray-100 rounded-xl p-5 hover:border-gray-200 transition-colors">
          <h3 className="font-semibold text-gray-900 text-sm mb-4">Do you currently take any of the following medications?</h3>
          <div className="space-y-3">
            <QuestionCheckbox label="Insulin" defaultChecked />
            <QuestionCheckbox label="Diuretics such as (but not limited to) furosemide (Lasix), bumetanide (Bumex), hydrochlorothiazide/HCTZ" defaultChecked />
          </div>
        </div>

        {/* Q11 */}
        <div className="border border-gray-100 rounded-xl p-5 hover:border-gray-200 transition-colors">
          <h3 className="font-semibold text-gray-900 text-sm mb-3">Do you take any medications?</h3>
          <QuestionRadio label="I don't take any medications" name="other_meds" defaultChecked />
        </div>

        {/* Q12 */}
        <div className="border border-gray-100 rounded-xl p-5 hover:border-gray-200 transition-colors">
          <h3 className="font-semibold text-gray-900 text-sm mb-3">Is there anything else you want your healthcare provider to know about your health?</h3>
          <QuestionRadio label="No" name="extra_info" defaultChecked />
        </div>
      </div>

      {/* Summary Section */}
      <div className="rounded-xl border border-gray-200 bg-white p-4 md:p-6 mb-4">
        <h3 className="text-lg font-bold text-gray-900 mb-1">Product & Payment Summary</h3>
        <p className="text-sm text-gray-500 mb-6">Patient selected two products:</p>

        <div className="flex flex-col md:flex-row justify-between gap-8">
          <div className="flex-1 flex flex-col gap-4">
            {/* Product 1 */}
            <div className="flex items-center gap-4 bg-gray-50/50 p-3 rounded-xl border border-gray-100">
              <div className="w-12 h-12 bg-[#1e293b] rounded-lg relative overflow-hidden flex-shrink-0">
                <Image src="/doctor/doc-1.jpg" alt="Product" fill className="object-cover opacity-70" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-0.5">
                  <h4 className="font-semibold text-sm text-gray-900">Phentermine</h4>
                  <span className="font-semibold text-sm text-blue-600">$48</span>
                </div>
                <p className="text-xs text-gray-500">Medium Flora, Bone Marrow, Butter</p>
              </div>
            </div>
            {/* Product 2 */}
            <div className="flex items-center gap-4 bg-gray-50/50 p-3 rounded-xl border border-gray-100">
              <div className="w-12 h-12 bg-[#1e293b] rounded-lg relative overflow-hidden flex-shrink-0">
                <Image src="/doctor/doc-2.jpg" alt="Product" fill className="object-cover opacity-70" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-0.5">
                  <h4 className="font-semibold text-sm text-gray-900">Vitamin C Ascorbic Acid</h4>
                  <span className="font-semibold text-sm text-blue-600">$48</span>
                </div>
                <p className="text-xs text-gray-500">Medium Flora, Bone Marrow, Butter</p>
              </div>
            </div>
          </div>

          <div className="w-full md:w-64 space-y-2.5 text-sm pt-2 md:pt-0">
            <div className="flex justify-between text-gray-500 font-medium">
              <span>Subtotal</span><span>$96.00</span>
            </div>
            <div className="flex justify-between text-gray-500 font-medium">
              <span>Service Duration</span><span>1 month</span>
            </div>
            <div className="flex justify-between text-gray-500 font-medium">
              <span>Service Fees</span><span>$20.00</span>
            </div>
            <div className="flex justify-between text-gray-500 font-medium">
              <span>Shipping charge</span><span>$10.00</span>
            </div>
            <div className="flex justify-between text-gray-500 font-medium">
              <span>Discount</span><span className="text-green-600">-$15.00</span>
            </div>
            <div className="flex justify-between font-bold text-gray-900 pt-3 border-t border-gray-200 mt-3">
              <span>Total</span>
              <span className="text-blue-600">$151.00</span>
            </div>
            <div className="flex justify-between items-center pt-2">
              <span className="text-gray-500 font-medium">Payment Status:</span>
              <span className="bg-[#eff6ff] text-[#2563eb] text-xs font-semibold px-2.5 py-1 rounded-md">Paid</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="flex flex-wrap gap-4 mt-8">
        <button className="bg-[#2563eb] hover:bg-blue-700 transition-colors text-white text-sm font-semibold py-2.5 px-6 rounded-full shadow-sm">
          Approve & Provide Consultation
        </button>
        <button className="bg-white border border-red-200 text-red-500 hover:bg-red-50 hover:border-red-300 transition-colors text-sm font-semibold py-2.5 px-8 rounded-full shadow-sm">
          Decline
        </button>
      </div>
    </div>
  );
}
