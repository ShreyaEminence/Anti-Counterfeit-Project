export interface ListViewProps {
  batches: any[];
  selected: string[];
  toggleSelect: (id: string) => void;
  toggleSelectAll: () => void;
}
export interface CardViewProps {
  batches: any[];
  selected: string[];
  toggleSelect: (id: string) => void;
}
export interface Product {
  _id: string;
  skuId: string;
  title: string;
  summary: string;
  mrp: string;
  currency: string;
  warranty?: string; // optional if you use warranty info
  brand?: string; // optional if you store brand
}

export interface ScanData {
  authentic?: number;
  purchased?: number;
  suspicious?: number;
}

export interface Batch {
  _id: string;
  productId: string | Product;
  businessOwnerId: string;
  batchId: string;
  manufactureDate?: string;
  expireDate?: string;
  status: "active" | "inactive" | "processing";
  serialNumberType?: string;
  prefix: string;
  startSerialNumber: string;
  noOfItems: number;
  createdAt: string;
  updatedAt: string;
  scanData?: ScanData;
}

export interface PaginationData {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface PaginationProps {
  pagination: PaginationData | null;
  onPageChange: (page: number) => void;
}
