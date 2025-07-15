import { DataSource } from 'typeorm';

export const truncateTables = async (connection: DataSource) => {
  const entities = connection.entityMetadatas;

  for (const entity of entities) {
    await connection.getRepository(entity.name).clear();
  }
};

export const isJwt = (token: string): boolean => {
  const parts = token.split('.');
  if (parts.length != 3) {
    return false;
  }

  try {
    parts.forEach((part) => {
      Buffer.from(part, 'base64').toString('utf-8');
    });
  } catch (err) {
    return false;
  }

  return true;
};
