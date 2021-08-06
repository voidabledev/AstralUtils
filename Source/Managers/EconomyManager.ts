import { EconomyProfile } from "../Models/EconomyModel";
import { Collection, Snowflake } from "discord.js";
import { Client } from "../Modules/Client";

export class EconomyManager {
  private _cache = new Collection<Snowflake, EconomyProfile>();
  constructor(private _client: Client) {}

  async cache() {}

  getProfile(userId: Snowflake) {
    return this._cache.get(userId);
  }

  createProfile(userId: Snowflake) {
    return {
      userId,
      coins: 0
    };
  }

  async addCoins() {}

  async removeCoins() {}

  async addItem() {}
  async removeItem() {}
}
