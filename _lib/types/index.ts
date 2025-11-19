export interface ParsedProduct {
  _id: string;
  skuId: string;
  title: string;
  summary: string;
  mrp: string;
  currency: string;
  brandId: any; // keep as any because API sends nested brand object
}

export interface BatchScanStats {
  preScan: number;
  postScan: number;
  normal: number;
  suspicious: number;
  anomaly: number;
}

export interface BatchBrand {
  _id: string;
  name: string;
  logo: string;
  website: string;
  description: string;
  manage_categories: Array<{
    categories: string;
    subcategories: string[];
    _id: string;
  }>;
  status: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface BatchView {
  _id: string;
  productId: string;
  businessOwnerId: string;

  batchId: string;

  manufactureDate: string;
  expireDate: string;

  status: "active" | "inactive" | "processing";
  serialNumberType: "sequential" | "random";

  prefix: string;
  startSerialNumber: string;
  noOfItems: number;

  createdAt: string;
  updatedAt: string;

  brand: BatchBrand;

  scans: BatchScanStats;
}

export interface ListViewProps {
  batches: BatchView[];
  selected: string[];
  toggleSelect: (id: string) => void;
  toggleSelectAll: () => void;
  setViewDetails: React.Dispatch<React.SetStateAction<string>>;
}
export interface CardViewProps {
  batches: BatchView[];
  selected: string[];
  toggleSelect: (id: string) => void;
  setViewDetails: React.Dispatch<React.SetStateAction<string>>;
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
export interface Props {
  open: boolean;
  setOpen: (v: boolean) => void;
  payload: any; // API response object (as you provided)
  onClose?: () => void;
}

export interface IBrandCategory {
  _id: string;
  categories: string;
  subcategories: string[];
}

export interface IUserRef {
  _id: string;
  email: string;
  role?: string;
}

export interface IBusinessOwnerRef {
  _id: string;
  businessName: string;
  email: string;
}

export interface IBrand {
  _id: string;
  name: string;
  logo?: string;
  website?: string;
  description?: string;

  manage_categories: IBrandCategory[];

  status: "active" | "inactive";

  createdBy: IUserRef | string;
  businessOwnerId: IBusinessOwnerRef | string;

  createdAt: string;
  updatedAt: string;
}

export interface IProductSpecification {
  _id?: string;
  [key: string]: any;
}

export interface IBrandShortRef {
  _id: string;
  name?: string;
  website?: string;
}

export interface IProduct {
  _id: string;
  skuId: string;
  tags: string[];

  title: string;
  summary: string;

  mrp: string;
  currency: string;

  mainImageUrl: string;
  sliderImages: string[];
  eanNumber: string;

  brandId: IBrandShortRef | string;

  specification: IProductSpecification;

  youtubeVideoLink: string[];
  facebookLink?: string;
  twitterLink?: string;
  instagramLink?: string;

  warrantyEnable: boolean;
  warrantyDuration?: string;
  warrantyDurationUnit?: "days" | "months" | "years";

  distributorPoints?: string;
  retailerPoints?: string;
  agentPoints?: string;
  consumerPoints?: string;

  createdBy: IUserRef | string;
  businessOwnerId: IBusinessOwnerRef | string;

  qrlink?: string;
  qrGenerateType: "pre" | "post";
  enableNft: boolean;

  createdAt: string;
  updatedAt: string;
}

export interface StepFormProps {
  brands: IBrand[];
  products: IProduct[];
  businessOwnerId: string;
  onClose: () => void; // Go back to listing
}
export interface ManageCategory {
  categories: string;
  subcategories: string[];
}
export interface Brand {
  _id: string;
  name: string;
  logo: string;
  website: string;
  description: string;
  categories: string;
  subcategories: string[];
  products: string;
  status: "active" | "inactive";
  createdBy: string;
  businessOwnerId: string;
  createdAt: string;
  updatedAt: string;
  manage_categories?: ManageCategory[];
}

export interface Coupon {
  _id: string;
  code: string;
  discountValue: number;
  discountType: string;
  minPurchaseAmount: number;
  maxDiscountAmount: number;
  validFrom: string;
  validUntil: string;
  isActive: boolean;
  isScratched: boolean;
  issued: boolean;
  createdBy: string;
  productId: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}
export interface Pagination {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface AnalyticsResponse {
  period: string;
  timeRange: {
    start: string;
    end: string;
  };
  consumerMetrics: {
    uniqueVerifiedConsumers: number;
    totalScans: number;
    totalPurchases: number;
    totalWarranties: number;
  };
  loyaltyRewards: {
    couponsIssued: number;
    couponsRedeemed: number;
    couponsActive: number;
  };
  conversionRatios: {
    scanToPurchaseRatio: number;
    purchaseToWarrantyRatio: number;
    overallConversionRatio: number;
  };
  businessOwnerMetrics: {
    activeBusinessOwners: number;
    verifiedBusinessOwners: number;
  };
}

// Parsed product (because backend sends stringify)
export interface ProductInfo {
  _id: string;
  skuId: string;
  title: string;
  summary: string;
  mrp: string;
  currency: string;
}

// Each QR Tag / Serial Entry
export interface BatchSerialItem {
  _id: string;

  productId: string; // still stringified JSON
  batchId: string; // still stringified JSON
  businessOwnerId: string;

  productSerialNumber: string;
  scanCount: number;
  purchased: boolean;
  status: string;

  preScannerQRCodeUrl: string;
  postScannerQRCodeUrl: string;

  createdAt: string;
  updatedAt: string;
}

// Main Batch Object
export interface BatchDetailsResponse {
  _id: string;

  productId: string; // stringified JSON → parse using parseProduct()
  businessOwnerId: string;

  batchId: string;

  manufactureDate: string;
  expireDate: string;

  status: "active" | "inactive" | "processing";

  serialNumberType: "sequential" | "random";
  prefix: string;
  startSerialNumber: string;

  noOfItems: number;

  tags: BatchSerialItem[];

  createdAt: string;
  updatedAt: string;
}

export interface ProductInfo {
  _id: string;
  skuId: string;
  title: string;
  summary: string;
  mrp: string;
  currency: string;
}

export interface BatchInfoForTag {
  _id: string;
  batchId: string;
  manufactureDate: string;
  expireDate: string;
}

export interface BatchTag {
  _id: string;
  productId: ProductInfo; // parsed object
  batchId: BatchInfoForTag; // parsed object
  businessOwnerId: string;
  productSerialNumber: string;
  scanCount: number;
  purchased: boolean;
  status: "active" | "inactive";
  preScannerQRCodeUrl: string;
  postScannerQRCodeUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface BatchDetails {
  _id: string;

  // productId is coming as a stringified object → must parse
  productId: ProductInfo | string;

  businessOwnerId: string;

  batchId: string;
  manufactureDate: string;
  expireDate: string;

  status: "active" | "inactive";
  serialNumberType: "sequential" | "random";

  prefix: string;
  startSerialNumber: string;
  noOfItems: number;

  tags: BatchTag[];

  createdAt: string;
  updatedAt: string;
}
