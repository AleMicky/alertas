import { Body, Delete, Get, Param, Patch, Post, Put } from '@nestjs/common';

import { BaseService } from './base.service';

export abstract class BaseController<
  TResponse,
  TCreateDto = Partial<TResponse>,
  TUpdateDto = Partial<TResponse>,
  ID = string,
> {
  protected constructor(
    protected readonly service: BaseService<TResponse, ID>,
  ) {}

  @Get()
  findAll(): Promise<TResponse[]> {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: ID): Promise<TResponse | null> {
    return this.service.findOne(id);
  }

  @Post()
  create(@Body() dto: TCreateDto): Promise<TResponse> {
    return this.service.create(dto as Partial<TResponse>);
  }

  @Patch(':id')
  update(@Param('id') id: ID, @Body() dto: TUpdateDto): Promise<TResponse> {
    return this.service.update(id, dto as Partial<TResponse>);
  }

  @Delete(':id')
  delete(@Param('id') id: ID): Promise<void> {
    return this.service.delete(id);
  }
}
