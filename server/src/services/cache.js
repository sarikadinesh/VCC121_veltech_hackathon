import { emitUpdate } from "../sockets/io.js";

const venueOccupancy = new Map();
const resourceAvailability = new Map();

const cacheKey = (id, startTime, endTime) =>
  `${id}:${new Date(startTime).toISOString()}:${new Date(endTime).toISOString()}`;

export const getVenueOccupancy = (venueId, startTime, endTime) =>
  venueOccupancy.get(cacheKey(venueId, startTime, endTime));

export const setVenueOccupancy = (venueId, startTime, endTime, payload) => {
  const key = cacheKey(venueId, startTime, endTime);
  venueOccupancy.set(key, payload);
  emitUpdate("venue-occupancy", payload);
};

export const getResourceAvailability = (resourceId, startTime, endTime) =>
  resourceAvailability.get(cacheKey(resourceId, startTime, endTime));

export const setResourceAvailability = (resourceId, startTime, endTime, payload) => {
  const key = cacheKey(resourceId, startTime, endTime);
  resourceAvailability.set(key, payload);
  emitUpdate("resource-availability", payload);
};

export const clearCache = () => {
  venueOccupancy.clear();
  resourceAvailability.clear();
};
