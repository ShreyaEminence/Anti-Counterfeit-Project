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

export interface StepFormProps  {
  brands: IBrand[];
  products: IProduct[];
  businessOwnerId: string;
  onClose: () => void; // Go back to listing
};
