import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { IsNull, Not, Repository } from "typeorm";

import { GenericRepository } from "src/shared/core/generic.repository";
import { UserEntity } from "../typeorm/entities/user.entity";
import { UserRepository } from "src/domain/repositories/user.repository";
import { User } from "src/domain/entities";

@Injectable()
export class UserTypeormRepository extends GenericRepository<UserEntity> implements UserRepository {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
    ) {
        super(userRepository);
    }
    async findByEmail(email: string): Promise<User | null> {
        return await this.userRepository.findOne({ where: { email } });
    }
    async findByUsername(username: string): Promise<User | null> {
        return await this.userRepository.findOne({
            where: { username },
            relations: { roles: true },
        });
    }
    async findByEmailAndPassword(email: string, password: string): Promise<User | null> {
        return await this.userRepository.findOne({ where: { email, passwordHash: password } });
    }
    async findAll() {
        return this.userRepository.find({
            relations: { roles: true },
        });
    }
    async findOne(id: string) {
        return this.userRepository.findOne({
            where: { id },
            relations: { roles: true },
        });
    }
    async findWithRefreshToken(): Promise<User[]> {
        return this.repository.find({
          where: {
            refreshTokenHash: Not(IsNull()),
          },
          relations: {
            roles: true,
          },
        });
      }
}