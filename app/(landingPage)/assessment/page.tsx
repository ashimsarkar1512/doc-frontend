import AssessmentSteps from "@/components/assessment/AssessmentSteps";
import Navbar from "@/components/shared/Navbar";
import FadeIn from "@/components/shared/animations/FadeIn";

export default function AssessmentPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="relative">
        <Navbar variant="dark" initialPadding="py-5" scrolledPadding="py-4" />
      </div>

      <FadeIn className="pt-24">
        <AssessmentSteps />
      </FadeIn>
    </div>
  );
}
