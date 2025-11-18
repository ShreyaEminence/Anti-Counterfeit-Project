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
  products:string;
  status: "active" | "inactive";
  createdBy: string;
  businessOwnerId: string;
  createdAt: string;
  updatedAt: string;
   manage_categories?: ManageCategory[];
}