import prisma from "#database";
import id from "zod/v4/locales/id.js";

export async function findProductById(id: string) {

    return await prisma.product.findUnique({ where: { id } })
}


export async function findCartByUserId(userId: string) {

    return await prisma.cartShopping.upsert({
        where: { userId },
        update: {},
        create: { userId }
    })
}
export async function findCartItem(cartShoppingId: string, productId: string) {
    return await prisma.cartItem.findUnique({
        where: {
            cartShoppingId_productId: {
                cartShoppingId,
                productId
            }
        }
    })
}

export async function addProductToCart(cartShoppingId: string, productId: string) {


    const product = await findProductById(productId)
    if (!product) return

    return await prisma.cartItem.upsert({
        where: {
            cartShoppingId_productId: {
                cartShoppingId,
                productId
            }
        },
        update: { quantity: { increment: 1 } },
        create: {
            productId,
            cartShoppingId,
            unitPrice: product?.price,

        }
    })
}
export async function findCartWithItems(cartShoppingId: string) {
    return await prisma.cartShopping.findUnique({
        where: {
            id: cartShoppingId
        },
        include: {
            cartItems: true
        }
    })
}

export async function updateCartItem(cartShoppingId: string, productId: string, incremente: 'increment' | 'decrement') {
    return await prisma.cartItem.update({
        where: {
            cartShoppingId_productId: {
                cartShoppingId,
                productId
            }
        },
        data: {
            quantity: incremente === 'increment' ? { increment: 1 } : { decrement: 1 }
        }
    })

}
export async function deleteCartItem(cartShoppingId: string, productId: string) {
    return await prisma.cartItem.delete({
        where: {
            cartShoppingId_productId: {
                cartShoppingId,
                productId
            }
        }
    })
}
