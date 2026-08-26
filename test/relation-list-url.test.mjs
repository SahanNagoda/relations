/**
 * Details-view → main table: join filters become `filters.*` query params
 * so the list opens already scoped to this parent.
 */
import assert from 'node:assert/strict';
import {
  joinFiltersFromOwner,
  resourceListUrlWithFilters,
  RELATION_TAB_PER_PAGE,
} from '../lib/utils/relation-list-url.js';

assert.equal(RELATION_TAB_PER_PAGE, 50);

const owner = {
  id: '7',
  params: { id: '7', project_id: 'P100', sub_project_id: '01' },
};

assert.deepEqual(
  joinFiltersFromOwner(
    {
      source: { joinKey: 'project_id', joinKeys: ['project_id', 'sub_project_id'] },
      target: { joinKey: 'project_id', joinKeys: ['project_id', 'sub_project_id'] },
    },
    owner,
  ),
  { project_id: 'P100', sub_project_id: '01' },
);

assert.deepEqual(
  joinFiltersFromOwner(
    {
      source: { joinKey: 'id' },
      target: { joinKey: 'userId', resourceId: 'user_permission_set' },
    },
    owner,
  ),
  { userId: '7' },
);

assert.equal(
  joinFiltersFromOwner(
    {
      source: { joinKey: 'project_id', joinKeys: ['project_id', 'sub_project_id'] },
      target: { joinKey: 'project_id', joinKeys: ['project_id', 'sub_project_id'] },
    },
    { params: { project_id: 'P100' } },
  ),
  null,
);

assert.equal(
  resourceListUrlWithFilters('activity_ext', { project_id: 'P100', sub_project_id: '01' }),
  '/resources/activity_ext?filters.project_id=P100&filters.sub_project_id=01&exactKeys=project_id%2Csub_project_id',
);

assert.equal(resourceListUrlWithFilters('activity_ext', null), null);
assert.equal(resourceListUrlWithFilters(undefined, { project_id: 'P100' }), null);

console.log('PASS  relation-list-url');
