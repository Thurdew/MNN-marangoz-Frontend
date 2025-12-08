import mongoose, { Schema, models } from 'mongoose';

export interface IYorum {
  _id?: string;
  musteriAdi: string;
  musteriResim?: string;
  yildiz: number;
  yorum: string;
  hizmet: string;
  fotograflar?: string[];
  onaylandi: boolean;
  tarih: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

const YorumSchema = new Schema<IYorum>(
  {
    musteriAdi: {
      type: String,
      required: true,
    },
    musteriResim: {
      type: String,
    },
    yildiz: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    yorum: {
      type: String,
      required: true,
    },
    hizmet: {
      type: String,
      required: true,
    },
    fotograflar: {
      type: [String],
      default: [],
    },
    onaylandi: {
      type: Boolean,
      default: false,
    },
    tarih: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const Yorum = models.Yorum || mongoose.model<IYorum>('Yorum', YorumSchema);

export default Yorum;
