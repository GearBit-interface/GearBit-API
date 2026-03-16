import { FastifyReply, FastifyRequest } from "fastify";
import { findCartByUserId, findCartWithItems } from "../repositories/cart.repository";


export async function getItemsCart(req: FastifyRequest, reply: FastifyReply) {
    const { id } = req.user

    const userCart = await findCartByUserId(id)

    if (!userCart) {
        return reply.status(403).send({
            success: false,
            message: 'Erro ao inicializar carrinho',
            statusCode: 400,
        })
    }

    const completeCart = await findCartWithItems(userCart.id)

    return reply.status(201).send({
        success: true,
        message: completeCart ? 'Carinnho do buscado com sucesso' : 'Carrinho do usuario esta vazio',
        statusCode: 201,
        data: {
            completeCart
        }
    })

}
