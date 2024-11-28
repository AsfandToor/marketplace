import { getSession } from 'next-auth/react';
import useSWR, { SWRResponse, SWRConfiguration } from 'swr';
import useSWRMutation, { SWRMutationResponse, SWRMutationConfiguration } from 'swr/mutation';

export const fetcher = async <T>(
  url: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' = 'GET',
  data?: T
): Promise<T> => {
  const session = await getSession();
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}${url}`, {
    headers: {
      Authorization: `Bearer ${session?.token}`,
      'Content-Type': 'application/json',
    },
    method,
    body: data ? JSON.stringify(data) : undefined,
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch: ${response.statusText}`);
  }
  return response.json();
};

const mutationFetcher = async <T, D>(
  url: string,
  { arg }: { arg: D },
  method: 'POST' | 'PUT' | 'DELETE' | 'PATCH'
): Promise<T> => {
  const session = await getSession();
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}${url}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session?.token}`,
    },
    body: JSON.stringify(arg),
  });
  if (!response.ok) {
    throw new Error(`Failed to ${method}: ${response.statusText}`);
  }
  return response.json();
};

export const useApi = <T>(
  endpoint: string | null,
  options: SWRConfiguration = {}
): SWRResponse<T, Error> => {
  return useSWR<T, Error>(endpoint, fetcher, options);
};

export const usePostMutation = <T, D>(
  endpoint: string,
  options: SWRMutationConfiguration<T, Error, string, D> = {}
): SWRMutationResponse<T, Error, string, D> => {
  return useSWRMutation<T, Error, string, D>(
    endpoint,
    async (url, { arg }: { arg: D }) => mutationFetcher<T, D>(url, { arg }, 'POST'),
    options
  );
};

export const usePutMutation = <T, D>(
  endpoint: string,
  options: SWRMutationConfiguration<T, Error, string, D> = {}
): SWRMutationResponse<T, Error, string, D> => {
  return useSWRMutation<T, Error, string, D>(
    endpoint,
    async (url, { arg }: { arg: D }) => mutationFetcher<T, D>(url, { arg }, 'PUT'),
    options
  );
};

export const usePatchMutation = <T, D>(
  endpoint: string,
  options: SWRMutationConfiguration<T, Error, string, D> = {}
): SWRMutationResponse<T, Error, string, D> => {
  return useSWRMutation<T, Error, string, D>(
    endpoint,
    async (url, { arg }: { arg: D }) => mutationFetcher<T, D>(url, { arg }, 'PATCH'),
    options
  );
};

export const useDeleteMutation = <T>(
  endpoint: string,
  options: SWRMutationConfiguration<T, Error, string, undefined> = {}
): SWRMutationResponse<T, Error, string, undefined> => {
  return useSWRMutation<T, Error, string, undefined>(
    endpoint,
    async (url) => mutationFetcher<T, undefined>(url, { arg: undefined }, 'DELETE'),
    options
  );
};