import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { 
  KYCApplication, 
  KYCStats, 
  KYCFilterOptions, 
  SellerKYCStatus 
} from '@/app/types/kyc';

interface KYCState {
  // Seller KYC state
  sellerStatus: SellerKYCStatus | null;
  sellerLoading: boolean;
  sellerError: string | null;
  
  // Admin KYC state
  applications: KYCApplication[];
  stats: KYCStats | null;
  selectedApplication: KYCApplication | null;
  adminLoading: boolean;
  adminError: string | null;
  
  // Filter and pagination state
  filters: KYCFilterOptions;
  totalApplications: number;
  currentPage: number;
  totalPages: number;
}

const initialState: KYCState = {
  // Seller KYC
  sellerStatus: null,
  sellerLoading: false,
  sellerError: null,
  
  // Admin KYC
  applications: [],
  stats: null,
  selectedApplication: null,
  adminLoading: false,
  adminError: null,
  
  // Filters and pagination
  filters: {
    page: 1,
    limit: 10,
    sortBy: 'submittedAt',
    sortOrder: 'desc'
  },
  totalApplications: 0,
  currentPage: 1,
  totalPages: 0
};

const kycSlice = createSlice({
  name: 'kyc',
  initialState,
  reducers: {
    // Seller KYC actions
    setSellerLoading: (state, action: PayloadAction<boolean>) => {
      state.sellerLoading = action.payload;
    },
    
    setSellerError: (state, action: PayloadAction<string | null>) => {
      state.sellerError = action.payload;
      if (action.payload) {
        state.sellerLoading = false;
      }
    },
    
    setSellerStatus: (state, action: PayloadAction<SellerKYCStatus>) => {
      state.sellerStatus = action.payload;
      state.sellerLoading = false;
      state.sellerError = null;
    },
    
    updateSellerStatus: (state, action: PayloadAction<Partial<SellerKYCStatus>>) => {
      if (state.sellerStatus) {
        state.sellerStatus = {
          ...state.sellerStatus,
          ...action.payload
        };
      }
    },
    
    clearSellerKYC: (state) => {
      state.sellerStatus = null;
      state.sellerLoading = false;
      state.sellerError = null;
    },
    
    // Admin KYC actions
    setAdminLoading: (state, action: PayloadAction<boolean>) => {
      state.adminLoading = action.payload;
    },
    
    setAdminError: (state, action: PayloadAction<string | null>) => {
      state.adminError = action.payload;
      if (action.payload) {
        state.adminLoading = false;
      }
    },
    
    setApplications: (state, action: PayloadAction<{
      applications: KYCApplication[];
      total: number;
      page: number;
      limit: number;
    }>) => {
      state.applications = action.payload.applications;
      state.totalApplications = action.payload.total;
      state.currentPage = action.payload.page;
      state.totalPages = Math.ceil(action.payload.total / action.payload.limit);
      state.adminLoading = false;
      state.adminError = null;
    },
    
    setStats: (state, action: PayloadAction<KYCStats>) => {
      state.stats = action.payload;
    },
    
    setSelectedApplication: (state, action: PayloadAction<KYCApplication | null>) => {
      state.selectedApplication = action.payload;
    },
    
    updateApplication: (state, action: PayloadAction<KYCApplication>) => {
      const index = state.applications.findIndex(app => app.id === action.payload.id);
      if (index !== -1) {
        state.applications[index] = action.payload;
      }
      
      if (state.selectedApplication?.id === action.payload.id) {
        state.selectedApplication = action.payload;
      }
    },
    
    addApplication: (state, action: PayloadAction<KYCApplication>) => {
      state.applications.unshift(action.payload);
      state.totalApplications += 1;
    },
    
    removeApplication: (state, action: PayloadAction<string>) => {
      state.applications = state.applications.filter(app => app.id !== action.payload);
      state.totalApplications -= 1;
      
      if (state.selectedApplication?.id === action.payload) {
        state.selectedApplication = null;
      }
    },
    
    // Filter and pagination actions
    setFilters: (state, action: PayloadAction<KYCFilterOptions>) => {
      state.filters = {
        ...state.filters,
        ...action.payload
      };
    },
    
    updateFilter: (state, action: PayloadAction<Partial<KYCFilterOptions>>) => {
      state.filters = {
        ...state.filters,
        ...action.payload
      };
    },
    
    resetFilters: (state) => {
      state.filters = {
        page: 1,
        limit: 10,
        sortBy: 'submittedAt',
        sortOrder: 'desc'
      };
    },
    
    setPage: (state, action: PayloadAction<number>) => {
      state.filters.page = action.payload;
    },
    
    // Clear all KYC state
    clearKYCState: () => initialState
  }
});

export const {
  setSellerLoading,
  setSellerError,
  setSellerStatus,
  updateSellerStatus,
  clearSellerKYC,
  
  setAdminLoading,
  setAdminError,
  setApplications,
  setStats,
  setSelectedApplication,
  updateApplication,
  addApplication,
  removeApplication,
  
  setFilters,
  updateFilter,
  resetFilters,
  setPage,
  
  clearKYCState
} = kycSlice.actions;

export default kycSlice.reducer;