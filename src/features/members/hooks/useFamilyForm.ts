import { useState, useCallback } from 'react';
import { FamilyMember } from '../types';

export const useFamilyForm = () => {
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);

  const addFamilyMember = useCallback((member: FamilyMember) => {
    setFamilyMembers((prev) => [...prev, member]);
  }, []);

  const editFamilyMember = useCallback((index: number, member: FamilyMember) => {
    setFamilyMembers((prev) => {
      const updated = [...prev];
      updated[index] = member;
      return updated;
    });
  }, []);

  const removeFamilyMember = useCallback((index: number) => {
    setFamilyMembers((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const resetFamilyMembers = useCallback(() => {
    setFamilyMembers([]);
  }, []);

  return {
    familyMembers,
    addFamilyMember,
    editFamilyMember,
    removeFamilyMember,
    resetFamilyMembers,
  };
};
