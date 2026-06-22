import type { z } from "zod";
import type { Service } from "@/content/schema";
import data from "./catalog.json";

/** Generated catalog (surgeries + treatments + technologies). Validated in lib/services.ts. */
export const catalog = data as unknown as z.input<typeof Service>[];
