import { FastifyInstance } from "fastify";
import { authMiddleware } from "../../auth/middleware/auth.middleware.js";
import { calculateShippingController } from "../controller/shipping.controller.js";
import { shippingSchema } from "../schema/shipping.schema.js";



export async function shippingRoutes(app: FastifyInstance) {

    // Calculate Freight
    app.post("/calculate", {schema: { body: shippingSchema, tags: ['Freight'], description: 'Calculate Freight' },
         preHandler: authMiddleware}, calculateShippingController)

}

