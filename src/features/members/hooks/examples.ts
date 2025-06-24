// Example usage of GraphQL queries and types
import { useQuery, useMutation } from '@apollo/client';
import {
  LIST_MEMBERS_QUERY,
  CREATE_MEMBER_MUTATION,
  UPDATE_MEMBER_MUTATION,
  DELETE_MEMBER_MUTATION,
} from '../api/queries';
import {
  ListMembersQueryResponse,
  CreateMemberInput,
  CreateMemberMutationResponse,
  UpdateMemberInput,
  UpdateMemberMutationResponse,
  DeleteMemberMutationResponse,
} from '../api/types';

// Example: Using the list members query
export function useListMembersExample() {
  const { data, loading, error } = useQuery<ListMembersQueryResponse>(
    LIST_MEMBERS_QUERY,
    {
      variables: {
        filter: {
          estado: 'ACTIVE',
          tipo_membresia: 'INDIVIDUAL',
          pagination: {
            page: 1,
            pageSize: 10,
          },
        },
      },
    }
  );

  return {
    members: data?.listMembers.nodes || [],
    totalCount: data?.listMembers.pageInfo.totalCount || 0,
    loading,
    error,
  };
}

// Example: Using the create member mutation
export function useCreateMemberExample() {
  const [createMember, { loading, error }] = useMutation<
    CreateMemberMutationResponse,
    { input: CreateMemberInput }
  >(CREATE_MEMBER_MUTATION);

  const handleCreate = async (input: CreateMemberInput) => {
    try {
      const { data } = await createMember({
        variables: { input },
      });
      console.log('Member created:', data?.createMember);
      return data?.createMember;
    } catch (err) {
      console.error('Error creating member:', err);
      throw err;
    }
  };

  return {
    createMember: handleCreate,
    loading,
    error,
  };
}

// Example: Using the update member mutation
export function useUpdateMemberExample() {
  const [updateMember, { loading, error }] = useMutation<
    UpdateMemberMutationResponse,
    { input: UpdateMemberInput }
  >(UPDATE_MEMBER_MUTATION);

  const handleUpdate = async (input: UpdateMemberInput) => {
    try {
      const { data } = await updateMember({
        variables: { input },
      });
      console.log('Member updated:', data?.updateMember);
      return data?.updateMember;
    } catch (err) {
      console.error('Error updating member:', err);
      throw err;
    }
  };

  return {
    updateMember: handleUpdate,
    loading,
    error,
  };
}

// Example: Using the delete member mutation
export function useDeleteMemberExample() {
  const [deleteMember, { loading, error }] = useMutation<
    DeleteMemberMutationResponse,
    { id: string }
  >(DELETE_MEMBER_MUTATION);

  const handleDelete = async (id: string) => {
    try {
      const { data } = await deleteMember({
        variables: { id },
      });
      return data?.deleteMember;
    } catch (err) {
      console.error('Error deleting member:', err);
      throw err;
    }
  };

  return {
    deleteMember: handleDelete,
    loading,
    error,
  };
}
