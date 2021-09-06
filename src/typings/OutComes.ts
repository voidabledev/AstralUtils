import { MessageButtonStyleResolvable } from 'discord.js';
import { Client } from '../structures/client';

interface BaseOutCome {
  display: string;
  run: (client: Client, userId: string) => Promise<unknown>;
}

export interface NormalOutCome extends BaseOutCome {
  chance: number;
}

export interface WorkOutCome extends BaseOutCome {
  style: MessageButtonStyleResolvable;
  emoji: string;
}