import mongoose, { Schema, models } from 'mongoose';

export interface ISettings {
  _id?: string;
  metreFiyat: number;
  cekmeceUcretsizLimit: number;
  cekmeceBirimFiyat: number;
  cnc: {
    acik: boolean;
    fiyat: number;
  };
  ayna: {
    acik: boolean;
    fiyat: number;
  };
  updatedAt?: Date;
}

const SettingsSchema = new Schema<ISettings>(
  {
    metreFiyat: {
      type: Number,
      required: true,
      default: 11000,
    },
    cekmeceUcretsizLimit: {
      type: Number,
      required: true,
      default: 3,
    },
    cekmeceBirimFiyat: {
      type: Number,
      required: true,
      default: 1000,
    },
    cnc: {
      acik: {
        type: Boolean,
        default: true,
      },
      fiyat: {
        type: Number,
        default: 5000,
      },
    },
    ayna: {
      acik: {
        type: Boolean,
        default: true,
      },
      fiyat: {
        type: Number,
        default: 4000,
      },
    },
  },
  {
    timestamps: true,
  }
);

const Settings = models.Settings || mongoose.model<ISettings>('Settings', SettingsSchema);

export default Settings;
