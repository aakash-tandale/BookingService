import {z} from 'zod';

export const createBookingSchema=z.object({
    userId:z.number({message:"User ID must be a number"}),
    hotelId:z.number({message:"Hotel ID must be a number"}),
    total_Guests:z.number({message:"Total guests must be a number"}).min(1,{message:"At least one guest is required"}),
    bookingAmount:z.number({message:"Booking amount must be a number"}).min(1,{message:"Booking amount must be non-negative"})
});