import { createBooking, createIdempotencyKey,getIdempotencyKeyWithLock,confirmBooking, finalizeIdempotencyKey } from "../repositories/booking.repository";
import { generateIdempotencyKey } from "../utils/generateIdempotencyKey";
import {NotFoundError,BadRequestError} from "../utils/errors/app.error"
import { CreateBookingDTO } from "../dto/booking.dto";
import prismaClient from '../prisma/client';
import { serverConfig } from "../config";
import {redlock, redisClient } from "../config/redis.config";

export async function createBookingService(createBookingdto:CreateBookingDTO){

    const ttl=serverConfig.LOCK_TTL;
    const bookingResource=`hotel:${createBookingdto.hotelId}-user:${createBookingdto.userId}`;

   return await redlock.using([
    
   ],ttl,async()=>{

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
   })

   


}

export async function confirmBookingService(idempotencyKey:string){

 return await prismaClient.$transaction(async (tx)=>{
        const idempotencyKeyData=await getIdempotencyKeyWithLock(idempotencyKey,tx)

        if(!idempotencyKeyData){
            throw new NotFoundError('Idempotency key not found!');
        }
        if(idempotencyKeyData.finalized){
            throw new BadRequestError("Idempotency key already finalized!");
        }

        const booking=await confirmBooking(tx,idempotencyKeyData.bookingId);
        await finalizeIdempotencyKey(tx,idempotencyKey);

        return booking;
       }
       
    )
}