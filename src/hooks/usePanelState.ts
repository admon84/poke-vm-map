import { useState, useCallback } from 'react'
import type { PanelState, PanelActions, LeftPanelContent, RightPanelContent } from '@/types/panel'

export function usePanelState(): [PanelState, PanelActions] {
  const [panelState, setPanelState] = useState<PanelState>({
    leftPanel: {
      isOpen: false,
      activeContent: null,
    },
    rightPanel: {
      isOpen: false,
      activeContent: null,
      isLoading: false,
    },
  })

  const openLeftPanel = useCallback((content: Exclude<LeftPanelContent, null>) => {
    setPanelState(prev => ({
      ...prev,
      leftPanel: {
        isOpen: true,
        activeContent: content,
      },
    }))
  }, [])

  const closeLeftPanel = useCallback(() => {
    setPanelState(prev => ({
      ...prev,
      leftPanel: {
        ...prev.leftPanel,
        isOpen: false,
      },
    }))
  }, [])

  const toggleLeftPanel = useCallback((content: Exclude<LeftPanelContent, null>) => {
    setPanelState(prev => ({
      ...prev,
      leftPanel: {
        isOpen: prev.leftPanel.activeContent === content ? !prev.leftPanel.isOpen : true,
        activeContent: content,
      },
    }))
  }, [])

  const openRightPanel = useCallback((locationId: string, content: Exclude<RightPanelContent, null>) => {
    setPanelState(prev => ({
      ...prev,
      rightPanel: {
        isOpen: true,
        activeContent: content,
        locationId,
        isLoading: true,
      },
    }))
  }, [])

  const closeRightPanel = useCallback(() => {
    setPanelState(prev => ({
      ...prev,
      rightPanel: {
        ...prev.rightPanel,
        isOpen: false,
      },
    }))
  }, [])

  const updateRightPanelContent = useCallback((content: Exclude<RightPanelContent, null>) => {
    setPanelState(prev => ({
      ...prev,
      rightPanel: {
        ...prev.rightPanel,
        activeContent: content,
      },
    }))
  }, [])

  const actions: PanelActions = {
    openLeftPanel,
    closeLeftPanel,
    toggleLeftPanel,
    openRightPanel,
    closeRightPanel,
    updateRightPanelContent,
  }

  return [panelState, actions]
}

