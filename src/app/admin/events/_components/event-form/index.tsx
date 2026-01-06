"use client";
import Steps from "@/components/Steps";
import React, { useEffect } from "react";
import General from "./General";
import LocationAndDate from "./LocationAndDate";
import Media from "./Media";
import Tickets from "./Tickets";
import { uploadImagesToFirebaseAndGetUrls } from "@/helpers/image-upload";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

interface Props {
  initialData?: any;
  type?: "edit" | "create";
}

function EventForm({ initialData, type = "create" }: Props) {
  const [alreadyUploadedImages = [], setAlreadyUploadedImages] = React.useState<
    string[]
  >([]);
  const [activeStep = 0, setActiveStep] = React.useState<number>(0);
  const [newlySelectedImages = [], setNewlySelectedImages] = React.useState<
    any[]
  >([]);
  const [event, setEvent] = React.useState<any>(null);
  const [loading, setLoading] = React.useState<boolean>(false);
  const router = useRouter();
  
  const onSubmit = async (e: any) => {
    try {
      setLoading(true);
      e.preventDefault();
      if (type === "create") {
        event.images = await uploadImagesToFirebaseAndGetUrls(
          newlySelectedImages.map((image: any) => image.file)
        );
        
        // Process ticket types - use customName if Custom is selected
        if (event.ticketTypes) {
          event.ticketTypes = event.ticketTypes.map((ticket: any) => ({
            ...ticket,
            name: ticket.name === "Custom" && ticket.customName ? ticket.customName : ticket.name,
            customName: undefined, // Remove customName from final data
          }));
        }
        
        // Ensure required fields have default values if empty
        if (!event.date || event.date.trim() === "") {
          event.date = "Open Daily"; // Default for museums that are always open
        }
        if (!event.time || event.time.trim() === "") {
          event.time = "9:00 AM - 6:00 PM"; // Default opening hours
        }
        if (!event.guests) {
          event.guests = [];
        }
        if (!event.images) {
          event.images = [];
        }
        if (!event.ticketTypes) {
          event.ticketTypes = [];
        }
        
        await axios.post("/api/admin/events", event);
        toast.success("Museum created successfully");
        // Use hard redirect to force page reload and bypass cache
        window.location.href = "/admin/events";
      } else {
        const newlyUploadedImageUrls = await uploadImagesToFirebaseAndGetUrls(
          newlySelectedImages.map((image: any) => image.file)
        );
        event.images = [...alreadyUploadedImages, ...newlyUploadedImageUrls];
        const eventId = String(event.id || event._id || '');
        if (!eventId) {
          toast.error("Museum ID is required for updating");
          return;
        }
        // Process ticket types - use customName if Custom is selected
        if (event.ticketTypes) {
          event.ticketTypes = event.ticketTypes.map((ticket: any) => ({
            ...ticket,
            name: ticket.name === "Custom" && ticket.customName ? ticket.customName : ticket.name,
            customName: undefined, // Remove customName from final data
          }));
        }
        
        // Ensure required fields have default values if empty
        if (!event.date || event.date.trim() === "") {
          event.date = "Open Daily";
        }
        if (!event.time || event.time.trim() === "") {
          event.time = "9:00 AM - 6:00 PM";
        }
        if (!event.guests) {
          event.guests = [];
        }
        if (!event.images) {
          event.images = [];
        }
        if (!event.ticketTypes) {
          event.ticketTypes = [];
        }
        
        await axios.put(`/api/admin/events/${eventId}`, event);
        toast.success("Museum updated successfully");
        // Use hard redirect to force page reload and bypass cache
        window.location.href = "/admin/events";
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || error.message || "Failed to save museum");
    } finally {
      setLoading(false);
    }
  };

  const commonProps = {
    event,
    setEvent,
    activeStep,
    setActiveStep,
    newlySelectedImages,
    setNewlySelectedImages,

    alreadyUploadedImages,
    setAlreadyUploadedImages,

    loading,
  };

  useEffect(() => {
    if (initialData) {
      setEvent(initialData);
      setAlreadyUploadedImages(initialData.images);
    }
  }, [initialData]);

  return (
    <div>
      <form onSubmit={onSubmit}>
        <Steps
          stepNames={["General", "Location & Date", "Media", "Tickets"]}
          stepsContent={[
            <General {...commonProps} />,
            <LocationAndDate {...commonProps} />,
            <Media {...commonProps} />,
            <Tickets {...commonProps} />,
          ]}
          activeStep={activeStep}
        />
      </form>
    </div>
  );
}

export default EventForm;