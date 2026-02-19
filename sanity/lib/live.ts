import { defineLive } from "next-sanity/live";
import { client } from "./client";
import { readToken } from "../env";

export const { SanityLive, sanityFetch } = defineLive({
    client,
    serverToken: readToken,
    browserToken: readToken,
});
