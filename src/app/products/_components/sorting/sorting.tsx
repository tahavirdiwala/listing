"use client";
import { SortOptions } from "@/lib/constant";
import { useRouter, useSearchParams } from "next/navigation";

type TSortingProps = {
  setSortBy: (value: string) => void;
};

export const Sorting = (props: TSortingProps) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const handleListSorting = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const sortedValue = event.target.value;
    const params = new URLSearchParams(searchParams.toString());

    if (sortedValue.length > 0) {
      params.set("sort", sortedValue);
    } else {
      params.delete("sort");
    }

    const newUrl = `?${params.toString()}`;
    if (window.location.search !== newUrl) {
      router.push(newUrl);
    }

    props.setSortBy(sortedValue);
  };

  return (
    <div className=" w-full">
      <div className="bg-[#f5f5f6] flex md:justify-end mx-auto pl-[16px] sm:pl-[24px] lg:pl-[32px] z-40">
        <div className="flex items-center">
          <div className="flex gap-3 relative inline-block text-left">
            <p>Sort</p>
            <select
              className="bg-black text-white"
              onChange={handleListSorting}
            >
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
