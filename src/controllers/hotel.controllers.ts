import { Request,Response } from "express";
import { confirmBookingService, createBookingService } from "../services/booking.service"; 
import logger from "../config/logger.config";

export const CreateBookingHandler =async (req: Request, res: Response) => {
 
    logger.info("CreateBookingHandler called with body:", req.body);
    const bookingData=await createBookingService(
        req.body
    )
    res.status(201).json({
        bookingId:bookingData.bookingId,
        idempotencyKey:bookingData.idempotencyKey
    })
}
export const ConfirmBookingHandler=async (req:Request,res:Response)=>{

    const idempotencyKeyData=await confirmBookingService(req.params.idempotencyKey);

    res.status(200).json({
        bookingId:idempotencyKeyData.id,
        status:idempotencyKeyData.status
    })
}