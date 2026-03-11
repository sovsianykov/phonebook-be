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
import { ApiCookieAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import { AuthGuard } from '../auth/guards/auth.guard.js';
import { ContactsService } from './contacts.service.js';
import { CreateContactDto } from './dto/create-contact.dto.js';
import { UpdateContactDto } from './dto/update-contact.dto.js';

function getUserId(req: Request): number {
  return (req['user'] as { sub: number }).sub;
}

@ApiTags('Contacts')
@ApiCookieAuth()
@Controller('contacts')
@UseGuards(AuthGuard)
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  @ApiOperation({ summary: 'Create a new contact' })
  @Post()
  create(@Req() req: Request, @Body() dto: CreateContactDto) {
    return this.contactsService.create(getUserId(req), dto);
  }

  @ApiOperation({ summary: 'Get all contacts' })
  @Get()
  findAll(@Req() req: Request) {
    return this.contactsService.findAll(getUserId(req));
  }

  @ApiOperation({ summary: 'Search contacts by name, phone, or email' })
  @ApiQuery({ name: 'q', required: false, description: 'Search query' })
  @Get('search')
  search(@Req() req: Request, @Query('q') query: string) {
    return this.contactsService.search(getUserId(req), query || '');
  }

  @ApiOperation({ summary: 'Get a contact by ID' })
  @Get(':id')
  findOne(@Req() req: Request, @Param('id', ParseIntPipe) id: number) {
    return this.contactsService.findOne(getUserId(req), id);
  }

  @ApiOperation({ summary: 'Update a contact' })
  @Put(':id')
  update(
    @Req() req: Request,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateContactDto,
  ) {
    return this.contactsService.update(getUserId(req), id, dto);
  }

  @ApiOperation({ summary: 'Delete a contact' })
  @Delete(':id')
  remove(@Req() req: Request, @Param('id', ParseIntPipe) id: number) {
    return this.contactsService.remove(getUserId(req), id);
  }
}
