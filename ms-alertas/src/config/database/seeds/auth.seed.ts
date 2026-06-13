import * as bcrypt from 'bcrypt';
import { DataSource } from 'typeorm';
import { RoleEntity } from 'src/infrastructure/typeorm/entities/role.entity';
import { UserEntity } from 'src/infrastructure/typeorm/entities/user.entity';

 
export async function authSeed(
  dataSource: DataSource,
): Promise<void> {
  const userRepository =
    dataSource.getRepository(UserEntity);

  const roleRepository =
    dataSource.getRepository(RoleEntity);

  const adminUsername =
    process.env.DASHBOARD_ADMIN_USERNAME ?? 'admin.alertas';
  const adminPassword =
    process.env.DASHBOARD_ADMIN_PASSWORD ?? 'Admin123*';
  const operatorUsername =
    process.env.DASHBOARD_OPERATOR_USERNAME ?? 'operador.alertas';
  const operatorPassword =
    process.env.DASHBOARD_OPERATOR_PASSWORD ?? 'Operador123*';

  const adminRole = await roleRepository.findOne({
    where: { code: 'ADMIN' },
  });
  const operatorRole = await roleRepository.findOne({
    where: { code: 'OPERADOR' },
  });

  const users = [
    {
      username: adminUsername,
      email: `${adminUsername}@local`,
      fullName: 'Administrador',
      password: adminPassword,
      roles: adminRole ? [adminRole] : [],
    },
    {
      username: operatorUsername,
      email: `${operatorUsername}@local`,
      fullName: 'Operador',
      password: operatorPassword,
      roles: operatorRole ? [operatorRole] : [],
    },
  ];

  for (const seedUser of users) {
    const exists = await userRepository.findOne({
      where: { username: seedUser.username },
    });

    if (exists) {
      continue;
    }

    const passwordHash = await bcrypt.hash(seedUser.password, 10);

    await userRepository.save(
      userRepository.create({
        username: seedUser.username,
        email: seedUser.email,
        fullName: seedUser.fullName,
        passwordHash,
        active: true,
        roles: seedUser.roles,
      }),
    );
  }
}