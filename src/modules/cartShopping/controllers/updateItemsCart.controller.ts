import { FastifyReply, FastifyRequest } from "fastify";
import { updateCartItemInput } from "../schemas/cart.schema";
import { updateItemCartShoppingService } from "../services/updateItemCartShopping.service";



export async function updateItemCart(req: FastifyRequest, reply: FastifyReply) {
    const { id } = req.user
    const { productId, type } = req.body as updateCartItemInput

    const updatedItem = await updateItemCartShoppingService(productId, id, type)
    if (!updatedItem) return

    return reply.status(updatedItem.statusCode).send(updatedItem)
}
