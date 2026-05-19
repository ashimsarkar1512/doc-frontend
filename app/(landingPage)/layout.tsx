import Footer from "@/components/shared/Footer";
import Navbar from "@/components/shared/Navbar";

const LandingPageLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-white">
      {children}
    </div>
  );
};

export default LandingPageLayout;
