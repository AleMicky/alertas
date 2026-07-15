import { BaseRepository } from './base.repository';
import { BaseMapper } from './base.mapper';

export abstract class BaseMapperService<
  TEntity,
  TResponseDto,
  TCreateDto,
  TUpdateDto,
  ID = string,
> {
  protected constructor(
    protected readonly repository: BaseRepository<TEntity, ID>,
    protected readonly mapper: BaseMapper<
      TEntity,
      TResponseDto,
      TCreateDto,
      TUpdateDto
    >,
  ) {}

  async findAll(): Promise<TResponseDto[]> {
    const entities = await this.repository.findAll();
    return entities.map((entity) => this.mapper.toResponse(entity));
  }

  async findOne(id: ID): Promise<TResponseDto | null> {
    const entity = await this.repository.findOne(id);
    return entity ? this.mapper.toResponse(entity) : null;
  }

  async create(dto: TCreateDto): Promise<TResponseDto> {
    const entity = this.mapper.fromCreateDto(dto);
    const created = await this.repository.create(entity);
    return this.mapper.toResponse(created);
  }

  async update(id: ID, dto: TUpdateDto): Promise<TResponseDto> {
    const entity = this.mapper.fromUpdateDto(dto);
    const updated = await this.repository.update(id, entity);
    return this.mapper.toResponse(updated);
  }

  delete(id: ID): Promise<void> {
    return this.repository.delete(id);
  }
}
