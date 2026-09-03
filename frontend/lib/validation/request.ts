import { z } from "zod";

export const requestSchema = z.object({
  pickup_address: z
    .string()
    .trim()
    .min(1, "Pickup address is required")
    .max(255, "Pickup address is too long"),

  pickup_postcode: z
    .string()
    .trim()
    .min(1, "Pickup postcode is required")
    .max(12, "Pickup postcode is too long"),

  dropoff_address: z
    .string()
    .trim()
    .min(1, "Drop-off address is required")
    .max(255, "Drop-off address is too long"),

  dropoff_postcode: z
    .string()
    .trim()
    .min(1, "Drop-off postcode is required")
    .max(12, "Drop-off postcode is too long"),

  pickup_date: z
    .string()
    .min(1, "Pickup date is required"),

  pickup_time_slot: z
    .string()
    .min(1, "Pickup time slot is required"),

  helpers_needed: z.coerce
    .number()
    .int()
    .min(0, "Helpers cannot be negative"),

  pickup_floor: z.coerce
    .number()
    .int()
    .min(0, "Floor cannot be negative"),

  pickup_has_lift: z.boolean(),

  dropoff_floor: z.coerce
    .number()
    .int()
    .min(0, "Floor cannot be negative"),

  dropoff_has_lift: z.boolean(),

  pickup_loading_minutes: z.coerce
    .number()
    .int()
    .min(0, "Loading time cannot be negative"),

  dropoff_loading_minutes: z.coerce
    .number()
    .int()
    .min(0, "Loading time cannot be negative"),
});

export type RequestFormData = z.infer<typeof requestSchema>;