import type { GoogleAuth } from "npm:google-auth-library/build/src/auth/googleauth";

export interface EditOptions {
  auth: GoogleAuth;
  applicationId: string;
  track: string;
  inAppUpdatePriority?: number;
  userFraction?: number;
  whatsNewDir?: string;
  mappingFile?: string;
  debugSymbols?: string;
  name: string;
  status: string;
  changesNotSentForReview?: boolean;
  existingEditId?: string;
}
