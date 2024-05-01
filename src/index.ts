import { ExtendClient } from "./structs/extended-client";

const client = new ExtendClient();

client.start();

client.on("ready", () => {
    console.log(`Logged in as ${client.user?.tag}`);
});

export { client }