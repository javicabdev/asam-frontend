# Backend Requirement: Payment Count in Revenue Trend

## Problem

The dashboard's "Ingresos Mensuales" (Monthly Payments) chart currently shows the number of payments as 0 for all months, even when there are payments in the system.

## Root Cause

The backend's `RevenueTrendData` type only provides:
- `month: String`
- `revenue: Float`
- `expenses: Float`

It does **not** provide the count of payments per month, which is needed to display accurate payment statistics in the dashboard chart.

## Current Workaround

The frontend has been temporarily modified to hide the payment count information:
- Removed from the chart tooltip
- Removed from the summary chip in the chart header

See: `src/features/dashboard/components/PaymentsChart.tsx`

## Required Backend Changes

### 1. Update GraphQL Schema

Add a `paymentCount` field to `RevenueTrendData`:

```graphql
type RevenueTrendData {
  month: String!
  revenue: Float!
  expenses: Float!
  paymentCount: Int!  # <-- ADD THIS FIELD
}
```

### 2. Update Backend Logic

The backend query that generates `revenueTrend` data should include a count of payments for each month:

```sql
-- Example SQL (adjust to your actual implementation)
SELECT
  DATE_FORMAT(payment_date, '%Y-%m') as month,
  SUM(amount) as revenue,
  COUNT(*) as payment_count,  -- <-- Add payment count
  0 as expenses  -- or calculate actual expenses
FROM payments
WHERE status = 'PAID'
GROUP BY DATE_FORMAT(payment_date, '%Y-%m')
ORDER BY month;
```

### 3. Update Frontend After Backend Changes

Once the backend is updated:

1. Update GraphQL schema in frontend:
   ```bash
   npm run codegen
   ```

2. Update `src/features/dashboard/types/index.ts`:
   ```typescript
   export interface RevenueTrendData {
     month: string
     revenue: number
     expenses: number
     paymentCount: number  // <-- Add this
   }
   ```

3. Update `src/features/dashboard/types/index.ts` - `convertTrendsToChartData`:
   ```typescript
   export function convertTrendsToChartData(
     membershipTrend: MembershipTrendData[],
     revenueTrend: RevenueTrendData[]
   ): MonthlyStats[] {
     return membershipTrend.map((trend, index) => {
       const revenueItem = index < revenueTrend.length ? revenueTrend[index] : null
       return {
         month: trend.month,
         newMembers: trend.newMembers,
         totalPayments: revenueItem?.paymentCount || 0,  // <-- Use backend data
         paymentAmount: revenueItem?.revenue || 0,
       }
     })
   }
   ```

4. Uncomment the hidden code in `src/features/dashboard/components/PaymentsChart.tsx`:
   - Uncomment payment count in tooltip (line ~64-73)
   - Uncomment `totalPagos` calculation (line ~83)
   - Uncomment payment count chip (line ~136-140)

## Testing

After implementing the backend changes:

1. Verify the GraphQL query returns `paymentCount` for each month
2. Check that the dashboard chart shows accurate payment counts
3. Verify the tooltip displays payment count correctly
4. Confirm the summary chip shows total payment count

## Priority

**Medium-High** - This affects data visibility in the dashboard, but the workaround (hiding the data) prevents showing incorrect information to users.

## Related Files

- Frontend: `src/features/dashboard/components/PaymentsChart.tsx`
- Frontend: `src/features/dashboard/types/index.ts`
- GraphQL: `src/graphql/operations/dashboard.graphql`
- Backend: Dashboard statistics resolver/service
