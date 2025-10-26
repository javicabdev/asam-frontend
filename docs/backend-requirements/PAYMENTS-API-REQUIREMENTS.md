# 📋 Payment API Requirements for Frontend

**Date**: October 27, 2025  
**Requested by**: Frontend Team  
**Priority**: HIGH  
**Estimated Backend Effort**: 2-3 hours

---

## 🎯 Objective

Implement a `listPayments` query to support the Payments Module in the frontend, enabling admins to view, filter, and manage all payments in the system.

---

## 📊 Required GraphQL Query

```graphql
query ListPayments($filter: PaymentFilter) {
  listPayments(filter: $filter) {
    nodes {
      id
      member {
        miembro_id
        numero_socio
        nombre
        apellidos
      }
      family {
        id
        numero_socio
        esposo_nombre
        esposa_nombre
      }
      amount
      payment_date
      status
      payment_method
      notes
      membership_fee {
        id
        year
      }
    }
    pageInfo {
      hasNextPage
      hasPreviousPage
      totalCount
    }
  }
}

input PaymentFilter {
  status: PaymentStatus
  payment_method: String
  start_date: Time
  end_date: Time
  min_amount: Float
  max_amount: Float
  member_id: ID
  family_id: ID
  pagination: PaginationInput
  sort: SortInput
}
```

---

## 🔄 Temporary Workaround (Frontend)

While this is being implemented, frontend will use:
- Aggregate getMemberPayments + getFamilyPayments
- Client-side filtering and sorting

**This workaround will be removed once listPayments is available.**

---

## 📞 Contact

For questions: #asam-frontend channel
