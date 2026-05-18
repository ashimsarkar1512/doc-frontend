import Footer from "@/components/shared/Footer";
import Navbar from "@/components/shared/Navbar";

const LandingPageLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-white">
      <div className="p-4 md:p-8">
        <div className="relative rounded-[2rem] overflow-hidden min-h-[90vh]">
      
          {children}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default LandingPageLayout;
