import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EntriesController } from './entries.controller';
import { EntriesService } from './entries.service';
import { Entry, EntrySchema } from './schemas/entry.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Entry.name, schema: EntrySchema }]),
  ],
  controllers: [EntriesController],
  providers: [EntriesService],
})
export class EntriesModule {}
