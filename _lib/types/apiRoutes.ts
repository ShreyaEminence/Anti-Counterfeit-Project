const API_ROUTES = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
  },

  BRANDS: {
    LIST: "/brands",
    CREATE: "/brands/create",
    UPDATE: (id: string) => `/brands/update/${id}`,
    DELETE: (id: string) => `/brands/delete/${id}`,
  },

  CUSTOMERS: {
    LIST: "/customer",
    DETAILS: (id: string) => `/customer/${id}`,
  },
};

export default API_ROUTES;
