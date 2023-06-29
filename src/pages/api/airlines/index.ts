import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { authorizationValidationMiddleware, errorHandlerMiddleware } from 'server/middlewares';
import { airlineValidationSchema } from 'validationSchema/airlines';
import { convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  switch (req.method) {
    case 'GET':
      return getAirlines();
    case 'POST':
      return createAirline();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getAirlines() {
    const data = await prisma.airline
      .withAuthorization({
        roqUserId,
        tenantId: user.tenantId,
        roles: user.roles,
      })
      .findMany(convertQueryToPrismaUtil(req.query, 'airline'));
    return res.status(200).json(data);
  }

  async function createAirline() {
    await airlineValidationSchema.validate(req.body);
    const body = { ...req.body };
    if (body?.luggage_delivery_order?.length > 0) {
      const create_luggage_delivery_order = body.luggage_delivery_order;
      body.luggage_delivery_order = {
        create: create_luggage_delivery_order,
      };
    } else {
      delete body.luggage_delivery_order;
    }
    const data = await prisma.airline.create({
      data: body,
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(authorizationValidationMiddleware(handler))(req, res);
}
