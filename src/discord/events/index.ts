import type { ClientEvents } from "discord.js";
import type { EventType } from "../base/event";
import main from "./main";

export const events = [
    main
] as EventType<keyof ClientEvents>[];