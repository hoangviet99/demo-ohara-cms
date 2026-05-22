import { useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router";

const STORAGE_KEY_PREFIX = "intershop_pagination_";

interface UsePaginationHistoryOptions {
  scope: string;
  defaultPage?: number;
  defaultLimit?: number;
}

export function usePaginationHistory(options: UsePaginationHistoryOptions) {
  const { scope, defaultPage = 1, defaultLimit = 10 } = options;

  const storageKey = `${STORAGE_KEY_PREFIX}${scope}`;
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const queryPage = searchParams.get("page");
  const page = queryPage ? parseInt(queryPage, 10) : defaultPage;

  const setPage = useCallback(
    (newPage: number) => {
      try {
        sessionStorage.setItem(storageKey, String(newPage));
      } catch {
        // sessionStorage may be unavailable
      }
      setSearchParams((prev) => {
        if (newPage === 1) {
          prev.delete("page");
          return prev;
        }
        prev.set("page", String(newPage));
        return prev;
      });
    },
    [storageKey, setSearchParams]
  );

  const clearStoredPage = useCallback(() => {
    try {
      sessionStorage.removeItem(storageKey);
    } catch {
      // ignore
    }
  }, [storageKey]);

  const getReturnHref = useCallback((): string => {
    try {
      const stored = sessionStorage.getItem(storageKey);
      const storedPage = stored ? parseInt(stored, 10) : defaultPage;
      return storedPage > 1 ? `?page=${storedPage}` : "";
    } catch {
      return "";
    }
  }, [storageKey, defaultPage]);

  return {
    page,
    setPage,
    getReturnHref,
    clearStoredPage,
    defaultLimit,
  };
}
