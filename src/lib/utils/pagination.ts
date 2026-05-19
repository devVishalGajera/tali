/** Derive page count from API totals; avoids showing pagination when all items fit one page. */
export function getProductListPagination(
  totalRecords: number,
  recordPerPage: number | string | undefined,
  apiTotalPages: number | undefined,
) {
  const perPage = Math.max(1, parseInt(String(recordPerPage ?? ""), 10) || 12);
  const fromRecords =
    totalRecords > 0 ? Math.ceil(totalRecords / perPage) : 1;
  const fromApi = Math.max(1, apiTotalPages ?? 1);
  const totalPages = Math.max(1, Math.min(fromApi, fromRecords));
  return {
    totalPages,
    showPagination: totalRecords > 0 && totalPages > 1,
  };
}
