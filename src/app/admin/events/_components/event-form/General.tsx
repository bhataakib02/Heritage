import React from "react";
import { Button, Input, Textarea, Chip } from "@nextui-org/react";

export interface EventFormStepProps {
  event: any;
  setEvent: React.Dispatch<React.SetStateAction<any>>;
  activeStep: number;
  setActiveStep: React.Dispatch<React.SetStateAction<number>>;
  newlySelectedImages: any[];
  setNewlySelectedImages: React.Dispatch<React.SetStateAction<any[]>>;

  alreadyUploadedImages: string[];
  setAlreadyUploadedImages: React.Dispatch<React.SetStateAction<string[]>>;
  loading: boolean;
}

function General({
  event,
  activeStep,
  setActiveStep,
  setEvent,
}: EventFormStepProps) {
  const [guest, setGuest] = React.useState<string>("");
  const getCommonProps = (name: string) => {
    return {
      labelPlacement: "outside",
      value: event?.[name],
      onChange: (e: any) => setEvent({ ...event, [name]: e.target.value }),
      isRequired: true,
    } as any;
  };

  const onGuestAdd = () => {
    const newGuests = [];
    const commaSeparatedGuests = guest.split(",");

    // if there are more than one guest in the input , use them
    if (commaSeparatedGuests.length > 1) {
      newGuests.push(...commaSeparatedGuests);
    } else {
      // add the single guest
      newGuests.push(guest);
    }

    // check if there are already guests in the event
    if (event?.guests) {
      newGuests.push(...event.guests);
    }

    setEvent({ ...event, guests: newGuests });
    setGuest("");
  };

  const onGuestRemove = (guestToRemove: number) => {
    const newGuests = event?.guests?.filter(
      (_: string, index: number) => index !== guestToRemove
    );

    setEvent({ ...event, guests: newGuests });
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
        <p className="text-sm text-blue-700">
          <strong>Professional Tip:</strong> Provide comprehensive information to help visitors understand your museum's unique value and offerings.
        </p>
      </div>

      <Input
        label="Museum Name"
        placeholder="e.g., National Museum of Cultural Heritage"
        description="Official name of the museum"
        {...getCommonProps("name")}
        classNames={{
          input: "text-base",
        }}
      />

      <Input
        label="Director / Curator"
        placeholder="e.g., Dr. John Smith, Chief Curator"
        description="Name and title of museum director or chief curator"
        {...getCommonProps("organizer")}
        classNames={{
          input: "text-base",
        }}
      />

      <Textarea
        placeholder="Describe the museum's history, mission, collections, and key highlights. Include information about permanent and temporary exhibitions, special programs, and what makes this museum unique."
        label="Museum Description"
        description={`Comprehensive description of the museum (minimum 20 characters required, ${event?.description?.length || 0} characters entered)`}
        {...getCommonProps("description")}
        minRows={5}
        classNames={{
          input: "text-base",
        }}
        errorMessage={event?.description && event.description.trim().length < 20 ? "Description must be at least 20 characters" : undefined}
        isInvalid={event?.description ? event.description.trim().length < 20 : false}
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Featured Exhibitions & Collections
          <span className="text-gray-400 font-normal ml-2">(Optional)</span>
        </label>
        <div className="flex gap-3 items-end">
          <Input
            placeholder="e.g., Ancient Artifacts Collection, Modern Art Gallery, Interactive Science Exhibits"
            value={guest}
            onChange={(e) => setGuest(e.target.value)}
            labelPlacement="outside"
            classNames={{
              input: "text-base",
            }}
          />
          <Button 
            onClick={onGuestAdd} 
            color="primary"
            isDisabled={!guest.trim()}
            className="font-medium"
          >
            Add
          </Button>
        </div>
        {event?.guests && event.guests.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {event.guests.map((guest: string, index: number) => (
              <Chip 
                key={index}
                onClose={() => onGuestRemove(index)}
                variant="flat"
                color="primary"
                className="text-sm"
              >
                {guest}
              </Chip>
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-between items-center pt-4 border-t">
        <div></div>
        <Button
          onClick={() => {
            if (event?.name && event?.organizer && event?.description && event.description.trim().length >= 20) {
              setActiveStep(activeStep + 1);
            }
          }}
          color="primary"
          size="lg"
          isDisabled={!event?.name?.trim() || !event?.organizer?.trim() || !event?.description?.trim() || (event?.description?.trim().length < 20)}
          className="font-semibold px-8"
        >
          Continue to Location →
        </Button>
      </div>
      
      {(!event?.name?.trim() || !event?.organizer?.trim() || !event?.description?.trim() || (event?.description?.trim().length < 20)) && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mt-2">
          <p className="text-xs text-yellow-800">
            <i className="ri-information-line mr-1"></i>
            Please fill in all required fields. Description must be at least 20 characters.
          </p>
        </div>
      )}
    </div>
  );
}

export default General;