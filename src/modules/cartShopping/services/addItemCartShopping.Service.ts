import { findProductById, findCartByUserId, findCartItem, addProductToCart, findCartWithItems, updateCartItem } from "../repositories/cart.repository"


export async function addItemCartShoppingService(productId: string, id: string, updateType?: 'increment' | 'decrement') {
    const product = await findProductById(productId)
    const userCart = await findCartByUserId(id)

    if (!product) {
        return {
            success: false,
            message: 'Produto nao encontrado no banco de dados',
            statusCode: 404,
        }
    }
    //verificacao de estoque
    const currentCart = await findCartItem(userCart.id, product.id)

    const currentQuantity = currentCart?.quantity || 0
    const newQuantity = currentQuantity + 1

    if (product.stockQuantity < newQuantity) {
        return {
            success: false,
            message: 'Produto sem estoque suficiente',
            statusCode: 400,
        }
    }

    if (!userCart) {
        return {
            success: false,
            message: 'Erro ao inicializar carrinho',
            statusCode: 400,
        }
    }

    const cartItem = await addProductToCart(userCart.id, productId)

    if (!cartItem) {
        return {
            success: false,
            message: 'Erro ao adicionar produto no carrinho',
            statusCode: 400,
        }
    }

    const completeCart = await findCartWithItems(userCart.id)
    return {
        success: true,
        message: 'Produto adicionado no carrinho com sucesso!',
        statusCode: 201,
        data: {
            completeCart
        }
    }


}
