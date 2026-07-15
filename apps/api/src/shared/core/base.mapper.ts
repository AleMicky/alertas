export abstract class BaseMapper<
  TEntity,
  TResponseDto,
  TCreateDto,
  TUpdateDto,
> {
  abstract toResponse(entity: TEntity): TResponseDto;

  abstract fromCreateDto(dto: TCreateDto): Partial<TEntity>;

  abstract fromUpdateDto(dto: TUpdateDto): Partial<TEntity>;
}
