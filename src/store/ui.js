import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useUiStore = create(persist(
    (set) => ({
        showPlacementAptitude: false,
        showPlacementMock: false,
        enablePlacementAptitude: () => set({ showPlacementAptitude: true }),
        enablePlacementMock: () => set({ showPlacementMock: true }),
        resetPlacementTrainingLinks: () => set({ showPlacementAptitude: false, showPlacementMock: false })
    }),
    {
        name: 'placemint-ui-pref'
    }
))
