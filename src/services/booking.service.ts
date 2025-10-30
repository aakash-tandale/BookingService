import { createBooking, createIdempotencyKey,getIdempotencyKey,confirmBooking } from "../repositories/booking.repository";
import { generateIdempotencyKey } from "../utils/generateIdempotencyKey";
import {NotFoundError,BadRequestError} from "../utils/errors/app.error"
import { CreateBookingDTO } from "../dto/booking.dto";


export async function createBookingService(createBookingdto:CreateBookingDTO){

    const booking=await createBooking({
        userId:createBookingdto.userId,
        hotelId:createBookingdto.hotelId,
        bookingAmount: createBookingdto.bookingAmount,
        total_Guests :createBookingdto.total_Guests
    }
    )
    const idempotencyKey= generateIdempotencyKey();
    await createIdempotencyKey(idempotencyKey,booking.id);

    return {
        bookingId:booking.id,
        idempotencyKey:idempotencyKey
    }


}

export async function confirmBookingService(idempotencyKey:string){


    const idempotencyKeyData=await getIdempotencyKey(idempotencyKey)

    if(!idempotencyKeyData){
        throw new NotFoundError('Idempotency key not found!');
    }
    if(idempotencyKeyData.finalized){
        throw new BadRequestError("Idempotency key already finalized!");
    }

    const booking=await confirmBooking(idempotencyKeyData.bookingId);

    return booking;

}