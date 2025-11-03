import {Prisma,IdempotencyKey } from "@prisma/client";
import { PrismaClient } from "@prisma/client";
const prismaClient = new PrismaClient();
import { BookingStatus } from "@prisma/client"; 
import { validate as IsValidUUID}  from "uuid";
import { InternalServerError } from "../utils/errors/app.error";

export async function createBooking(bookingInput: Prisma.BookingCreateInput){
    // Business logic for creating a booking
    const booking=await prismaClient.booking.create({
        data:bookingInput
    });
    return booking;
}

export async function createIdempotencyKey(idemKey: string,bookingid: number){
    // Business logic for retrieving a booking

    const idempotencyKey=await prismaClient.idempotencyKey.create({
        data:{
            idemKey,
            booking:{connect:{id:bookingid}}
        }
    })
    return idempotencyKey

}

export async function getIdempotencyKeyWithLock(idemKey: string,tx:Prisma.TransactionClient){
    // Business logic for retrieving a booking
 
    if(!IsValidUUID(idemKey)){
        throw new InternalServerError("Not valid uuid")  }

        const idempotencyKey: Array<IdempotencyKey> = await tx.$queryRaw(
            Prisma.raw(`SELECT * FROM IdempotencyKey
            WHERE idemKey = '${idemKey}'
            FOR UPDATE;`));
        console.log("idempotencyKey:----",idempotencyKey);
    if(idempotencyKey.length===0){
        return null

    
    }

   
    return idempotencyKey[0];
   
    

}

export async function getBookingbyId(bookingId: number){
    // Business logic for retrieving a booking

    const booking=await prismaClient.booking.findUnique({
        where:{id:bookingId},
    })
    return booking

}

export async function changeBookingStatus(bookingId: number,status:BookingStatus){
    // Business logic for finalizing a booking

    const booking=await prismaClient.booking.update({
        where:{id:bookingId},
        data:{status:status}
    })
    return booking

}

export async function confirmBooking(tx:Prisma.TransactionClient ,bookingId:number){

    const booking=await tx.booking.update({
        where:{id:bookingId},
        data:{status:BookingStatus.CONFIRMED}
    })
      



    return booking;
}

export async function finalizeIdempotencyKey(tx:Prisma.TransactionClient,idemKey:string){

    const idempotencykey=await tx.idempotencyKey.update({
        where:{idemKey:idemKey},
        data:{finalized:true}
    })
     

    return idempotencykey
}

export default prismaClient;