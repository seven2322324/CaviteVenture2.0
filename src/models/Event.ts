// models/Event.ts
import mongoose from 'mongoose';

const EventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  location: { type: String, required: true },
  date: { type: Date, required: true },
  imageUrl: { type: String, required: true },
  description: { type: String, required: true },
});

const Event = mongoose.models.Event || mongoose.model('Event', EventSchema);

export default Event;
