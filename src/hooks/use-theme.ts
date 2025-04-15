
export function useTheme() {
  return {
    theme: "system",
    setTheme: (theme: string) => {},
    themes: ["light", "dark", "system"]
  }
}
