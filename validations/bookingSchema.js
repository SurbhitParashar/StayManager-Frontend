import { z } from 'zod';

export const bookingSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),

  email: z.string().email('Invalid email'),

  phone: z.string()
    .min(8, 'Phone too short')
    .max(15, 'Phone too long'),

  property_id: z.number({
    required_error: 'Property is required'
  }),

  platform: z.enum(['vrbo', 'airbnb', 'others']),

  start_date: z.string().min(1, 'Start date required'),

  end_date: z.string().min(1, 'End date required'),

  total_amount: z.number().positive('Amount must be positive'),

  payment_mode: z.enum([
    'online transaction',
    'cash transaction'
  ]),

  status: z.enum(['booked', 'cancelled'])

}).refine(data =>
  new Date(data.end_date) > new Date(data.start_date),
  {
    message: 'End date must be after start date',
    path: ['end_date']
  }
);