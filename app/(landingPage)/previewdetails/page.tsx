"use client";

import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/shared/Navbar";
import { Check, ShieldCheck } from "lucide-react";

type CartItem = {
  id: number;
  name: string;
  price: number;
  image: string;
  selectedSize: string;
};

const CART: CartItem[] = [
  { id: 2, name: "Phentermine", price: 48, image: "/medicine-2.png", selectedSize: "37.5mg" },
  { id: 9, name: "Vitamin C Ascorbic Acid", price: 48, image: "/medicine-5.png", selectedSize: "10ml" },
];

export default function PreviewDetailsPage() {
  const subtotal = 96.00;
  const serviceDuration = "1 month";
  const serviceFees = 50.00;
  const shipping = 20.00;
  const discount = 15.00;
  const total = subtotal + serviceFees + shipping - discount;

  // Reusable components for styling
  const Card = ({ children }: { children: React.ReactNode }) => (
    <div className="border border-gray-200 rounded-xl p-5 mb-4 bg-white">
      {children}
    </div>
  );

  const Question = ({ text }: { text: string }) => (
    <h3 className="text-[14px] font-bold text-gray-900 mb-4">{text}</h3>
  );

  const CheckboxRow = ({ text }: { text: string }) => (
    <div className="flex items-start gap-3 mb-3 last:mb-0">
      <div className="w-4 h-4 rounded bg-[#2563EB] flex items-center justify-center mt-0.5 shrink-0">
        <Check className="w-3 h-3 text-white" strokeWidth={3} />
      </div>
      <span className="text-[13px] text-gray-600 leading-snug">{text}</span>
    </div>
  );

  const RadioRow = ({ text }: { text: string }) => (
    <div className="flex items-center gap-3">
      <div className="w-4 h-4 rounded-full border-[4.5px] border-[#2563EB] shrink-0" />
      <span className="text-[13px] text-gray-600 leading-snug">{text}</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-white pb-10">
      <Navbar variant="dark" />
      <div className="pt-32 max-w-[850px] mx-auto px-4 sm:px-6">
        
        <h1 className="text-[18px] font-bold text-gray-900 mb-6">Preview details</h1>

        <div className="flex flex-col">
          
          {/* Card 1: Patient info & image */}
          <Card>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 shrink-0">
                <img src="https://i.pravatar.cc/150?img=11" alt="Patient" className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="text-[14px] font-bold text-gray-900 leading-tight">Patient: Alan Cattach</p>
                <p className="text-[12px] text-gray-500">Consultation id: #001237</p>
              </div>
            </div>

            <div className="relative w-full h-[300px] md:h-[400px] rounded-xl overflow-hidden mb-4 bg-gray-200">
              <Image 
                src="https://images.unsplash.com/photo-1616847209156-6549c47e8c3b?q=80&w=2000&auto=format&fit=crop" 
                alt="Weight loss" 
                fill 
                className="object-cover"
              />
            </div>

            <p className="text-[12px] text-gray-500">
              Weight loss is about more than diet and exercise alone. Weight Loss MD provides medical support to help you overcome these challenges.
            </p>
          </Card>

          {/* Card 2 */}
          <Card>
            <Question text="How much weight are you looking to lose?" />
            <RadioRow text="< 20 lbs" />
          </Card>

          {/* Card 3 */}
          <Card>
            <Question text="What is your age, current weight & height?" />
            <div className="flex flex-col gap-3 mb-5">
              <div className="flex text-[13px]">
                <span className="w-20 text-gray-500">Age:</span>
                <span className="text-gray-800">26 years</span>
              </div>
              <div className="flex text-[13px]">
                <span className="w-20 text-gray-500">Height:</span>
                <span className="text-gray-800">6 feet</span>
              </div>
              <div className="flex text-[13px]">
                <span className="w-20 text-gray-500">Weight:</span>
                <span className="text-gray-800">220 lbs</span>
              </div>
            </div>
            
            <div className="bg-[#FDF0EE] rounded-lg p-4">
              <p className="text-[13px] font-bold text-gray-900 mb-0.5">Health Snapshot:</p>
              <p className="text-[13px] text-[#EF4444]">BMI: 29.8 (Overweight)</p>
            </div>
          </Card>

          {/* Card 4 */}
          <Card>
            <Question text="What do you want to accomplish with the Weight Loss MD Body Program I want to..." />
            <CheckboxRow text="Lose weight" />
            <CheckboxRow text="Improve my general physical health" />
            <CheckboxRow text="Increase confidence about my appearance" />
          </Card>

          {/* Card 5 */}
          <Card>
            <Question text="Do you currently have, or have you ever been diagnosed with, any of the following heart or heart-related conditions?" />
            <CheckboxRow text="Atrial fibrillation or flutter" />
            <CheckboxRow text="Heart failure" />
            <CheckboxRow text="Heart disease, stroke, or peripheral vascular disease" />
            <CheckboxRow text="Hypertension (high blood pressure)" />
          </Card>

          {/* Card 6 */}
          <Card>
            <Question text="Do you currently have, or have you ever been diagnosed with, any of these hormone, kidney, or liver conditions?" />
            <CheckboxRow text="Multiple Endocrine Neoplasia syndrome type 2 (MEN2)" />
            <CheckboxRow text="Family history of thyroid cancer" />
            <CheckboxRow text="Type 2 Diabetes" />
          </Card>

          {/* Card 7 */}
          <Card>
            <Question text="Do you currently have, or have history of, any of these gastrointestinal conditions or procedures?" />
            <CheckboxRow text="Pancreatitis" />
            <CheckboxRow text="GERD / Acid Reflux requiring insulin" />
          </Card>

          {/* Card 8 */}
          <Card>
            <Question text="Do you currently have, or have you ever been diagnosed with, any of these additional following conditions?" />
            <CheckboxRow text="Chronic candidiasis (fungal infection)" />
            <CheckboxRow text="Eating disorder" />
            <CheckboxRow text="Metabolic syndrome" />
          </Card>

          {/* Card 9 */}
          <Card>
            <Question text="Do you have an ALLERGY to GLP-1 agonist medications?" />
            <RadioRow text="No, I do not have an allergy to GLP-1 medication" />
          </Card>

          {/* Card 10 */}
          <Card>
            <Question text="Are you currently taking a GLP-1 medication in the past 30 days?" />
            <RadioRow text="No, I am not currently taking a GLP-1 medication in the past 30 days." />
          </Card>

          {/* Card 11 */}
          <Card>
            <Question text="Do you currently take any of the following medications?" />
            <CheckboxRow text="Insulin" />
            <CheckboxRow text="Diuretics such as (but not limited to) furosemide (Lasix), bumetanide (Bumex) Hydrochlorothiazide/HCTZ" />
          </Card>

          {/* Card 12 */}
          <Card>
            <Question text="Do you take any medications?" />
            <RadioRow text="I don't take any medications" />
          </Card>

          {/* Card 13 */}
          <Card>
            <Question text="Is there anything else you want your healthcare provider to know about your health?" />
            <RadioRow text="No" />
          </Card>

          {/* Card 14 */}
          <Card>
            <Question text="Is there anything else you want your healthcare provider to know about your health?" />
            <RadioRow text="No" />
          </Card>

          {/* Card 15: Compliance Confirmation */}
          <Card>
            <div className="flex items-center gap-2 mb-4">
              <ShieldCheck className="w-[18px] h-[18px] text-blue-600" />
              <h3 className="text-[14px] font-bold text-gray-900">Compliance Confirmation:</h3>
            </div>
            
            <div className="flex flex-col gap-3">
              {[
                "I have reviewed and agree to the Terms of Service and Privacy Policy.",
                "I certify that all information provided is accurate and complete.",
                "I understand that providing false or misleading information may result in denial of treatment.",
                "I understand that treatment recommendations are based on the information I have provided.",
                "I understand that additional information may be requested before treatment is approved."
              ].map((text, i) => (
                <div key={i} className="flex items-start gap-3 p-3.5 border border-gray-100 rounded-lg opacity-80">
                  <div className="w-4 h-4 rounded bg-gray-300 flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 text-white" strokeWidth={3} />

                  </div>
                  <span className="text-[12px] text-gray-500" dangerouslySetInnerHTML={{ __html: text.replace("Terms of Service and Privacy Policy.", '<span class="font-bold underline">Terms of Service and Privacy Policy.</span>') }} />
                </div>
              ))}
            </div>
          </Card>

          {/* Card 16: Payment Summary */}
          <Card>
            <h3 className="text-[14px] font-bold text-gray-900 mb-1">Payment Summery</h3>
            <p className="text-[12px] text-gray-500 mb-6">Patient selected two products:</p>

            <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">
              {/* Products */}
              <div className="flex-1 flex flex-col gap-4">
                {CART.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="relative w-[48px] h-[48px] shrink-0 rounded-lg overflow-hidden bg-[#292C2D]">
                      <Image src={item.image} alt={item.name} fill className="object-contain p-1" sizes="48px" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between">
                        <p className="text-[13px] font-bold text-gray-900 truncate pr-2">{item.name}</p>
                        <p className="text-[13px] font-bold text-[#2563EB] shrink-0">${item.price}</p>
                      </div>
                      <p className="text-[10px] text-gray-500 mt-0.5">Medium Rare, Bone Marrow Butter</p>
                      <div className="flex items-center gap-1 mt-1.5">
                        <span className="text-[10px] text-gray-500 mr-1">Size:</span>
                        <span className="text-[9px] bg-[#2563EB] text-white px-2 py-0.5 rounded-full">{item.selectedSize}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="flex-1 lg:max-w-[300px]">
                <div className="flex flex-col gap-2">
                  {[
                    { label: "Subtotal",         value: `$${subtotal.toFixed(2)}` },
                    { label: "Service Duration", value: serviceDuration },
                    { label: "Service Fees",     value: `$${serviceFees.toFixed(2)}` },
                    { label: "Shipping charge",  value: `$${shipping.toFixed(2)}` },
                    { label: "Discount",         value: `- $${discount.toFixed(2)}` },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex justify-between items-center">
                      <span className="text-[12px] text-gray-500">{label}</span>
                      <span className="text-[12px] text-gray-800 font-medium">{value}</span>
                    </div>
                  ))}
                  <div className="flex justify-between items-center pt-3 border-t border-gray-200 mt-1">
                    <span className="text-[14px] font-bold text-gray-900">Total</span>
                    <span className="text-[14px] font-bold text-[#2563EB]">${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-2">
            <div className="flex gap-3 w-full sm:w-auto">
              <button className="flex-1 sm:flex-none bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-[13px] font-medium px-5 py-2 rounded-lg transition-colors">
                Submit for medical review
              </button>
              <Link href="/checkout" className="flex-1 sm:flex-none text-[#EF4444] border border-[#EF4444] hover:bg-red-50 text-[13px] font-medium px-5 py-2 rounded-lg transition-colors text-center">
                Cancel
              </Link>
            </div>
            
            <Link href="/checkout" className="w-full sm:w-auto text-gray-600 border border-gray-300 hover:bg-gray-50 text-[13px] font-medium px-5 py-2 rounded-lg transition-colors text-center">
              Edit before submitting
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
