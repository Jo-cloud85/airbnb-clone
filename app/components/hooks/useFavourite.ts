import axios from "axios";
import { useCallback, useMemo } from "react";
import { toast } from "react-hot-toast";

import useLoginModal from "./useLoginModal";
import { User } from "@prisma/client";
import { useRouter } from "next/navigation";

interface IUseFavourite {
    listingId: string;
    currentUser?: User | null;
}

const useFavourite = ({
    listingId,
    currentUser
}: IUseFavourite) => {
    const router = useRouter();
    const loginModal = useLoginModal();

    // Has favourited ////////////
    const hasFavourited = useMemo(() => {
        const list = currentUser?.favouriteIds || [];

        return list.includes(listingId);
    }, [currentUser, listingId]);

    // Toggle favourite ////////////
    const toggleFavourite = useCallback(async (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();

        // if we are not signed in and we attempt to like something, this will prompt us to login in first
        if (!currentUser) {
            return loginModal.onOpen();
        }

        try {
            let request;

            if (hasFavourited) {
                request = () => axios.delete(`/api/favourites/${listingId}`);
            } else {
                request = () => axios.post(`/api/favourites/${listingId}`);
            }

            await request();
            router.refresh();
            toast.success('Success');
        } catch (error) {
            toast.error('Something went wrong');
        }
    }, [currentUser, hasFavourited, listingId, router, loginModal]);
  return {
    hasFavourited,
    toggleFavourite
  }
}

export default useFavourite;