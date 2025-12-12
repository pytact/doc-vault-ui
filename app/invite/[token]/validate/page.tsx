/**
 * Invite Validation Page
 * Route: /invite/[token]/validate
 * Based on R11 rules
 */

"use client";

import { InviteActivationValidateContainer } from "@/modules/f001-identity/containers/InviteActivationValidateContainer";

export default function InviteValidatePage() {
  return <InviteActivationValidateContainer />;
}

