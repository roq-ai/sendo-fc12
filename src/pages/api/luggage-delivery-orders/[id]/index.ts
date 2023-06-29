import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { luggageDeliveryOrderValidationSchema } from 'validationSchema/luggage-delivery-orders';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.luggage_delivery_order
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getLuggageDeliveryOrderById();
    case 'PUT':
      return updateLuggageDeliveryOrderById();
    case 'DELETE':
      return deleteLuggageDeliveryOrderById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getLuggageDeliveryOrderById() {
    const data = await prisma.luggage_delivery_order.findFirst(
      convertQueryToPrismaUtil(req.query, 'luggage_delivery_order'),
    );
    return res.status(200).json(data);
  }

  async function updateLuggageDeliveryOrderById() {
    await luggageDeliveryOrderValidationSchema.validate(req.body);
    const data = await prisma.luggage_delivery_order.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });

    return res.status(200).json(data);
  }
  async function deleteLuggageDeliveryOrderById() {
    const data = await prisma.luggage_delivery_order.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
