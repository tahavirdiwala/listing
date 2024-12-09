"use client";
import { SortOptions } from "@/app/lib/constant";

type TSortingProps = {
  setSortBy: (value: string) => void;
};

export const Sorting = (props: TSortingProps) => {
  const handleListSorting = (event: React.ChangeEvent<HTMLSelectElement>) => {
    props.setSortBy(event.target.value);
  };

  return (
    <div className=" w-full">
      <div className="bg-slate-600 flex md:justify-end mx-auto pl-[16px] sm:pl-[24px] lg:pl-[32px] z-40">
        <div className="flex items-center">
          <div className="relative inline-block text-left">
            <select onChange={handleListSorting}>
              {SortOptions.map((item) => {
                return <option key={item.type}>{item.type}</option>;
              })}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
