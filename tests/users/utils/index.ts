import { DataSource } from 'typeorm';

export const truncateTables = async (connection: DataSource) => {
  const entities = connection.entityMetadatas;

  for (const entity of entities) {
    await connection.getRepository(entity.name).clear();
  }
};
