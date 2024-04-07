import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateEntryDto } from './dto/create-entry.dto';
import { UpdateEntryDto } from './dto/update-entry.dto';
import { Entry, EntryDocument } from './schemas/entry.schema';

@Injectable()
export class EntriesService {
  constructor(
    @InjectModel(Entry.name) private entryModel: Model<EntryDocument>,
  ) {}

  async create(createEntryDto: CreateEntryDto): Promise<Entry> {
    await this.checkForOverlappingEntries(
      createEntryDto.startTime,
      createEntryDto.endTime,
    );
    const createdEntry = new this.entryModel(createEntryDto);
    return createdEntry.save();
  }

  async findAll(): Promise<Entry[]> {
    return this.entryModel.find().exec();
  }

  async findOne(id: string): Promise<Entry> {
    const entry = await this.entryModel.findById(id).exec();
    if (!entry) {
      throw new NotFoundException(`Entry with ID "${id}" not found`);
    }
    return entry;
  }

  async update(id: string, updateEntryDto: UpdateEntryDto): Promise<Entry> {
    await this.checkForOverlappingEntries(
      updateEntryDto.startTime,
      updateEntryDto.endTime,
      id,
    );
    const updatedEntry = await this.entryModel
      .findByIdAndUpdate(id, updateEntryDto, {
        new: true,
      })
      .exec();

    if (!updatedEntry) {
      throw new NotFoundException(`Entry with ID "${id}" not found`);
    }
    return updatedEntry;
  }

  async remove(id: string): Promise<void> {
    const result = await this.entryModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Entry with ID "${id}" not found`);
    }
  }

  private async checkForOverlappingEntries(
    startTime: Date,
    endTime: Date,
    excludeEntryId?: string,
  ): Promise<void> {
    const query = {
      $or: [{ startTime: { $lt: endTime }, endTime: { $gt: startTime } }],
    };

    // Exclude the current entry when updating to avoid self-overlap detection
    if (excludeEntryId) {
      query['_id'] = { $ne: excludeEntryId };
    }

    const overlappingEntries = await this.entryModel.find(query).exec();
    if (overlappingEntries.length > 0) {
      throw new ConflictException('This time slot is already booked.');
    }
  }
}
