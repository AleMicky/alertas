import { DataSource } from 'typeorm';
import { RoleEntity } from 'src/infrastructure/typeorm/entities/role.entity';
 
export async function roleSeed(
  dataSource: DataSource,
): Promise<void> {
  const repository =
    dataSource.getRepository(RoleEntity);

  const roles = [
    {
      code: 'ADMIN',
      name: 'Administrador',
    },
    {
      code: 'OPERADOR',
      name: 'Operador',
    },
    {
      code: 'VISUALIZADOR',
      name: 'Visualizador',
    },
  ];

  for (const role of roles) {
    const exists = await repository.findOne({
      where: {
        code: role.code,
      },
    });

    if (!exists) {
      await repository.save(role);
    }
  }
}