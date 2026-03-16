import { FastifyReply, FastifyRequest } from "fastify";
import { addItemCartInput } from "../schemas/cart.schema";
import { addItemCartShoppingService } from "../services/addItemCartShopping.Service";



export async function addItemCart(req: FastifyRequest, reply: FastifyReply) {
    const { productId } = req.body as addItemCartInput
    const { id } = req.user

    const addedItem = await addItemCartShoppingService(productId, id)

    if (!addedItem) return

    return reply.status(addedItem.statusCode).send(addedItem)
}
