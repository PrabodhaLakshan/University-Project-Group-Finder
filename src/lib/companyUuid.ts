/** UUID v4 shape — matches `companies.id` in the database. Student IDs (e.g. IT23xxxx) never match. */
export const COMPANY_UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
