// Re-export the queries from the generated operations
export {
  ListMembersDocument as LIST_MEMBERS_QUERY,
  GetMemberDocument as GET_MEMBER_QUERY,
  SearchMembersDocument as SEARCH_MEMBERS_QUERY,
  GetNextMemberNumberDocument as GET_NEXT_MEMBER_NUMBER_QUERY,
  CheckMemberNumberExistsDocument as CHECK_MEMBER_NUMBER_EXISTS_QUERY,
  ValidateDocumentDocument as VALIDATE_DOCUMENT_QUERY,
  CreateMemberDocument as CREATE_MEMBER_MUTATION,
  UpdateMemberDocument as UPDATE_MEMBER_MUTATION,
  DeleteMemberDocument as DELETE_MEMBER_MUTATION,
  ChangeMemberStatusDocument as CHANGE_MEMBER_STATUS_MUTATION,
} from '@/graphql/generated/operations';
