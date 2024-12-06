import { SortOptions } from "@/app/lib/constant";

export const Sorting = (props: { setSortBy: (val: string) => void }) => {
  const handleListSorting = (e: React.ChangeEvent<HTMLSelectElement>) => {
    props.setSortBy(e.target.value);
  };

  return (
    <div className=" w-full md:w-2/3">
      <div className="bg-slate-400 flex justify-center md:justify-end max-w-7xl mx-auto pl-[16px] sm:pl-[24px] lg:pl-[32px] z-40">
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
