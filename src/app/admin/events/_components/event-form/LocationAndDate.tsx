import React from "react";
import { EventFormStepProps } from "./General";
import { Button, Input, Textarea } from "@nextui-org/react";

function LocationAndDate({
  event,
  setEvent,
  activeStep,
  setActiveStep,
}: EventFormStepProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
        <p className="text-sm text-blue-700">
          <strong>Professional Tip:</strong> Provide complete address details including city, state, and postal code for better visitor navigation.
        </p>
      </div>

      <Input
        placeholder="e.g., 123 Heritage Street, Cultural District, City, State - 123456"
        label="Museum Address (Full)"
        description="Include street address, city, state, and postal code"
        value={event?.location}
        onChange={(e) => setEvent({ ...event, location: e.target.value })}
        isRequired
        labelPlacement="outside"
        classNames={{
          input: "text-base",
        }}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Input
          placeholder="e.g., Monday-Sunday: 9:00 AM - 6:00 PM"
          label="Opening Hours"
          description="Standard operating hours"
          value={event?.time || ""}
          onChange={(e) => setEvent({ ...event, time: e.target.value })}
          labelPlacement="outside"
          classNames={{
            input: "text-base",
          }}
        />

        <Input
          placeholder="e.g., Established 2024 or Opening Soon"
          label="Established Date / Status"
          description="Optional: Museum establishment date or current status"
          value={event?.date || ""}
          onChange={(e) => setEvent({ ...event, date: e.target.value })}
          labelPlacement="outside"
          classNames={{
            input: "text-base",
          }}
        />
      </div>

      <Textarea
        placeholder="e.g., Public transport: Metro Line 2, Station: Heritage Square. Parking: Available on-site. Wheelchair accessible entrance on the main floor."
        label="Additional Location Information"
        description="Parking, public transport, accessibility information, etc."
        value={event?.additionalInfo || ""}
        onChange={(e) => setEvent({ ...event, additionalInfo: e.target.value })}
        labelPlacement="outside"
        minRows={3}
        classNames={{
          input: "text-base",
        }}
      />

      <div className="flex justify-between items-center pt-4 border-t">
        <Button 
          variant="light" 
          onClick={() => setActiveStep(activeStep - 1)}
          className="font-medium"
        >
          ← Back
        </Button>
        <Button
          onClick={() => setActiveStep(activeStep + 1)}
          color="primary"
          size="lg"
          isDisabled={!event?.location}
          className="font-semibold px-8"
        >
          Continue to Media →
        </Button>
      </div>
    </div>
  );
}

export default LocationAndDate;