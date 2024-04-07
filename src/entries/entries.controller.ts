import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { EntriesService } from './entries.service';
import { CreateEntryDto } from './dto/create-entry.dto';
import { UpdateEntryDto } from './dto/update-entry.dto';

@Controller('/api/entries')
export class EntriesController {
  constructor(private readonly entriesService: EntriesService) {}

  @Post()
  async create(@Body() createEntryDto: CreateEntryDto) {
    const entry = await this.entriesService.create(createEntryDto);
    return { data: entry, message: 'Entry successfully created.' };
  }

  @Get()
  async findAll() {
    const entries = await this.entriesService.findAll();
    return { data: entries, message: 'Entries retrieved successfully.' };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const entry = await this.entriesService.findOne(id);
    return { data: entry, message: 'Entry retrieved successfully.' };
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateEntryDto: UpdateEntryDto,
  ) {
    const entry = await this.entriesService.update(id, updateEntryDto);
    return { data: entry, message: 'Entry successfully updated.' };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    await this.entriesService.remove(id);
    return { message: 'Entry successfully deleted.' };
  }
}
