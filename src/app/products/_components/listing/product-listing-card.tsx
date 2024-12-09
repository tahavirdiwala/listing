"use client";
import { defaultImagePath } from "@/app/lib/constant";
import Image from "next/image";

export type TProductListingProps = {
  brandName: string;
  name: string;
  getProductImageOptionList: {
    imageName: string;
  }[];
};

const commonSpanStyle = `inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2`;

export const ProductListingCard = (props: TProductListingProps) => {
  const path = `${defaultImagePath}${props?.getProductImageOptionList[0]?.imageName}`;

  return (
    <div className=" max-w-sm rounded overflow-hidden shadow-lg">
      <Image
        className="w-full"
        src={path}
        width={100}
        height={100}
        alt="Sunset in the mountains"
      />
      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2">{props.brandName}</div>
        <p className="text-gray-700 text-base">{props.name}</p>
      </div>
      <div className="px-6 pt-4 pb-2">
        <span className={commonSpanStyle}>#photography</span>
        <span className={commonSpanStyle}>#travel</span>
        <span className={commonSpanStyle}>#winter</span>
      </div>
    </div>
  );
};
