import { z } from "zod"

export const createRegisterSchema = (t) => z.object({
  name: z.string()
    .min(2, t('register.validation.name.min'))
    .max(255, t('register.validation.name.max')),
  email: z.string()
    .email(t('register.validation.email.invalid'))
    .max(255, t('register.validation.email.max')),
  phone: z.string().optional(),
  password: z.string()
    .min(8, t('register.validation.password.min')),
  password_confirmation: z.string(),
  role: z.enum(["client", "freelancer"], {
    errorMap: () => ({ message: t('register.validation.role.invalid') })
  }),
  terms: z.boolean().refine((val) => val === true, t('register.validation.terms.required')),
}).refine((data) => data.password === data.password_confirmation, {
  message: t('register.validation.password_confirmation.mismatch'),
  path: ["password_confirmation"],
})

export const createLoginSchema = (t) => z.object({
  email: z.string()
    .email(t('auth.validation.email.invalid'))
    .max(255, t('auth.validation.email.max')),
  password: z.string()
    .min(1, t('auth.validation.password.min')),
  remember: z.boolean().optional(),
})

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  password: z.string().min(8, "Password must be at least 8 characters"),
  password_confirmation: z.string(),
  role: z.enum(["client", "freelancer"]),
  terms: z.boolean().refine((val) => val === true, "You must accept the terms and conditions"),
}).refine((data) => data.password === data.password_confirmation, {
  message: "Passwords don't match",
  path: ["password_confirmation"],
})

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
  remember: z.boolean().optional(),
})

export const clientProfileSchema = z.object({
  company_name: z.string().optional(),
  industry: z.string().optional(),
  about: z.string().max(1000, "About must be less than 1000 characters").optional(),
  location: z.string().optional(),
  website: z.string().url("Invalid website URL").optional().or(z.literal("")),
  budget_preference: z.enum(["low", "medium", "high", "enterprise"]).optional(),
})

export const freelancerProfileSchema = z.object({
  title: z.string().max(255, "Title must be less than 255 characters").optional(),
  bio: z.string().max(1000, "Bio must be less than 1000 characters").optional(),
  skills: z.array(z.string()).optional(),
  languages: z.array(z.string()).optional(),
  hourly_rate: z.number().min(0, "Hourly rate must be positive").optional(),
  location: z.string().optional(),
  website: z.string().url("Invalid website URL").optional().or(z.literal("")),
  education: z.string().max(500, "Education must be less than 500 characters").optional(),
  availability_status: z.enum(["available", "busy", "unavailable"]).optional(),
  response_time: z.string().optional(),
}) 