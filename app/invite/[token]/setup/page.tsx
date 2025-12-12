/**
 * Account Setup Page
 * Route: /invite/[token]/setup
 * Based on R11 rules
 */

"use client";

import { AccountSetupFormContainer } from "@/modules/f001-identity/forms/accountSetup.form.container";

export default function AccountSetupPage() {
  return <AccountSetupFormContainer />;
}

