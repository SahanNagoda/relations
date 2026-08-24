import { Filter } from "adminjs";

/**
 * @adminjs/sequelize converts string filters to `LIKE '%value%'`.
 * Relation join keys are foreign keys and must use exact equality instead.
 *
 * Remap only the given keys' property type so convert-filter takes the default
 * `{ [column]: value }` path (`=`), while other string filters stay as LIKE.
 *
 * @param {Record<string, unknown>} filters
 * @param {import("adminjs").BaseResource} resource
 * @param {string[]} exactKeys
 * @returns {import("adminjs").Filter}
 */
export const createFilterWithExactKeys = (filters, resource, exactKeys = []) => {
  const filter = new Filter(filters, resource);
  exactKeys.forEach((key) => {
    if (!key) return;
    const element = filter.filters[key];
    const property = element?.property;
    if (!property || typeof property.type !== "function") return;
    const originalType = property.type.bind(property);
    property.type = () => {
      const type = originalType();
      return type === "string" ? "reference" : type;
    };
  });
  return filter;
};
