export const parseJsonArray = (value) => {
  if (Array.isArray(value)) return value;
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
};

export const normalizeSobreConfig = (value = {}) => ({
  ...value,
  doctor_credentials: parseJsonArray(value.doctor_credentials),
  values: parseJsonArray(value.values),
  team: parseJsonArray(value.team),
});
