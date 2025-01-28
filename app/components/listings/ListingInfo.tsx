'use client';

import { IconType } from "react-icons";
import dynamic from "next/dynamic";

import useCountries from "../hooks/useCountries";
import { User } from "@prisma/client";

import Avatar from "../Avatar";
import ListingCategory from "./ListingCategory";

// Refer to RentModal why we have to import Map like this
const Map = dynamic(() => import("../Map"), {
  ssr: false
})

interface ListingInfoProps {
  user: User | null;
  description: string;
  guestCount: number;
  roomCount: number;
  bathroomCount: number;
  category: {
    icon: IconType;
    label: string;
    description: string;
  } | undefined;
  locationValue: string;
}

const ListingInfo: React.FC<ListingInfoProps> = ({
  user,
  description,
  guestCount,
  roomCount,
  bathroomCount,
  category,
  locationValue
}) => {
  const { getByValue } = useCountries();
  const coordinates = getByValue(locationValue)?.latlng;

  return (
    <div className="col-span-4 flex flex-col gap-8">
      <div className="flex flex-col gap-6"> {/* Modified gap-2 to gap-6 */}
        <div className="flex flex-col gap-2"> {/* Add this extra div to grp part 1 and 2 tgt */}
          {/* Part 1 */}
          <div className="text-xl font-semibold flex flex-row items-center gap-2">
            <div>Hosted by {user?.name}</div>
            <Avatar src={user?.image} />
          </div>
          {/* Part 2 */}
          <div className="flex flex-row items-center gap-4 font-light text-neutral-500">
            <div>{guestCount} guests</div>
            <div>{roomCount} rooms</div>
            <div>{bathroomCount} bathrooms</div>
          </div>
        </div>
        <hr />
        {/* Part 3 */}
        {category && (
          <ListingCategory
            icon={category.icon}
            label={category.label}
            description={category.description}
          />
        )}
        <hr />
        {/* Part 4 */}
        <div className="text-lg font-light text-neutral-500">
          {description}
        </div>
        <hr />
        {/* Part 5 */}
        {/* <div className="text-lg font-light text-neutral-500">
          {locationValue}
        </div> */}
        {/* Part 6 */}
        <Map center={coordinates} /> 
      </div>
    </div>
  )
}

export default ListingInfo;