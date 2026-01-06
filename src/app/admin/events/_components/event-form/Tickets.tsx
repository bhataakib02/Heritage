import React from "react";
import { EventFormStepProps } from "./General";
import { Button, Input, Select, SelectItem } from "@nextui-org/react";
import toast from "react-hot-toast";

function Tickets({
  event,
  activeStep,
  setActiveStep,
  setEvent,
  loading,
}: EventFormStepProps) {
  const onAddTicketType = () => {
    try {
      const tempEvent = { ...event };
      if (event.ticketTypes) {
        tempEvent.ticketTypes.push({
          name: "",
          price: 0,
          limit: 0,
        });
      } else {
        tempEvent.ticketTypes = [{ name: "", price: 0, limit: 0 }];
      }

      setEvent(tempEvent);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const onTicketPropertyChange = ({
    index,
    property,
    value,
  }: {
    index: number;
    property: string;
    value: any;
  }) => {
    const tempEvent = { ...event };
    tempEvent.ticketTypes[index][property] = value;
    
    // If name is Custom, use customName as the display name
    if (property === "name" && value === "Custom") {
      // Keep customName if it exists
    } else if (property === "name" && value !== "Custom") {
      // Clear customName when switching away from Custom
      tempEvent.ticketTypes[index].customName = "";
    }
    
    setEvent(tempEvent);
  };

  const onTicketTypeDelete = (index: number) => {
    const tempEvent = { ...event };
    tempEvent.ticketTypes.splice(index, 1);
    setEvent(tempEvent);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
        <p className="text-sm text-blue-700">
          <strong>Professional Tip:</strong> Set up different ticket types (Adult, Child, Student, Senior) with appropriate pricing. Daily capacity helps manage visitor flow.
        </p>
      </div>

      {event.ticketTypes && event.ticketTypes.length > 0 && (
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-4 gap-4 bg-gray-50 p-3 rounded-lg font-semibold text-sm text-gray-700">
            <div>Ticket Type</div>
            <div>Price (₹)</div>
            <div>Daily Capacity</div>
            <div className="text-center">Action</div>
          </div>

          <div className="space-y-3">
          {event.ticketTypes.map((ticketType: any, index: number) => (
              <div className="bg-white border border-gray-200 p-4 rounded-lg" key={index}>
                <div className="grid grid-cols-4 gap-4 items-start">
                  <div className="flex flex-col gap-2">
                    <Select
                      placeholder="Select ticket type"
                      selectedKeys={ticketType.name ? [ticketType.name] : []}
                      onSelectionChange={(keys) => {
                        const selectedValue = Array.from(keys)[0] as string;
                        onTicketPropertyChange({
                          index,
                          property: "name",
                          value: selectedValue,
                        });
                        // Clear custom name if not Custom
                        if (selectedValue !== "Custom") {
                          onTicketPropertyChange({
                            index,
                            property: "customName",
                            value: "",
                          });
                        }
                      }}
                      size="sm"
                      classNames={{
                        trigger: "text-base",
                      }}
                    >
                      <SelectItem key="Adult" value="Adult">Adult</SelectItem>
                      <SelectItem key="Child" value="Child">Child (Under 12)</SelectItem>
                      <SelectItem key="Student" value="Student">Student (With ID)</SelectItem>
                      <SelectItem key="Senior" value="Senior">Senior (60+)</SelectItem>
                      <SelectItem key="Infant" value="Infant">Infant (Under 3)</SelectItem>
                      <SelectItem key="Group" value="Group">Group (10+ people)</SelectItem>
                      <SelectItem key="VIP" value="VIP">VIP / Premium</SelectItem>
                      <SelectItem key="Free" value="Free">Free Entry</SelectItem>
                      <SelectItem key="Custom" value="Custom">Custom Type</SelectItem>
                    </Select>
                    {ticketType.name === "Custom" && (
              <Input
                        placeholder="Enter custom ticket type name"
                        value={ticketType.customName || ""}
                onChange={(e) =>
                  onTicketPropertyChange({
                    index,
                            property: "customName",
                    value: e.target.value,
                  })
                }
                        size="sm"
                        classNames={{
                          input: "text-base",
                        }}
                      />
                    )}
                  </div>
              <Input
                    placeholder="0"
                onChange={(e) =>
                  onTicketPropertyChange({
                    index,
                    property: "price",
                        value: Number(e.target.value) || 0,
                  })
                }
                    value={ticketType.price || ""}
                type="number"
                    size="sm"
                    startContent={<span className="text-gray-500">₹</span>}
                    classNames={{
                      input: "text-base",
                    }}
              />
              <Input
                    placeholder="Unlimited"
                onChange={(e) =>
                  onTicketPropertyChange({
                    index,
                    property: "limit",
                        value: Number(e.target.value) || 0,
                  })
                }
                    value={ticketType.limit || ""}
                type="number"
                    size="sm"
                    description="0 = Unlimited"
                    classNames={{
                      input: "text-base",
                    }}
                  />
                  <div className="flex justify-center">
                    <Button 
                      isIconOnly 
                      onClick={() => onTicketTypeDelete(index)}
                      variant="light"
                      color="danger"
                      size="sm"
                    >
                      <i className="ri-delete-bin-line text-lg"></i>
              </Button>
                  </div>
                </div>
            </div>
          ))}
          </div>
        </div>
      )}

      <Button 
        onClick={onAddTicketType}
        color="primary"
        variant="bordered"
        className="font-medium"
        startContent={<i className="ri-add-line"></i>}
      >
        Add Ticket Type
      </Button>

      {(!event.ticketTypes || event.ticketTypes.length === 0) && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-800">
            <i className="ri-information-line mr-2"></i>
            <strong>Note:</strong> At least one ticket type is required to complete museum registration.
          </p>
        </div>
      )}

      <div className="flex justify-between items-center pt-4 border-t">
        <Button 
          variant="light" 
          onClick={() => setActiveStep(activeStep - 1)}
          className="font-medium"
        >
          ← Back
        </Button>
        <Button
          type="submit"
          color="primary"
          size="lg"
          isDisabled={!event?.ticketTypes || event.ticketTypes.length === 0}
          isLoading={loading}
          className="font-semibold px-8"
        >
          {loading ? "Saving..." : "Save Museum"}
        </Button>
      </div>
    </div>
  );
}

export default Tickets;