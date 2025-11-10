/**
 * Queries for annual fees
 */

import { gql } from '@apollo/client'

export const LIST_ANNUAL_FEES_QUERY = gql`
  query ListAnnualFees {
    listAnnualFees {
      id
      year
      individual_amount
      family_amount
      created_at
      updated_at
    }
  }
`
