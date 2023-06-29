import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { authorizationValidationMiddleware, errorHandlerMiddleware } from 'server/middlewares';
import { luggageDeliveryOrderValidationSchema } from 'validationSchema/luggage-delivery-orders';
import { convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  switch (req.method) {
    case 'GET':
      return getLuggageDeliveryOrders();
    case 'POST':
      return createLuggageDeliveryOrder();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getLuggageDeliveryOrders() {
    const data = await prisma.luggage_delivery_order
      .withAuthorization({
        roqUserId,
        tenantId: user.tenantId,
        roles: user.roles,
      })
      .findMany(convertQueryToPrismaUtil(req.query, 'luggage_delivery_order'));
    return res.status(200).json(data);
  }

  async function createLuggageDeliveryOrder() {
    await luggageDeliveryOrderValidationSchema.validate(req.body);
    const body = { ...req.body };

    const data = await prisma.luggage_delivery_order.create({
      data: body,
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(authorizationValidationMiddleware(handler))(req, res);
}
