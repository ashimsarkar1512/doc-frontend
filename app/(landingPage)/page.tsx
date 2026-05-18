import Banner from "@/components/home/Banner";
import Image from "next/image";

export default function Home() {
  return (
    <>
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/banner /bannerImage.png"
          alt="Woman smiling outdoors"
          fill
          className="object-cover"
          priority
        />
        {/* Dark gradient overlay for readability */}
        {/* <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/20 to-black/40" /> */}
      </div>

      <Banner />
    </>
  );
}
