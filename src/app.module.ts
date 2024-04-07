import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EntriesModule } from './entries/entries.module';

@Module({
  imports: [
    EntriesModule,
    MongooseModule.forRoot(
      'mongodb+srv://ixen97:oyv2DmlyaBo2BOPV@mycalendarappdb.gwxfj35.mongodb.net/?retryWrites=true&w=majority&appName=myCalendarAppDb',
    ),
  ],
})
export class AppModule {}
