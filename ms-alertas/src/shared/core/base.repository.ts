export abstract class BaseRepository<T, ID = string> {
  abstract findAll(): Promise<T[]>;

  abstract findOne(id: ID): Promise<T | null>;

  abstract create(entity: Partial<T>): Promise<T>;

  abstract update(id: ID, entity: Partial<T>): Promise<T>;

  abstract delete(id: ID): Promise<void>;
}
