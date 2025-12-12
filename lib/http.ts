/**
 * Exported HTTP Client Instances
 * Based on R4-HTTP Client rules
 */

import { createHttpClient } from "./httpClient";

const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "";

export const httpClient = createHttpClient(API_BASE_URL);

