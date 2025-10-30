import express from 'express';
import { CreateBookingHandler,ConfirmBookingHandler } from '../../controllers/hotel.controllers';
import {  validateRequestBody } from '../../validators';
import { createBookingSchema } from '../../validators/booking.validator';

const bookingRouter = express.Router();
bookingRouter.use(express.json());

bookingRouter.post('/', validateRequestBody(createBookingSchema), CreateBookingHandler); // TODO: Resolve this TS compilation issue
bookingRouter.post('/confirm/:idempotencyKey', ConfirmBookingHandler);
// bookingRouter.get('/health', (req, res) => {
//     res.status(200).send('OK');
// });


export default bookingRouter;