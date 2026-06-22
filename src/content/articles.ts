import type { z } from "zod";
import type { BlogPost } from "@/content/schema";
import data from "./articles.json";

export const articlesData = data as unknown as z.input<typeof BlogPost>[];
