import { FastifyRequest, FastifyReply } from "fastify"
import { calculateShippingFic } from "../service/shipping.service"
import { shippingInput } from "../schema/shipping.schema"

export async function calculateShippingController(
    req: FastifyRequest,
    replay: FastifyReply
) {
    const { productId, cep } = req.body as shippingInput
    const { id, sessionId } = req.user
    const fretes = await calculateShippingFic(productId, cep)
    return replay.send(fretes)
}

