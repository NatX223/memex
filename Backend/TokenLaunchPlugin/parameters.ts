/* eslint-disable */

import { createToolParameters } from "@goat-sdk/core";
import { z } from "zod";

export class TokenDetails extends createToolParameters(
    z.object({
        name: z.string().describe("The name of the token"),
        symbol: z.string().describe("The symbol of the token"),
    }),
) {}