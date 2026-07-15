import * as bcrypt from 'bcrypt';
import { DataSource } from 'typeorm';
import { RoleEntity } from 'src/infrastructure/typeorm/entities/role.entity';
import { UserEntity } from 'src/infrastructure/typeorm/entities/user.entity';

type SeedUser = {
  username: string;
  email: string;
  fullName: string;
  password: string;
  roleCode: string;
};

export async function authSeed(
  dataSource: DataSource,
): Promise<void> {
  const userRepository = dataSource.getRepository(UserEntity);
  const roleRepository = dataSource.getRepository(RoleEntity);

  const users: SeedUser[] = [
    {
      username: process.env.DASHBOARD_ADMIN_USERNAME ?? 'admin.alertas',
      email: 'admin@alertas.local',
      fullName: 'Administrador',
      password: process.env.DASHBOARD_ADMIN_PASSWORD ?? 'Admin123*',
      roleCode: 'ADMIN',
    },
    {
      username: process.env.DASHBOARD_OPERATOR_USERNAME ?? 'operador.alertas',
      email: 'operador@alertas.local',
      fullName: 'Operador',
      password: process.env.DASHBOARD_OPERATOR_PASSWORD ?? 'Operador123*',
      roleCode: 'OPERADOR',
    },
  ];

  for (const userData of users) {
    const exists = await userRepository.findOne({
      where: { username: userData.username },
    });

    if (exists) {
      continue;
    }

    const role = await roleRepository.findOne({
      where: { code: userData.roleCode },
    });

    const passwordHash = await bcrypt.hash(userData.password, 10);

    await userRepository.save(
      userRepository.create({
        username: userData.username,
        email: userData.email,
        fullName: userData.fullName,
        passwordHash,
        active: true,
        roles: role ? [role] : [],
      }),
    );
  }
}
