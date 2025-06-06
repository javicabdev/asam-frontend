import { gql } from '@apollo/client'

// Payment queries
export const GET_PAYMENT = gql`
  query GetPayment($id: ID!) {
    getPayment(id: $id) {
      id
      member {
        miembro_id
        nombre
        apellidos
      }
      family {
        id
        numero_socio
      }
      amount
      payment_date
      status
      payment_method
      notes
    }
  }
`

export const GET_MEMBER_PAYMENTS = gql`
  query GetMemberPayments($memberId: ID!) {
    getMemberPayments(memberId: $memberId) {
      id
      amount
      payment_date
      status
      payment_method
      notes
    }
  }
`

export const GET_FAMILY_PAYMENTS = gql`
  query GetFamilyPayments($familyId: ID!) {
    getFamilyPayments(familyId: $familyId) {
      id
      amount
      payment_date
      status
      payment_method
      notes
    }
  }
`

// Payment mutations
export const REGISTER_PAYMENT = gql`
  mutation RegisterPayment($input: PaymentInput!) {
    registerPayment(input: $input) {
      id
      amount
      payment_date
      status
      payment_method
      notes
      member {
        miembro_id
        nombre
        apellidos
      }
      family {
        id
        numero_socio
      }
    }
  }
`

export const UPDATE_PAYMENT = gql`
  mutation UpdatePayment($id: ID!, $input: PaymentInput!) {
    updatePayment(id: $id, input: $input) {
      id
      amount
      payment_date
      status
      payment_method
      notes
    }
  }
`

export const CANCEL_PAYMENT = gql`
  mutation CancelPayment($id: ID!, $reason: String!) {
    cancelPayment(id: $id, reason: $reason) {
      success
      message
      error
    }
  }
`

export const REGISTER_FEE = gql`
  mutation RegisterFee($year: Int!, $month: Int!, $base_amount: Float!) {
    registerFee(year: $year, month: $month, base_amount: $base_amount) {
      success
      message
      error
    }
  }
`

// Cash flow queries
export const GET_CASH_FLOW = gql`
  query GetCashFlow($id: ID!) {
    getCashFlow(id: $id) {
      id
      amount
      date
      operation_type
      detail
      member {
        miembro_id
        nombre
        apellidos
      }
      family {
        id
        numero_socio
      }
      payment {
        id
        status
      }
    }
  }
`

export const GET_BALANCE = gql`
  query GetBalance {
    getBalance
  }
`

export const GET_TRANSACTIONS = gql`
  query GetTransactions($filter: TransactionFilter) {
    getTransactions(filter: $filter) {
      nodes {
        id
        amount
        date
        operation_type
        detail
        member {
          miembro_id
          nombre
          apellidos
        }
        family {
          id
          numero_socio
        }
        payment {
          id
          status
        }
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        totalCount
      }
    }
  }
`

// Cash flow mutations
export const REGISTER_TRANSACTION = gql`
  mutation RegisterTransaction($input: TransactionInput!) {
    registerTransaction(input: $input) {
      id
      amount
      date
      operation_type
      detail
    }
  }
`

export const UPDATE_TRANSACTION = gql`
  mutation UpdateTransaction($id: ID!, $input: TransactionInput!) {
    updateTransaction(id: $id, input: $input) {
      id
      amount
      date
      operation_type
      detail
    }
  }
`

export const ADJUST_BALANCE = gql`
  mutation AdjustBalance($amount: Float!, $reason: String!) {
    adjustBalance(amount: $amount, reason: $reason) {
      success
      message
      error
    }
  }
`
