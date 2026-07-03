import { baseApi } from './baseApi';

export interface ProductImage {
  id: string;
  fileUrl: string;
}

export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
}

export interface PublicCategory {
  id: string;
  name: string;
}

export interface PublicProduct {
  id: string;
  title: string;
  slug: string;
  description: string;
  image?: ProductImage;
  category?: ProductCategory;
  assessments?: any[];
}

export interface GetPublicProductsResponse {
  success?: boolean;
  data: PublicProduct[];
}

export const publicProductApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPublicProducts: builder.query<PublicProduct[], { search?: string; category?: string } | void>({
      query: (params) => {
        let url = '/public/products';
        if (params) {
          const queryParams = new URLSearchParams();
          if (params.search) queryParams.append('search', params.search);
          if (params.category) queryParams.append('category', params.category);
          
          const queryString = queryParams.toString();
          if (queryString) url += `?${queryString}`;
        }
        return url;
      },
      transformResponse: (response: any) => {
        return Array.isArray(response) ? response : (response.data || []);
      },
      providesTags: ['Products'],
    }),
    getPublicProductBySlug: builder.query<PublicProduct, string>({
      query: (slug) => `/public/products/${slug}`,
      transformResponse: (response: any) => {
        return response.data || response;
      },
      providesTags: (result, error, slug) => [{ type: 'Products', id: slug }],
    }),
    getPublicCategories: builder.query<PublicCategory[], void>({
      query: () => '/patient/categories-names',
      transformResponse: (response: any) => {
        return response.data || [];
      },
      providesTags: ['Products'], // We can reuse Products tag or add Categories tag
    }),
  }),
  overrideExisting: false,
});

export const { useGetPublicProductsQuery, useGetPublicProductBySlugQuery, useGetPublicCategoriesQuery } = publicProductApi;
