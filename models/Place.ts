import mongoose, { Document, Schema } from 'mongoose';

export interface IPlace extends Document {
  name: string;
  district: string;
  description: string;
  image: string;
  coordinates: { lat: number; lng: number };
  tags: string[];
  budget: 'low' | 'medium' | 'high';
  temperature: { min: number; max: number };
  bestTime: string;
  highlights: string[];
  activities: string[];
  entryFee: string;
  visitDuration: number;
  createdAt: Date;
}

const PlaceSchema = new Schema<IPlace>(
  {
    name: { type: String, required: true },
    district: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    coordinates: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
    tags: { type: [String], default: [] },
    budget: { type: String, enum: ['low', 'medium', 'high'], default: 'low' },
    temperature: {
      min: { type: Number, required: true },
      max: { type: Number, required: true },
    },
    bestTime: { type: String, required: true },
    highlights: { type: [String], default: [] },
    activities: { type: [String], default: [] },
    entryFee: { type: String, default: 'Free' },
    visitDuration: { type: Number, default: 2 },
  },
  { timestamps: true }
);

export default mongoose.models.Place || mongoose.model<IPlace>('Place', PlaceSchema);
