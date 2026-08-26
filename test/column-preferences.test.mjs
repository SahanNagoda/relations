/**
 * Subtable column filtering: the parent join keys are constant on every row
 * of a detail-view relation tab, so they must not be rendered.
 */
import assert from 'node:assert/strict';
import {
  applyColumnPreferences,
  isOwnerJoinColumn,
  joinKeysOf,
  withoutOwnerJoinColumns,
} from '../lib/utils/column-preferences.js';

const emptyPrefs = { columnOrder: [], columnWidths: {}, hiddenColumns: [] };

const customerAddress = {
  id: 'customer_address',
  properties: {
    id: { name: 'id', isVisible: false },
    customer_id: { name: 'customer_id', isVisible: true },
    address_id: { name: 'address_id', isVisible: true },
    city: { name: 'city', isVisible: true },
  },
  listProperties: [
    { name: 'customer_id' },
    { name: 'address_id' },
    { name: 'city' },
  ],
};

assert.deepEqual(joinKeysOf({ joinKey: 'customer_id' }), ['customer_id']);
assert.deepEqual(
  joinKeysOf({ joinKey: 'project_id', joinKeys: ['project_id', 'sub_project_id'] }),
  ['project_id', 'sub_project_id'],
);
assert.deepEqual(joinKeysOf(undefined), []);

assert.equal(
  isOwnerJoinColumn(
    { name: 'customer_id' },
    { joinKeys: ['customer_id'] },
  ),
  true,
);
assert.equal(
  isOwnerJoinColumn(
    { name: 'customer_id', reference: 'customer_info' },
    { ownerResourceId: 'customer_info' },
  ),
  true,
);
assert.equal(
  isOwnerJoinColumn(
    { name: 'city' },
    { ownerResourceId: 'customer_info', joinKeys: ['customer_id'] },
  ),
  false,
);

assert.deepEqual(
  withoutOwnerJoinColumns(customerAddress.listProperties, { joinKeys: ['customer_id'] })
    .map((p) => p.name),
  ['address_id', 'city'],
);

const columns = applyColumnPreferences(customerAddress, emptyPrefs, {
  ownerResourceId: 'customer_info',
  joinKeys: ['customer_id'],
});
assert.deepEqual(columns.map((p) => p.name), ['address_id', 'city']);

const composite = applyColumnPreferences(
  {
    id: 'activity_ext',
    properties: {
      project_id: { name: 'project_id', isVisible: true },
      sub_project_id: { name: 'sub_project_id', isVisible: true },
      activity_no: { name: 'activity_no', isVisible: true },
    },
  },
  emptyPrefs,
  { joinKeys: ['project_id', 'sub_project_id'] },
);
assert.deepEqual(composite.map((p) => p.name), ['activity_no']);

console.log('column-preferences: PASS');
