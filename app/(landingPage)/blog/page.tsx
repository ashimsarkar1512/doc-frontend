import React from 'react';
import Navbar from '@/components/shared/Navbar';
import BlogHero from '@/components/blog/BlogHero';
import BlogList from '@/components/blog/BlogList';
import BlogCTA from '@/components/blog/BlogCTA';

export const metadata = {
  title: "Blog - Weight Loss MD & Wellness",
  description: "Read our latest insights on medical weight management, hormone therapy, and healthy living.",
};

const Blogpage = () => {
  return (
    <main className="w-full bg-white min-h-screen">
      <Navbar variant="dark" />
      <BlogHero />
      <BlogList />
      <BlogCTA />
    </main>
  );
};

export default Blogpage;