import { FastifyReply, FastifyRequest } from "fastify";
import {
  deleteProduct,
  getAllProducts,
  getProductById,
  updateProduct,
} from "../repositories/product.repository";

import {
  createProduct,

} from "../repositories/product.repository";
import { createProductInput, updateProductInput } from "../schemas/product.schema";
import redis from "../../../lib/redis";

type parameters = {
  id: string;
};


//CREATE NEW PRODUCT
export async function createProductController(
  req: FastifyRequest,
  reply: FastifyReply,
) {
  const { id, isAdmin } = req.user as any;
  const { name, description, price, imageUrl, stockQuantity, height, weight, length, width } =
    req.body as createProductInput;


  if (!isAdmin) {
    return reply.status(403).send({
      success: false,
      message: 'Acesso negado: apenas administradores',
      statusCode: 403,
    });
  }

  const product = await createProduct(
    name,
    description,
    price,
    imageUrl,
    stockQuantity,
    height,
    weight,
    length,
    width

  );


  if (!product) {
    return reply.status(500).send({
      success: false,
      message: 'Falha ao criar produto',
      statusCode: 500,
    });
  }

  await redis.del('products')
  await redis.del(`product:${product.id}`)

  return reply
    .status(201)
    .send({
      success: true,
      message: 'Produto criado com sucesso',
      statusCode: 201,
      data: { product },
    });

}
// DELETE PRODUCT
export async function deleteProductController(req: FastifyRequest, reply: FastifyReply) {
  const { id } = req.params as parameters;
  const { isAdmin } = req.user as any;

  if (!isAdmin) {
    return reply.status(403).send({
      success: false,
      message: 'Acesso negado: apenas administradores',
      statusCode: 403,
    });
  }

  const product = await getProductById(id);
  if (!product) {
    return reply.status(404).send({
      success: false,
      message: 'Produto nao encontrado',
      statusCode: 404,
    });
  }

  await deleteProduct(id);

  await redis.del('products')
  await redis.del(`product:${id}`)

  return reply.status(200).send({
    success: true,
    message: 'Produto removido com sucesso',
    statusCode: 200,
  });
}

// UPDATE PRODUCT
export async function updateProductController(
  req: FastifyRequest,
  reply: FastifyReply,
) {
  const { id } = req.params as parameters;
  const data = req.body as updateProductInput;
  const { isAdmin } = req.user as any;

  if (!isAdmin) {
    return reply.status(403).send({
      success: false,
      message: 'Acesso negado: apenas administradores',
      statusCode: 403,
    });
  }

  const product = await getProductById(id);
  if (!product) {
    return reply.status(404).send({
      success: false,
      message: 'Produto nao encontrado',
      statusCode: 404,
    });
  }

  const updatedProduct = await updateProduct(id, data);

  await redis.del('products')
  await redis.del(`product:${id}`)

  return reply
    .status(200)
    .send({
      success: true,
      message: 'Produto atualizado com sucesso',
      statusCode: 200,
      data: { product: updatedProduct },
    });
}

// GET ALL PRODUCTS
export async function productsController(
  req: FastifyRequest,
  reply: FastifyReply,
) {
  const cached = await redis.get('products')

  if (!cached) {
    const products = await getAllProducts();

    if (!products) {
      return reply
        .status(404)
        .send({
          success: false,
          message: 'Nenhum produto disponivel',
          statusCode: 404,
        });
    }

    await redis.set('products', JSON.stringify(products), 'EX', 60 * 60)
    return reply
      .status(200)
      .send({
        success: true,
        message: 'Produtos recuperados com sucesso',
        statusCode: 200,
        data: { products },
      });

  }

  const products = JSON.parse(cached)
  return reply
    .status(200)
    .send({
      success: true,
      message: 'Produtos recuperados com sucesso',
      statusCode: 200,
      data: { products },
    });
}

// GET PRODUCT BY ID
export async function productController(
  req: FastifyRequest,
  reply: FastifyReply,
) {
  const { id } = req.params as parameters;
  const cached = await redis.get(`product:${id}`)


  if (!cached) {
    const product = await getProductById(id);

    if (!product) {
      return reply
        .status(404)
        .send({
          success: false,
          message: 'Produto nao encontrado',
          statusCode: 404,
        });
    }

    await redis.set(`product:${id}`, JSON.stringify(product), 'EX', 60 * 60)
    return reply
      .status(200)
      .send({
        success: true,
        message: 'Produto recuperado com sucesso',
        statusCode: 200,
        data: { product },
      });

  }

  const product = JSON.parse(cached)

  return reply
    .status(200)
    .send({
      success: true,
      message: 'Produto recuperado com sucesso',
      statusCode: 200,
      data: { product },
    });
}
