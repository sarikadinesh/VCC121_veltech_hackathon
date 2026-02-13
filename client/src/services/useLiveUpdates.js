import { useEffect, useState } from "react";
import socket from "./socket";

export const useLiveUpdates = () => {
  const [venueUpdates, setVenueUpdates] = useState([]);
  const [resourceUpdates, setResourceUpdates] = useState([]);

  useEffect(() => {
    const onVenue = (payload) => setVenueUpdates((prev) => [payload, ...prev].slice(0, 5));
    const onResource = (payload) => setResourceUpdates((prev) => [payload, ...prev].slice(0, 5));
    socket.on("venue-occupancy", onVenue);
    socket.on("resource-availability", onResource);
    return () => {
      socket.off("venue-occupancy", onVenue);
      socket.off("resource-availability", onResource);
    };
  }, []);

  return { venueUpdates, resourceUpdates };
};
