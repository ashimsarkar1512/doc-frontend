import AboutUs from "@/components/home/AboutUs";
import Assesments from "@/components/home/Assesments";
import Expert from "@/components/home/Expert";
import Home from "@/components/home/Home";
import HowItsWork from "@/components/home/HowItsWork";
import QNA from "@/components/home/QNA";
import TestiMonial from "@/components/home/TestiMonial";
import { HomepageContentProvider } from "@/providers/HomepageContentProvider";

async function getHomepageContent() {
  try {
    let envUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "https://prod.weightlossmdcherrycreek.com";
    envUrl = envUrl.replace(/\/$/, "");
    if (!envUrl.includes("/api/v1")) {
      envUrl = `${envUrl}/api/v1`;
    }
    
    // Fetch data server-side and cache it for 60 seconds
    const res = await fetch(`${envUrl}/public/homepage-content`, {
      next: { revalidate: 60 }
    });
    
    if (!res.ok) return undefined;
    const json = await res.json();
    return json.data || json;
  } catch (error) {
    return undefined;
  }
}

export default async function Page() {
  const initialData = await getHomepageContent();

  return (
    <HomepageContentProvider initialData={initialData}>
      <main>
        <Home />
        <Assesments />
        <AboutUs />
        <Expert />
        <HowItsWork />
        <TestiMonial />
        <QNA />
      </main>
    </HomepageContentProvider>
  );
}
