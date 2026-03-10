import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { AuthGuard } from '../auth/guards/auth.guard.js';
import { ContactsService } from './contacts.service.js';
import { CreateContactDto } from './dto/create-contact.dto.js';
import { UpdateContactDto } from './dto/update-contact.dto.js';

function getUserId(req: Request): number {
  return (req['user'] as { sub: number }).sub;
}

@Controller('contacts')
@UseGuards(AuthGuard)
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  @Post()
  create(@Req() req: Request, @Body() dto: CreateContactDto) {
    return this.contactsService.create(getUserId(req), dto);
  }

  @Get()
  findAll(@Req() req: Request) {
    return this.contactsService.findAll(getUserId(req));
  }

  @Get('search')
  search(@Req() req: Request, @Query('q') query: string) {
    return this.contactsService.search(getUserId(req), query || '');
  }

  @Get(':id')
  findOne(@Req() req: Request, @Param('id', ParseIntPipe) id: number) {
    return this.contactsService.findOne(getUserId(req), id);
  }

  @Put(':id')
  update(
    @Req() req: Request,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateContactDto,
  ) {
    return this.contactsService.update(getUserId(req), id, dto);
  }

  @Delete(':id')
  remove(@Req() req: Request, @Param('id', ParseIntPipe) id: number) {
    return this.contactsService.remove(getUserId(req), id);
  }
}
