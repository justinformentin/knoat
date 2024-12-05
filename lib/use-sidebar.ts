import { useEffect, useState } from 'react'
import { create } from 'zustand'
import type { StoreApi, UseBoundStore } from 'zustand/'
import { persist } from 'zustand/middleware'

enum SidebarState {
    Expanded = 'expanded',
    Collapsed = 'collapsed'
}
interface SidebarStore {
    sidebarState: 'expanded' | 'collapsed';
    open: boolean;
    setOpen: (open: boolean) => void;
    openMobile: boolean;
    setOpenMobile: (open: boolean) => void;
    toggleSidebar: () => void;
  }
export const sidebarStore: UseBoundStore<StoreApi<SidebarStore>> = create(
  persist(
    (set) => ({
      sidebarState: 'collapsed',
      open: false,
      setOpen: (open: boolean) => set({open}),
      openMobile: false,
      setOpenMobile: (open: boolean) => set({openMobile: open}),
      toggleSidebar: () => {
        set((state) => ({ sidebarState: state.sidebarState === SidebarState.Expanded ? SidebarState.Collapsed :SidebarState.Expanded }))
      },
    }),
    { name: 'sidebar-state' }
  )
)

export const useSidebarStore = sidebarStore;
export const useSidebar = () => {
  const initialOpen = sidebarStore.getState().sidebarState

  const [sidebarState, setSidebarState] = useState<'expanded' | 'collapsed'>(initialOpen)

  useEffect(() => {
    const unsub = sidebarStore.subscribe((state) => setSidebarState(state.sidebarState))
    return () => unsub()
  }, [])

  const toggleSidebar = sidebarStore((state) => state.toggleSidebar)

  return { sidebarState, toggleSidebar }
}
