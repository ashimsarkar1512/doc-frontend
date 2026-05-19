import AboutUs from "@/components/home/AboutUs";
import Assesments from "@/components/home/Assesments";
import Expert from "@/components/home/Expert";
import Home from "@/components/home/Home";
import HowItsWork from "@/components/home/HowItsWork";
import QNA from "@/components/home/QNA";
import TestiMonial from "@/components/home/TestiMonial";


export default function Page() {
  return (
    <main>
    <Home/>
    <Assesments/>
    <AboutUs/>
    <Expert/>
    <HowItsWork/>
    <TestiMonial/>
    <QNA/>
    </main>
  );
}
