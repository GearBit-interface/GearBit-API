import z from "zod";

export const addItemCartSchema = z.object({
    productId: z.string()
})
export const updateCartItemSchema = z.object({
    productId: z.string(),
    type: z.enum(['increment', 'decrement'])
})
export const deleteCartItemSchema = z.object({
    productId: z.string(),
})


export type addItemCartInput = z.infer<typeof addItemCartSchema>
export type updateCartItemInput = z.infer<typeof updateCartItemSchema>
export type deleteCartItemInput = z.infer<typeof deleteCartItemSchema>
