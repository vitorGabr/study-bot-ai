import type { ApplicationCommandData, CommandInteraction, CommandInteractionOptionResolver } from "discord.js";
import type { Core } from "./core";

interface CommandProps {
   client: Core;
   interaction: CommandInteraction;
   options: CommandInteractionOptionResolver
}

export type CommandType = ApplicationCommandData &{
    run: (props: CommandProps) => Promise<void>;
}

export class Command {
    constructor(options: CommandType) {
        options.dmPermission = false;
        Object.assign(this, options);
    }
}