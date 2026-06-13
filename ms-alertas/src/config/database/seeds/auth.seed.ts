import * as bcrypt from 'bcrypt';
import { DataSource } from 'typeorm';
import { RoleEntity } from 'src/infrastructure/typeorm/entities/role.entity';
import { UserEntity } from 'src/infrastructure/typeorm/entities/user.entity';

export async function authSeed(
  dataSource: DataSource,
): Promise<void> {
  const userRepository = dataSource.getRepository(UserEntity);
  const roleRepository = dataSource.getRepository(RoleEntity);

  const exists = await userRepository.findOne({
    where: { username: 'admin' },
  });

  if (exists) {
    return;
  }

  const adminRole = await roleRepository.findOne({
    where: { code: 'ADMIN' },
  });

  const passwordHash = await bcrypt.hash('Admin123*', 10);

  await userRepository.save(
    userRepository.create({
      username: 'admin',
      email: 'admin@local.com',
      fullName: 'Administrador',
      passwordHash,
      active: true,
      roles: adminRole ? [adminRole] : [],
    }),
  );
}
