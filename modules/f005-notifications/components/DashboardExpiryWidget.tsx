/**
 * Dashboard Expiry Widget Component
 * SCR_DASHBOARD_EXPIRY_WIDGET - Pure UI component
 * Based on R7, R12, R16 rules
 */

"use client";

import React from "react";
import { Card, CardHeader, CardBody } from "@/components/ui/card";
import { ExpiryItem, ExpiryItemProps } from "./ExpiryItem";

export interface DashboardExpiryWidgetProps {
  expiries: Array<
    ExpiryItemProps & {
      documentId: string;
    }
  >;
  isLoading?: boolean;
}

/**
 * Dashboard Expiry Widget UI component
 * Pure presentation - no business logic
 */
export const DashboardExpiryWidget = React.memo(function DashboardExpiryWidget({
  expiries,
  isLoading = false,
}: DashboardExpiryWidgetProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-gray-900">Upcoming Expiries (30 days)</h2>
        </CardHeader>
        <CardBody>
          <div className="text-center py-4 text-gray-500 text-sm">Loading...</div>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <h2 className="text-lg font-semibold text-gray-900">Upcoming Expiries (30 days)</h2>
      </CardHeader>
      <CardBody className="p-0">
        {expiries.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p className="text-sm">No upcoming expiries.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {expiries.map((expiry) => (
              <ExpiryItem key={expiry.documentId} {...expiry} />
            ))}
          </div>
        )}
      </CardBody>
    </Card>
  );
});

