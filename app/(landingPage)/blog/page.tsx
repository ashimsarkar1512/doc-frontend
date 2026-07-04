import React from 'react';
import Navbar from '@/components/shared/Navbar';
import CommonHero from '@/components/shared/CommonHero';
import BlogList from '@/components/blog/BlogList';
import BlogCTA from '@/components/blog/BlogCTA';

export const metadata = {
  title: "Blog - Weight Loss MD & Wellness",
  description: "Read our latest insights on medical weight management, hormone therapy, and healthy living.",
};

const Blogpage = () => {
  return (
    <main className="w-full bg-white min-h-screen">
      <Navbar 
        variant="dark" 
        initialPadding="pt-5 pb-4" // You can set your custom padding here!
        scrolledPadding="py-2" 
      />
      <div className="xl:lg:pt-20 p-9" /> {/* matches navbar height */}
      <CommonHero
        title="Read our insights"
        description={
          <>
            Our medical weight management program is designed to support individuals seeking
            <br className="hidden md:block" /> a structured, provider-guided approach to weight loss. Each
          </>
        }
        watermarkImage="/BLOGS.png"
      />
        <BlogList />
      <BlogCTA />
    </main>
  );
};
export default Blogpage;