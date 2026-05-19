import Image from "next/image";

const Banner = () => {
  return (
    <div className="relative z-10 flex flex-col items-center justify-center min-h-screen text-center px-4 pt-20">
      {/* Badges/Avatars Area */}
      <div className="flex flex-col items-center gap-4 mb-8">
        {/* LegitScript Badge */}
        <div className="relative mb-2 flex items-center justify-center gap-1">
          <Image
            src="/banner/badge/Vector.png"
            alt="Wreath Left"
            width={40}
            height={20}
            className="object-contain"
          />
          <div className="relative">
            <Image
              src="/banner/badge/13220301 1.png"
              alt="LegitScript Certified"
              width={80}
              height={80}
            />
          </div>
          <Image
            src="/banner/badge/Vector (2).png"
            alt="Wreath Right"
            width={40}
            height={20}
            className="object-contain"
          />
        </div>

        {/* Avatars */}
        <div className="flex -space-x-3">
          <div className="relative w-10 h-10 rounded-full border-2 border-white overflow-hidden">
            <Image
              src="/banner/avater/Ellipse 1.png"
              alt="Avatar"
              fill
              className="object-cover"
            />
          </div>
          <div className="relative w-10 h-10 rounded-full border-2 border-white overflow-hidden">
            <Image
              src="/banner/avater/Ellipse 2.png"
              alt="Avatar"
              fill
              className="object-cover"
            />
          </div>
          <div className="relative w-10 h-10 rounded-full border-2 border-white overflow-hidden">
            <Image
              src="/banner/avater/Ellipse 3.png"
              alt="Avatar"
              fill
              className="object-cover"
            />
          </div>
          <div className="relative w-10 h-10 rounded-full border-2 border-white overflow-hidden">
            <Image
              src="/banner/avater/Ellipse 4.png"
              alt="Avatar"
              fill
              className="object-cover"
            />
          </div>
          <div className="relative w-10 h-10 rounded-full border-2 border-white overflow-hidden">
            <Image
              src="/banner/avater/Ellipse 5.png"
              alt="Avatar"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>

      {/* Heading */}
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 max-w-4xl tracking-tight leading-tight drop-shadow-lg">
        Medical Weight Management Program
      </h1>

      {/* Description */}
      <p className="text-base md:text-lg text-gray-200 mb-10 max-w-3xl leading-relaxed drop-shadow-md">
        Our medical weight management program is designed to support individuals
        seeking a structured, provider-guided approach to weight loss. Each
        program begins with a comprehensive evaluation to determine the most
        appropriate plan based on your health history, goals, and clinical
        needs.
      </p>

      {/* CTA Button */}
      <button className="bg-[#2563EB] hover:bg-blue-700 text-white px-8 py-3.5 rounded-full font-medium transition-colors text-lg shadow-lg">
        Book an Appointment
      </button>
    </div>
  );
};

export default Banner;
