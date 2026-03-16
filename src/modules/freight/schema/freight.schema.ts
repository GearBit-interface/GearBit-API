import { z } from "zod"

export const shippingSchema = z.object({

    productId: z.string(),
    cep: z.string().regex(/^\d{5}-\d{3}$|^\d{8}$/, 'CEP deve estar no formato 00000-000 ou 00000000')

})

export type shippingInput = z.infer<typeof shippingSchema>

