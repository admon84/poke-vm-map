export type LeftPanelContent = 'nearest' | 'search' | 'categories' | 'saved' | null
export type RightPanelContent = 'location-details' | 'reviews' | 'photos' | null

export interface LeftPanelState {
  isOpen: boolean
  activeContent: LeftPanelContent
  data?: any
}

export interface RightPanelState {
  isOpen: boolean
  activeContent: RightPanelContent
  locationId?: string
  data?: any
  isLoading: boolean
}

export interface PanelState {
  leftPanel: LeftPanelState
  rightPanel: RightPanelState
}

export interface PanelActions {
  openLeftPanel: (content: Exclude<LeftPanelContent, null>) => void
  closeLeftPanel: () => void
  toggleLeftPanel: (content: Exclude<LeftPanelContent, null>) => void
  
  openRightPanel: (locationId: string, content: Exclude<RightPanelContent, null>) => void
  closeRightPanel: () => void
  updateRightPanelContent: (content: Exclude<RightPanelContent, null>) => void
}

