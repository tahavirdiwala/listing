import { brandsArray } from "@/app/lib/constant";

type TFilterProps = {
  setSelectedBrand: React.Dispatch<
    React.SetStateAction<Record<string, boolean>>
  >;
};

const Filters = (props: TFilterProps) => {
  const handleSelectBrand = (
    e: React.ChangeEvent<HTMLInputElement>,
    key: string
  ) => {
    props.setSelectedBrand((prev: object) => ({
      ...prev,
      [key]: e.target.checked,
    }));
  };

  return (
    <div className="w-[300px] border border-green">
      <h2 className="p-2">Brand</h2>
      <div className="flex flex-col p-2">
        {brandsArray.map((item, index) => {
          return (
            <label key={index}>
              <input
                type="checkbox"
                name={"brand"}
                onChange={(event) => handleSelectBrand(event, item)}
              />
              {"  "}
              {item}
            </label>
          );
        })}
      </div>
    </div>
  );
};

export default Filters;
