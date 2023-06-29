import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { porterValidationSchema } from 'validationSchema/porters';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.porter
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getPorterById();
    case 'PUT':
      return updatePorterById();
    case 'DELETE':
      return deletePorterById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getPorterById() {
    const data = await prisma.porter.findFirst(convertQueryToPrismaUtil(req.query, 'porter'));
    return res.status(200).json(data);
  }

  async function updatePorterById() {
    await porterValidationSchema.validate(req.body);
    const data = await prisma.porter.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });

    return res.status(200).json(data);
  }
  async function deletePorterById() {
    const data = await prisma.porter.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
