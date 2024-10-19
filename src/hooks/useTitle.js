import { useEffect } from "react";

export function useTitle(title) {
  useEffect(() => {
    document.title = `Nutrisys - ${title}`;
  }, []);

  return null;
}