// This helper previously handled deadline_at on gigs with raw SQL fallbacks.
// It is now intentionally empty because the app no longer persists explicit deadlines
// for gigs, and the underlying database schema does not include a deadline_at column.
