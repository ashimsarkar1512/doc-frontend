import React from 'react';
import Image from 'next/image';
import Navbar from '@/components/shared/Navbar';
import BlogSidebar from '@/components/blog/BlogSidebar';
import BlogCTA from '@/components/blog/BlogCTA';

export const metadata = {
  title: "Blog Details - Weight Loss MD & Wellness",
  description: "Read our latest insights on medical weight management.",
};

export default function BlogDetailsPage() {
  return (
    <main className="w-full bg-white min-h-screen">
      <Navbar 
        variant="dark" 
        initialPadding="pt-5 pb-4" 
        scrolledPadding="py-2" 
      />
      <div className="xl:lg:pt-20 p-9" />
      
      {/* Hero Image Section */}
      <section className="w-full max-w-7xl mx-auto px-4 md:px-8 mb-12">
        <div className="relative w-full h-[300px] md:h-[500px] rounded-3xl overflow-hidden">
          <Image 
            src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" 
            alt="Man looking at horizon" 
            fill 
            className="object-cover"
          />
        </div>
      </section>

      {/* Main Content Layout */}
      <section className="w-full max-w-7xl mx-auto px-4 md:px-8 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Article Content */}
          <div className="lg:col-span-2 flex flex-col">
            
            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-6 mb-6 text-sm">
              <div className="text-gray-600">
                <span className="font-semibold text-gray-900">Published:</span> Dec 12 2024
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-900">Category:</span>
                <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs">
                  Men's Services
                </span>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-8">
              Sildenafil & Tadalafil: Treatment Options & Evaluation
            </h1>

            {/* Article Body */}
            <div className="prose prose-lg max-w-none text-gray-600">
              <p className="mb-8 leading-relaxed">
                Erectile dysfunction (ED) affects millions of men worldwide, impacting their self-esteem and relationships. Sildenafil and Tadalafil offer effective solutions, but understanding their uses, benefits, and necessary evaluations is crucial. This article explores these treatment options, emphasizing the importance of medically supervised care and realistic expectations.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">Understanding Sildenafil & Tadalafil</h2>
              
              <h3 className="text-xl font-bold text-gray-900 mb-3 mt-6">What are Sildenafil & Tadalafil?</h3>
              <p className="mb-6 leading-relaxed">
                Sildenafil and Tadalafil are PDE5 inhibitors that increase blood flow to the penis, facilitating erections. Sildenafil (Viagra) typically lasts 4-5 hours, while Tadalafil (Cialis) can last up to 36 hours, offering more spontaneity.
              </p>

              <h3 className="text-xl font-bold text-gray-900 mb-3 mt-6">Why Consider Sildenafil or Tadalafil?</h3>
              <p className="mb-8 leading-relaxed">
                These medications are effective for many men with ED, improving sexual function and quality of life. However, they require proper evaluation and medical supervision to ensure safety and effectiveness.
              </p>

              {/* Inline Image */}
              <div className="relative w-full h-[250px] md:h-[400px] rounded-2xl overflow-hidden mb-8">
                <Image 
                  src="https://images.unsplash.com/photo-1584308666744-24d5e4a5d852?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
                  alt="Medical pills" 
                  fill 
                  className="object-cover"
                />
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-6 mt-8">The Importance of Medical Evaluation</h2>
              
              <h3 className="text-xl font-bold text-gray-900 mb-3 mt-6">1. Comprehensive Health Review: Assessing Suitability and Risks</h3>
              <p className="mb-6 leading-relaxed">
                Before starting Sildenafil or Tadalafil, a thorough medical evaluation is essential. This review identifies underlying health conditions, current medications, and potential contraindications to ensure safe usage. Consulting with medical professionals guarantees personalized advice and monitoring throughout the treatment.
              </p>

              <h3 className="text-xl font-bold text-gray-900 mb-3 mt-6">2. Personalized Treatment Plans: Tailoring Dosage and Usage</h3>
              <p className="mb-6 leading-relaxed">
                Dosage and usage of Sildenafil and Tadalafil must be tailored to individual needs. Factors such as age, health status, and severity of ED influence the optimal treatment plan. Regular follow-ups and adjustments ensure the best possible results while minimizing potential side effects. Results may vary based on individual response and adherence to medical advice.
              </p>
            </div>

          </div>
          
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <BlogSidebar />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <BlogCTA />
    </main>
  );
}
