import { FastifyInstance } from "fastify";
import { authMiddleware } from "../../../shared/middleware/auth.middleware.js";
import { calculateShippingController } from "../controller/freight.controller.js";
import { shippingSchema } from "../schema/freight.schema.js";



export async function shippingRoutes(app: FastifyInstance) {

    // Calculate Freight
    app.post("/calculate", {
        schema: { body: shippingSchema, tags: ['Freight'], description: 'Calculate Freight' },
        preHandler: authMiddleware
    }, calculateShippingController)

}

