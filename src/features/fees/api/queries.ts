/**
 * Queries for annual fees
 */

import { gql } from '@apollo/client'

export const LIST_ANNUAL_FEES_QUERY = gql`
  query ListAnnualFees {
    listAnnualFees {
      id
      year
      base_fee_amount
      family_fee_extra
      due_date
    }
  }
`
