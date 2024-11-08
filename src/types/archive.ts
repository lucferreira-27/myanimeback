export interface TimemapEntry {
  timestamp: string;
  archiveUrl: string;
}

export interface ArchiveResponse {
  timestamp: string;
  archiveUrl: string;
  html: string;
}

export interface TimemapParams {
  url: string;
  from?: string;
  to?: string;
}