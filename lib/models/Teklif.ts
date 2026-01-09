import mongoose, { Schema, models } from 'mongoose';

export interface ITeklif {
  _id?: string;
  adSoyad: string;
  email: string;
  telefon: string;
  adres?: string;
  hizmet: string;
  genislik: number;
  yukseklik: number;
  derinlik: number;
  malzeme: string;
  ekOzellikler: string[];
  cekmeceAdedi: number;
  fiyatDetay: {
    temelFiyat: number;
    malzemeFiyat: number;
    ekOzelliklerFiyat: number;
    cekmeceFiyat: number;
    toplamFiyat: number;
  };
  notlar?: string;
  durum: 'beklemede' | 'inceleniyor' | 'teklif-gonderildi' | 'onaylandi' | 'reddedildi';
  createdAt?: Date;
  updatedAt?: Date;
}

const TeklifSchema = new Schema<ITeklif>(
  {
    adSoyad: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    telefon: {
      type: String,
      required: true,
    },
    adres: {
      type: String,
    },
    hizmet: {
      type: String,
      required: true,
    },
    genislik: {
      type: Number,
      required: true,
    },
    yukseklik: {
      type: Number,
      required: true,
    },
    derinlik: {
      type: Number,
      required: true,
    },
    malzeme: {
      type: String,
      required: true,
    },
    ekOzellikler: {
      type: [String],
      default: [],
    },
    cekmeceAdedi: {
      type: Number,
      default: 0,
      min: 0,
      max: 20,
    },
    fiyatDetay: {
      temelFiyat: {
        type: Number,
        required: true,
      },
      malzemeFiyat: {
        type: Number,
        required: true,
      },
      ekOzelliklerFiyat: {
        type: Number,
        required: true,
      },
      cekmeceFiyat: {
        type: Number,
        required: true,
      },
      toplamFiyat: {
        type: Number,
        required: true,
      },
    },
    notlar: {
      type: String,
    },
    durum: {
      type: String,
      enum: ['beklemede', 'inceleniyor', 'teklif-gonderildi', 'onaylandi', 'reddedildi'],
      default: 'beklemede',
    },
  },
  {
    timestamps: true,
  }
);

const Teklif = models.Teklif || mongoose.model<ITeklif>('Teklif', TeklifSchema);

export default Teklif;
