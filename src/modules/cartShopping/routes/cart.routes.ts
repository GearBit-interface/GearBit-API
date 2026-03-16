/**
 * prefix /api/cart
 */

import { FastifyInstance } from "fastify";
import { addItemCart } from "../controllers/addItemCart.controller";
import { addItemCartSchema, deleteCartItemSchema, updateCartItemSchema } from "../schemas/cart.schema"
import { authMiddleware } from "../../../shared/middleware/auth.middleware";
import { getItemsCart } from "../controllers/getItensCart.controller";
import { updateItemCart } from "../controllers/updateItemsCart.controller";
import { deleteItemCart } from "../controllers/deleteItemCart.controller";

export async function cartRoutes(app: FastifyInstance) {

    app.post('/', { schema: { body: addItemCartSchema, tags: ['CartShopping'], description: 'add a new product to cart' }, preHandler: authMiddleware }, addItemCart)

    app.get('/', { schema: { tags: ['CartShopping'], description: 'get product of user cart' }, preHandler: authMiddleware }, getItemsCart)

    app.put('/', { schema: { body: updateCartItemSchema, tags: ['CartShopping'], description: 'add or remove one product to cart' }, preHandler: authMiddleware }, updateItemCart)

    app.delete('/', { schema: { body: deleteCartItemSchema, tags: ['CartShopping'], description: 'remove product of cart' }, preHandler: authMiddleware }, deleteItemCart)

}
