import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { authorizationValidationMiddleware, errorHandlerMiddleware } from 'server/middlewares';
import { porterValidationSchema } from 'validationSchema/porters';
import { convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  switch (req.method) {
    case 'GET':
      return getPorters();
    case 'POST':
      return createPorter();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getPorters() {
    const data = await prisma.porter
      .withAuthorization({
        roqUserId,
        tenantId: user.tenantId,
        roles: user.roles,
      })
      .findMany(convertQueryToPrismaUtil(req.query, 'porter'));
    return res.status(200).json(data);
  }

  async function createPorter() {
    await porterValidationSchema.validate(req.body);
    const body = { ...req.body };
    if (body?.luggage_delivery_order?.length > 0) {
      const create_luggage_delivery_order = body.luggage_delivery_order;
      body.luggage_delivery_order = {
        create: create_luggage_delivery_order,
      };
    } else {
      delete body.luggage_delivery_order;
    }
    const data = await prisma.porter.create({
      data: body,
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(authorizationValidationMiddleware(handler))(req, res);
}
