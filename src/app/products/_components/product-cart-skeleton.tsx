import React from "react";

const ProductCardSkeleton = () => {
  return (
    <>
      {Array(9)
        ?.fill("")
        ?.map((_, index) => (
          <li key={`skeleton_${index}`} className="text-center">
            <div className="">
              <div className="flex text-center lg:w-auto">
                <div className="relative border border-gray-200 pb-[30px] w-full">
                  <div className="flex justify-center w-full rounded-md overflow-hidden aspect-w-1 aspect-h-1">
                    <div
                      className="skeleton"
                      style={{
                        position: "absolute",
                        top: 5,
                        left: 5,
                        zIndex: 30,
                        height: "20px",
                        width: "80px",
                      }}
                    ></div>
                    <div
                      className="skeleton m-[35px]"
                      style={{ width: "254px", height: "300px" }}
                    ></div>
                  </div>
                  <div className="flex flex-col items-center justify-center mt-[24px] pl-[8px] pr-[8px]">
                    <div
                      className="mt-[4px] skeleton h-[35px] cursor-pointer w-full"
                      style={{ width: "200px", height: "35px" }}
                    ></div>
                    <div className="mt-[14px] text-anchor hover:text-anchor-hover h-[44px] text-ellipsis overflow-hidden line-clamp-2 text-small-text tracking-[1.4px] w-full">
                      <div
                        className="skeleton "
                        style={{ width: "302px", height: "40px" }}
                      ></div>
                    </div>

                    <div className="mt-[12px] text-medium-text tracking-wider">
                      <div
                        className="skeleton"
                        style={{ width: "115px", height: "20px" }}
                      ></div>
                    </div>

                    <div
                      className="flex flex-wrap items-center mt-[12px] justify-center space-x-1 skeleton"
                      style={{ width: "302px", height: "28px" }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </li>
        ))}
    </>
  );
};

export default ProductCardSkeleton;
