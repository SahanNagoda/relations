const ALWAYS_HIDDEN = new Set(['password', 'passwordHash', 'password_hash']);
const DEFAULT_COLUMN_WIDTH = 150;

/**
 * Returns whether a property should be visible in list view.
 */
const isVisibleInList = (prop) => {
  if (typeof prop.isVisible === 'object' && prop.isVisible !== null) {
    return prop.isVisible.list !== false;
  }
  return prop.isVisible !== false;
};

/**
 * Given a resource JSON object and column preferences, returns the ordered,
 * filtered array of property descriptors to render in the subtable.
 *
 * @param {object} resource - AdminJS ResourceJSON (has .properties, .id)
 * @param {object} preferences - { columnOrder: string[], columnWidths: Record<string,number>, hiddenColumns: string[] }
 * @param {object} opts - { ownerResourceId?: string } — reference column to exclude
 * @returns {Array<{ name, label, path, propertyPath, width, ... }>}
 */
export const applyColumnPreferences = (resource, preferences, opts = {}) => {
  const { columnOrder = [], columnWidths = {}, hiddenColumns = [] } = preferences;
  const { ownerResourceId } = opts;

  const propsMap = resource.properties || {};
  const allProps = Object.values(propsMap);

  // Filter out system/hidden columns
  const visible = allProps.filter((prop) => {
    if (!prop || !prop.name) return false;
    if (prop.name === 'id') return false;
    if (ALWAYS_HIDDEN.has(prop.name)) return false;
    if (!isVisibleInList(prop)) return false;
    // Filter out the back-reference to the owner resource
    if (ownerResourceId && prop.reference === ownerResourceId) return false;
    // Respect user's hidden columns preference
    if (hiddenColumns.includes(prop.name)) return false;
    return true;
  });

  // Apply columnOrder
  let ordered;
  if (columnOrder.length > 0) {
    const orderMap = new Map(columnOrder.map((name, i) => [name, i]));
    const inOrder = visible
      .filter((p) => orderMap.has(p.name))
      .sort((a, b) => (orderMap.get(a.name) ?? 999) - (orderMap.get(b.name) ?? 999));
    const notInOrder = visible.filter((p) => !orderMap.has(p.name));
    ordered = [...inOrder, ...notInOrder];
  } else {
    ordered = visible;
  }

  // Attach widths
  return ordered.map((p) => ({
    ...p,
    width: columnWidths[p.name] ?? DEFAULT_COLUMN_WIDTH,
  }));
};
