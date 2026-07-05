import { Office } from "./types";

type Props = {
  isLoading: boolean;
  data: Office[];
};
export default function FooterTop({ isLoading, data }: Props) {
  return (
    <div className="w-full bg-[#0a0a0a] pt-[60px] lg:pt-[100px]">
      <div className="max-w-[1688px] mx-auto bg-[#242728] py-[40px] lg:py-[60px] px-[20px] lg:px-[79px] flex flex-col items-center gap-[30px] lg:gap-[60px] rounded-t-[40px] rounded-b-none">
        <h2 className="text-[36px] lg:text-[54px] font-semibold text-center text-white font-[Quicksand] leading-[110%]">
          Our office locations
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-4 divide-y lg:divide-y-0 lg:divide-x divide-white/20 w-full items-start">
          {isLoading
            ? [0, 1, 2, 3].map((i) => {
                  const paddingClass =
                  i === 0
                    ? "lg:pr-[15px]"
                    : i === 3
                      ? "lg:pl-[15px]"
                      : "lg:px-[15px]";
                return (
                  <div key={i} className={`${paddingClass} py-6 lg:py-0`}>
                    <div className="h-[18px] w-2/3 bg-white/10 rounded animate-pulse mb-2" />
                    <div className="h-[14px] w-full bg-white/10 rounded animate-pulse mb-1.5" />
                    <div className="h-[14px] w-4/5 bg-white/10 rounded animate-pulse" />
                  </div>
                );
              })
            : data
                ?.filter((office: any) => office.isActive)
                .map((office: any, index: any, arr: any) => {
                  const isFirst = index === 0;
                  const isLast = index === arr.length - 1;
                  const paddingClass = isFirst
                    ? "lg:pr-[15px]"
                    : isLast
                      ? "lg:pl-[15px]"
                      : "lg:px-[15px]";
                  return (
                    <div
                      key={office.id}
                      className={`${paddingClass} py-6 lg:py-0 self-start w-full`}
                    >
                      <h3 className="font-semibold text-white mb-2 text-[24px] leading-[150%] font-[Quicksand]">
                        {office.name}
                      </h3>
                      <p className="text-[20px] text-white font-normal font-[Quicksand] leading-[150%]">
                        {office.address}
                      </p>
                    </div>
                  );
                })}
        </div>
      </div>
    </div>
  );
}
