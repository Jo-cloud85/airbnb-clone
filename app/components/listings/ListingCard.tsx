'use client';

import { Listing, Reservation, User } from "@prisma/client";
import { useRouter } from "next/navigation";
import Image from "next/image";

import React, { useCallback, useMemo } from "react";
import useCountries from "../hooks/useCountries";
import { format } from "date-fns";
import HeartButton from "../HeartButton";
import Button from "../Button";

interface ListingCardProps {
    data: Listing;
    reservation?: Reservation;
    onAction?: (id: string) => void;
    disabled?: boolean;
    actionLabel?: string;
    actionId?: string;
    currentUser?: User | null;
}

const ListingCard: React.FC<ListingCardProps> = ({
    data,
    reservation,
    onAction,
    disabled,
    actionLabel,
    actionId = "",
    currentUser
}) => {
  const router = useRouter();
  const { getByValue } = useCountries();

  // location //////////////
  const location = getByValue(data.locationValue);

  // handle cancel //////////////
  const handleCancel = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();

    if (disabled) {
      return;
    }

    onAction?.(actionId);
  }, [onAction, actionId, disabled]); 

  // price //////////////
  const price = useMemo(() => {
    if (reservation) {
      return reservation.totalPrice;
    }

    return data.price;
  }, [reservation, data.price]);

  // reservation date //////////////
  const reservationDate = useMemo(() => {
    if (!reservation) {
      return null;
    }

    const start = new Date(reservation.startDate);
    const end = new Date(reservation.endDate);

    return `${format(start, 'PP')} - ${format(end, 'PP')}`
  }, [reservation]);

  // main return //////////////
  return (
    <div
      onClick={() => router.push(`/listings/${data.id}`)}
      className="col-span-1 cursor-pointer group"
    >
      <div className="flex flex-col gap-2 w-full">
        <div
          className="
            aspect-square
            w-full
            rounded-xl
            overflow-hidden
            relative
            relative-xl
          "
        >
          <Image 
            fill
            alt="Listing"
            sizes="(max-width: 768px) 100vw, 33vw" // have to add this 'sizes' field
            src={data.imageSrc}
            className="
              object-cover
              h-full
              w-full
              group-hover:scale-110
              transition
            "
          />
          <div className="absolute top-3 right-3">
            <HeartButton 
              listingId={data.id}
              currentUser={currentUser}
            />
          </div>
        </div>
        <div>
          <div className="font-semibold text-lg">
            {location?.region}, {location?.label}
          </div>
          <div className="font-light text-neutral-500 truncate">
            {data.title}
          </div>
          {/* <div className="font-light text-neutral-500">
            {reservationDate || data.category}
          </div> */}
        </div>
        <div className="flex flex-row items-center gap-1">
          <div className="font-semibold">
            $ {price}
          </div>
          {!reservation && (
            <div className="font-light">
              night
            </div>
          )}
        </div>
        {onAction && actionLabel && (
          <Button
            disabled={disabled}
            small
            label={actionLabel}
            onClick={handleCancel}
          />
        )}
      </div>
    </div>
  )
}

export default ListingCard;