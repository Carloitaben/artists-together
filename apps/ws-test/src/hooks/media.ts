import { useEffect, useState } from "react"

export function useOnMatchMedia(query: string, callback: (matches: boolean) => void) {
  useEffect(() => {
    const mediaQuery = window.matchMedia(query)

    function onChange(event: MediaQueryListEvent) {
      callback(event.matches)
    }

    callback(mediaQuery.matches)

    if ("addEventListener" in mediaQuery) {
      mediaQuery.addEventListener("change", onChange)
      return () => mediaQuery.removeEventListener("change", onChange)
    } else {
      // @ts-expect-error this is deprecated but surely exists
      mediaQuery.addListener(onChange)
      // @ts-expect-error this is deprecated but surely exists
      return () => mediaQuery.removeListener(onChange)
    }
  }, [query, callback])
}

export function useMatchesMedia(query: string) {
  const [matches, setMatches] = useState<boolean>()
  useOnMatchMedia(query, setMatches)
  return matches
}
