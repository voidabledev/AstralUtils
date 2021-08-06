import { model, Document, Schema } from "mongoose";

export interface EconomyProfile {
  userId: string;
  coins: number;
}

interface Pattern extends Document {
  userId: string;
  coins: number;
}

const schema = new Schema({
  userId: String,
  coins: {
    type: Number,
    default: 0
  }
});

export const economyModel = model("C");
