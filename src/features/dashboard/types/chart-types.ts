/**
 * Types for Recharts components
 */

export interface TooltipPayloadItem {
  name: string
  value: number
  color: string
  dataKey: string
  payload: Record<string, unknown>
}

export interface CustomTooltipProps {
  active?: boolean
  payload?: TooltipPayloadItem[]
  label?: string
}
