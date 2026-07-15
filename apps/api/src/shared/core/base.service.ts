import { BaseRepository } from './base.repository';

export abstract class BaseService<T, ID = string> {
  constructor(protected readonly repository: BaseRepository<T, ID>) {}

  findAll(): Promise<T[]> {
    return this.repository.findAll();
  }

  findOne(id: ID): Promise<T | null> {
    return this.repository.findOne(id);
  }

  create(entity: Partial<T>): Promise<T> {
    return this.repository.create(entity);
  }

  update(id: ID, entity: Partial<T>): Promise<T> {
    return this.repository.update(id, entity);
  }

  delete(id: ID): Promise<void> {
    return this.repository.delete(id);
  }
}
