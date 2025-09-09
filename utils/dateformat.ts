// utils/date.ts
export function formatDate(date: string | number | Date): string {
    return new Date(date).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }
  