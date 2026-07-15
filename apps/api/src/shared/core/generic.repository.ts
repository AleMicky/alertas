import { DeepPartial, FindOptionsWhere, Repository } from 'typeorm';

import { BaseRepository } from './base.repository';

export abstract class GenericRepository<
  T extends { id: string },
> implements BaseRepository<T> {
  protected constructor(protected readonly repository: Repository<T>) {}

  async findAll(): Promise<T[]> {
    return await this.repository.find();
  }

  async findOne(id: string): Promise<T | null> {
    return await this.repository.findOne({
      where: { id } as FindOptionsWhere<T>,
    });
  }

  async create(entity: Partial<T>): Promise<T> {
    const newEntity = this.repository.create(entity as DeepPartial<T>);

    return await this.repository.save(newEntity);
  }

  async update(id: string, entity: Partial<T>): Promise<T> {
    const existing = await this.findOne(id);

    if (!existing) {
      throw new Error('Registro no encontrado');
    }

    const merged = this.repository.merge(
      existing,
      entity as DeepPartial<T>,
    );

    return await this.repository.save(merged);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
