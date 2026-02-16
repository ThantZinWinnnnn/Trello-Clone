type Bucket = {
  count: number;
  resetAt: number;
};

const requestBuckets = new Map<string, Bucket>();

export const isRateLimited = (
  key: string,
  options?: { limit?: number; windowMs?: number }
) => {
  const limit = options?.limit ?? 60;
  const windowMs = options?.windowMs ?? 60_000;
  const now = Date.now();
  const bucket = requestBuckets.get(key);

  if (!bucket || now > bucket.resetAt) {
    requestBuckets.set(key, { count: 1, resetAt: now + windowMs });
    return false;
  }

  if (bucket.count >= limit) {
    return true;
  }

  bucket.count += 1;
  requestBuckets.set(key, bucket);
  return false;
};
