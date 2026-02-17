export interface Log {
  timestamp: string;
  level: string;
  method?: string;
  status?: number;
  adminEmail?: string;
  adminName?: string;
  path?: string;
  url?: string;
  ip?: string;
  message?: string;
  responseTime?: number;
  durationMs?: number;
  time?: string;
  adminId?: string | null;
  body?: Record<string, any>;
  query?: Record<string, any>;
  params?: Record<string, any>;
  userAgent?: string;
}

export interface LogFilters {
  method?: string | null;
  status?: string | null;
  adminEmail?: string | null;
}

export interface LogsResponse {
  status: string;
  page: number;
  limit: number;
  total: number;
  results: number;
  logs: Log[];
  dateRange?: {
    startDate: string | null;
    endDate: string | null;
  };
  date?: string;
  filters?: LogFilters;
  message?: string;
}

export interface AvailableLogDatesResponse {
  status: string;
  total: number;
  dates: string[];
}
