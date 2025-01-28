'use client';

import { useMemo, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";

import useRentModal from "../hooks/useRentModal";

import Modal from "./Modal";
import Heading from "../Heading";

import { categories } from "../navbar/Categories";
import CategoryInput from "../inputs/CategoryInput";
import CountrySelect from "../inputs/CountrySelect";
import Counter from "../inputs/Counter";

import dynamic from "next/dynamic";
import ImageUpload from "../inputs/ImageUpload";
import Input from "../inputs/Input";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

enum STEPS {
  CATEGORY = 0,
  LOCATION = 1,
  INFO = 2,
  IMAGES = 3,
  DESCRIPTION = 4,
  PRICE = 5
}

const RentModal = () => {
  const router = useRouter();
  const rentModal = useRentModal();
  const [step, setStep] = useState(STEPS.CATEGORY);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: {
      errors
    },
    reset
  } = useForm<FieldValues>({
    defaultValues: {
      category: '',
      location: null,
      guestCount: 1,
      roomCount: 1,
      bathroomCount: 1,
      imageSrc: '',
      price: 1,
      title: '',
      description: ''
    },
    mode: 'onTouched'
  });

  const category = watch('category');
  const location = watch('location');
  const guestCount = watch('guestCount');
  const roomCount = watch('roomCount');
  const bathroomCount = watch('bathroomCount');
  const imageSrc = watch('imageSrc'); 

  /* 
  Why can't we just import Map normally like others?
  The issue you're facing is likely due to the fact that Leaflet and some of its internal code are trying 
  to interact with browser-specific objects like window when the app is server-side rendered (SSR). The 
  'use client' directive you have is a good start to indicate that this component should only run on the 
  client-side. However, Leaflet's internal code may still cause issues when the component is rendered on 
  the server before it's sent to the client.

  Therefore the solution is to use Dynamic Import with ssr: false: The most straightforward way to handle 
  this issue is to dynamically import the component where you use Leaflet and ensure it's only rendered 
  on the client side.

  And lastly, we still need the location in the dependency array even though the Map varibale function 
  does not need it.
  */
  const Map = useMemo(() => dynamic(() => import('../Map'), {
    ssr: false
  }), [location]);

  // react-hook-form does set the value but does not re-render the page so we need to do this
  const setCustomValue = (id: string, value: any) => {
    setValue(id, value, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true
    })
  }

  const onBack = () => {
    setStep((value) => value - 1);
  }

  const onNext = () => {
    setStep((value) => value + 1);
  }

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    if (step !== STEPS.PRICE) {
      return onNext();
    }

    setIsLoading(true);

    axios.post('/api/listings', data)
      .then(() => {
        toast.success('Listing created!');
        router.refresh();
        reset();
        setStep(STEPS.CATEGORY);
        rentModal.onClose();
      })
      .catch((error) => {
        toast.error("Something went wrong.");
      })
      .finally(() => {
        setIsLoading(false);
      })
  };

  const actionLabel = useMemo(() => {
    if (step === STEPS.PRICE) {
      return "Create listing";
    }
    return "Next";
  }, [step]);

  const secondaryActionLabel = useMemo(() => {
    if (step === STEPS.CATEGORY) {
      // if we are on the 1st step then return undefined since there is no back button
      return undefined;
    }
    return "Back";
  }, [step]);

  // using let instead of const as this body content will change
  let bodyContent = (
    <div className="flex flex-col gap-8">
      <Heading 
        title="Which of these best describes your place?"
        subtitle="Pick a category"
      />
      <div
        className="
          grid
          grid-cols-1
          md:grid-cols-2 
          gap-3
          max-h-[50vh]
          overflow-y-auto
        "
      >
        {categories.map((item) => (
          <div
            key={item.label}
            className="col-span-1"
          >
            <CategoryInput 
              onClick={(category) => setCustomValue('category', category)} 
              selected={category === item.label}
              label={item.label} 
              icon={item.icon} 
            />
          </div>
        ))}
      </div>
    </div>
  )

  // Step === location //////////////
  if (step === STEPS.LOCATION) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading 
          title="Where is your place located?"
          subtitle="Help guests find you!"
        />
        <CountrySelect 
          value={location}
          onChange={(value) => setCustomValue('location', value)}
        />
        <Map 
          center={location?.latlng}
        />
      </div>
    )
  }

  // Step === info //////////////
  if (step === STEPS.INFO) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="Share some basic info about your place"
          subtitle="What amenities do you have?"
        />
        <Counter 
          title="Guests"
          subtitle="How many guests do you allow?"
          value={guestCount}
          onChange={(value) => setCustomValue('guestCount', value)}
        />
        <hr />
        <Counter 
          title="Rooms"
          subtitle="How many rooms do you have?"
          value={roomCount}
          onChange={(value) => setCustomValue('roomCount', value)}
        />
        <hr />
        <Counter 
          title="Bathrooms"
          subtitle="How many bathrooms do you have?"
          value={bathroomCount}
          onChange={(value) => setCustomValue('bathroomCount', value)}
        />
      </div>
    )
  }

  // Step === images //////////////
  if (step === STEPS.IMAGES) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="Add some photos of your place"
          subtitle="Show guests what your place looks like!"
        />
        <ImageUpload 
          value={imageSrc} 
          onChange={(value) => setCustomValue('imageSrc', value)} 
        />
      </div>
    )
  }

  // Step === description //////////////
  if (step === STEPS.DESCRIPTION) {
    bodyContent = (
      <form className="flex flex-col gap-8">
        <Heading
          title="Describe your place to guests"
          subtitle="What makes your place special?"
        />
        <div className="flex flex-col gap-2">
          <Input
            id="title"
            label="Title"
            name="title" //like the password field in login and register, i have to add this
            disabled={isLoading}
            register={register}
            errors={errors} 
            required
          />
          {errors.title?.message && (
            <span className="text-red-500">
              This field is required
            </span>
          )}
        </div>
        <hr />
        <div className="flex flex-col gap-2">
          <Input
            id="description"
            label="Description"
            name="description" //like the password field in login and register, i have to add this
            disabled={isLoading}
            register={register}
            errors={errors}
            required
          />
          {errors.description?.message && (
            <span className="text-red-500">
              This field is required
            </span>
          )}
        </div>
      </form>
    )
  }

  // Step === price //////////////
  if (step === STEPS.PRICE) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="Now, set your price"
          subtitle="How much do you charge per night?"
        />
        <Input
          id="price"
          label="Price"
          name="price" //like the password field in login and register, i have to add this
          formatPrice
          type="number"
          disabled={isLoading}
          register={register}
          errors={errors}
          required
        />
      </div>
    )
  }

  return (
    <Modal 
      isOpen={rentModal.isOpen}
      onClose={rentModal.onClose}
      onSubmit={handleSubmit(onSubmit)}
      actionLabel={actionLabel}
      secondaryActionLabel={secondaryActionLabel}
      secondaryAction={step === STEPS.CATEGORY ? undefined : onBack}
      title="Airbnb your home!"
      body={bodyContent}
    />
  )
}

export default RentModal;