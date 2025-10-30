import {Prisma } from "@prisma/client";
import { PrismaClient } from "@prisma/client";
const prismaClient = new PrismaClient();
import { BookingStatus } from "@prisma/client"; 


export async function createBooking(bookingInput: Prisma.BookingCreateInput){
    // Business logic for creating a booking
    const booking=await prismaClient.booking.create({
        data:bookingInput
    });
    return booking;
}

export async function createIdempotencyKey(key: string,bookingid: number){
    // Business logic for retrieving a booking

    const idempotencyKey=await prismaClient.idempotencyKey.create({
        data:{
            key,
            booking:{connect:{id:bookingid}}
        }
    })
    return idempotencyKey

}

export async function getIdempotencyKey(key: string){
    // Business logic for retrieving a booking

    const idempotencyKey=await prismaClient.idempotencyKey.findUnique({
        where:{key},
    })
    return idempotencyKey

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

export async function confirmBooking(bookingId:number){

    const booking=await prismaClient.booking.update({
        where:{id:bookingId},
        data:{status:BookingStatus.CONFIRMED}
    })

    return booking;
}

export async function finalizeIdempotencyKey(key:string){

    const idempotencykey=await prismaClient.idempotencyKey.update({
        where:{key:key},
        data:{finalized:true}
    })
    return idempotencykey
}