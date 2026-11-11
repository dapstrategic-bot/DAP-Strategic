import { z } from 'zod';

const optionalText = (maxLength: number) =>
  z
    .preprocess(
      (value) => (value === null ? undefined : value),
      z.string().trim().max(maxLength).optional(),
    )
    .transform((value) => value || undefined);

export const marketingAttributionSchema = z
  .object({
    utmSource: optionalText(200),
    utmMedium: optionalText(200),
    utmCampaign: optionalText(200),
    utmTerm: optionalText(200),
    utmContent: optionalText(200),
    gclid: optionalText(500),
    fbclid: optionalText(500),
    landingPage: optionalText(2000),
    referrer: optionalText(2000),
  })
  .strict();

export const contactSubmissionSchema = z
  .object({
    submissionId: z.string().uuid(),
    name: z.string().trim().min(1).max(120),
    email: z.preprocess(
      (value) => (value === null ? undefined : value),
      z.union([z.string().trim().email().max(254), z.literal('')]).optional(),
    )
      .transform((value) => value || undefined),
    service: z
      .string()
      .trim()
      .min(1)
      .max(80)
      .regex(/^[a-z0-9-]+$/),
    message: optionalText(3000),
    attribution: marketingAttributionSchema.optional(),
    website: z.string().max(200).optional(),
  })
  .strict();

export type ContactSubmission = z.infer<typeof contactSubmissionSchema>;
