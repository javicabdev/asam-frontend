import { useState, useCallback } from 'react';
import { useLazyQuery } from '@apollo/client';
import { 
  ListMembersDocument,
  ListMembersQuery,
  ListMembersQueryVariables,
  Member,
  MemberFilter,
} from '@/graphql/generated/operations';
import { exportMembersToCSV, exportMembersToExcel, CsvExportOptions } from '../utils/csvExport';

export interface UseExportMembersOptions {
  format?: 'csv' | 'excel';
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  csvOptions?: CsvExportOptions;
}

export interface ExportMembersParams {
  filters?: MemberFilter;
  selectedIds?: string[];
}

/**
 * Hook to handle members export functionality
 */
export const useExportMembers = (options: UseExportMembersOptions = {}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  
  const [fetchMembers] = useLazyQuery<ListMembersQuery, ListMembersQueryVariables>(
    ListMembersDocument,
    {
      fetchPolicy: 'network-only', // Always get fresh data for export
    }
  );
  
  /**
   * Export selected members or all filtered members
   */
  const exportMembers = useCallback(
    async ({ filters, selectedIds }: ExportMembersParams = {}) => {
      setIsExporting(true);
      setExportProgress(0);
      
      try {
        let membersToExport: Partial<Member>[] = [];
        
        if (selectedIds && selectedIds.length > 0) {
          // Export only selected members
          // We need to fetch these specific members
          const chunks = [];
          const chunkSize = 50; // GraphQL query limit
          
          for (let i = 0; i < selectedIds.length; i += chunkSize) {
            chunks.push(selectedIds.slice(i, i + chunkSize));
          }
          
          let processedChunks = 0;
          
          for (const chunk of chunks) {
            const { data } = await fetchMembers({
              variables: {
                filter: {
                  ...filters,
                  // @ts-ignore - ids field not in type but needed for batch export
                  ids: chunk,
                  pagination: {
                    page: 1,
                    pageSize: chunkSize,
                  },
                },
              },
            });
            
            if (data?.listMembers?.nodes) {
              membersToExport.push(...data.listMembers.nodes);
            }
            
            processedChunks++;
            setExportProgress((processedChunks / chunks.length) * 100);
          }
        } else {
          // Export all members matching the current filters
          let page = 1;
          let hasMore = true;
          const pageSize = 100; // Larger page size for export
          
          while (hasMore) {
            const { data } = await fetchMembers({
              variables: {
                filter: {
                  ...filters,
                  pagination: {
                    page,
                    pageSize,
                  },
                },
              },
            });
            
            if (data?.listMembers?.nodes && data.listMembers.nodes.length > 0) {
              membersToExport.push(...data.listMembers.nodes);
              
              const totalPages = data.listMembers.pageInfo?.totalPages || 1;
              hasMore = page < totalPages;
              page++;
              
              setExportProgress((page / totalPages) * 100);
            } else {
              hasMore = false;
            }
          }
        }
        
        // Perform the export
        if (membersToExport.length === 0) {
          throw new Error('No hay socios para exportar');
        }
        
        if (options.format === 'excel') {
          exportMembersToExcel(membersToExport, options.csvOptions);
        } else {
          exportMembersToCSV(membersToExport, options.csvOptions);
        }
        
        options.onSuccess?.();
      } catch (error) {
        console.error('Export error:', error);
        options.onError?.(error as Error);
      } finally {
        setIsExporting(false);
        setExportProgress(0);
      }
    },
    [fetchMembers, options]
  );
  
  /**
   * Export all members (no filters)
   */
  const exportAllMembers = useCallback(async () => {
    return exportMembers({ filters: undefined });
  }, [exportMembers]);
  
  /**
   * Export filtered members
   */
  const exportFilteredMembers = useCallback(
    async (filters: MemberFilter) => {
      return exportMembers({ filters });
    },
    [exportMembers]
  );
  
  /**
   * Export selected members
   */
  const exportSelectedMembers = useCallback(
    async (selectedIds: string[], filters?: MemberFilter) => {
      return exportMembers({ selectedIds, filters });
    },
    [exportMembers]
  );
  
  return {
    exportMembers,
    exportAllMembers,
    exportFilteredMembers,
    exportSelectedMembers,
    isExporting,
    exportProgress,
  };
};
