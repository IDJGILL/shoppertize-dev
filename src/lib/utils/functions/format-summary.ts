export const formatSummary = (summary: Summary, currency: string) => {
  const formatted: FormattedSummary = {} as FormattedSummary;

  for (const key of Object.keys(summary)) {
    const objectKey = key as keyof Summary;

    formatted[objectKey] = `${currency}${summary[objectKey]?.toLocaleString()}`;
  }

  return formatted;
};
