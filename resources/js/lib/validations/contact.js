import { z } from "zod"

export const createContactSchema = (t) => z.object({
  name: z.string()
    .min(2, t('contact.validation.name.min'))
    .max(255, t('contact.validation.name.max')),
  email: z.string()
    .email(t('contact.validation.email.invalid'))
    .max(255, t('contact.validation.email.max')),
  subject: z.string()
    .min(5, t('contact.validation.subject.min'))
    .max(255, t('contact.validation.subject.max')),
  message: z.string()
    .min(10, t('contact.validation.message.min'))
    .max(2000, t('contact.validation.message.max')),
})

export const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(255, "Name must be less than 255 characters"),
  email: z.string().email("Invalid email address").max(255, "Email must be less than 255 characters"),
  subject: z.string().min(5, "Subject must be at least 5 characters").max(255, "Subject must be less than 255 characters"),
  message: z.string().min(10, "Message must be at least 10 characters").max(2000, "Message must be less than 2000 characters"),
}) 