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

const propertyName = (prop) => prop?.name || prop?.propertyPath || prop?.path;

/**
 * Join columns on a relation side. `joinKeys` (composite) wins; otherwise
 * the singular `joinKey` the package has always required.
 */
export const joinKeysOf = (side) => {
  if (!side) return [];
  if (Array.isArray(side.joinKeys) && side.joinKeys.length) return [...side.joinKeys];
  return side.joinKey ? [side.joinKey] : [];
};

/**
 * True when the column is the back-pointer to the parent this subtable is
 * nested under. Every row then carries the same value, so it is noise.
 *
 * Two shapes:
 *  - AdminJS `reference` pointing at the owner resource
 *  - the relation's target join key(s), which this project uses instead of
 *    Sequelize associations so `reference` is never set
 */
export const isOwnerJoinColumn = (prop, { ownerResourceId, joinKeys = [] } = {}) => {
  if (!prop) return false;
  if (ownerResourceId && prop.reference === ownerResourceId) return true;
  const name = propertyName(prop);
  return Boolean(name && joinKeys.includes(name));
};

export const withoutOwnerJoinColumns = (properties, opts = {}) =>
  (properties || []).filter((prop) => !isOwnerJoinColumn(prop, opts));

/**
 * Given a resource JSON object and column preferences, returns the ordered,
 * filtered array of property descriptors to render in the subtable.
 *
 * @param {object} resource - AdminJS ResourceJSON (has .properties, .id)
 * @param {object} preferences - { columnOrder: string[], columnWidths: Record<string,number>, hiddenColumns: string[] }
 * @param {object} opts - { ownerResourceId?: string, joinKeys?: string[] }
 * @returns {Array<{ name, label, path, propertyPath, width, ... }>}
 */
export const applyColumnPreferences = (resource, preferences, opts = {}) => {
  const { columnOrder = [], columnWidths = {}, hiddenColumns = [] } = preferences;
  const { ownerResourceId, joinKeys = [] } = opts;

  const propsMap = resource.properties || {};
  const allProps = Object.values(propsMap);

  // Filter out system/hidden columns
  const visible = allProps.filter((prop) => {
    if (!prop || !prop.name) return false;
    if (prop.name === 'id') return false;
    if (ALWAYS_HIDDEN.has(prop.name)) return false;
    if (!isVisibleInList(prop)) return false;
    if (isOwnerJoinColumn(prop, { ownerResourceId, joinKeys })) return false;
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
