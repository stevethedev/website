export type ClassName =
  | string
  | Record<string, boolean | undefined>
  | ClassName[]
  | null
  | undefined;

export default function getClassName(...candidates: ClassName[]): string {
  return candidates
    .filter(
      (candidate): candidate is Exclude<typeof candidate, null> =>
        candidate !== null,
    )
    .filter(
      (candidate): candidate is Exclude<typeof candidate, undefined> =>
        candidate !== undefined,
    )
    .flatMap((candidate) => {
      if (typeof candidate === "string") {
        return candidate;
      }

      if (Array.isArray(candidate)) {
        return getClassName(...candidate);
      }

      return Object.entries(candidate)
        .filter(([, value]) => value)
        .map(([key]) => key);
    })
    .join(" ");
}
