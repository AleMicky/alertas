import { BaseRepository } from "src/shared/core/base.repository";
import { User } from "../entities/user";

export abstract class UserRepository extends BaseRepository<User> {
    abstract findByEmail(email: string): Promise<User | null>;
    abstract findByUsername(username: string): Promise<User | null>;
    abstract findByEmailAndPassword(email: string, password: string): Promise<User | null>;
    abstract findWithRefreshToken(): Promise<User[]>;
}