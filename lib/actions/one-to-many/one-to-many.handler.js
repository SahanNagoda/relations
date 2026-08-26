import { AppError, populator, SortSetter } from "adminjs";
import { Messages } from "../../constants/messages.js";
import { createFilterWithExactKeys } from "../../utils/exact-filter.js";
import { RELATION_TAB_PER_PAGE } from "../../utils/relation-list-url.js";
const getOwnerJoinValue = async (a, b, c, d) => {
  if (!a) return c;
  const e = d.record?.params?.[a];
  if (null !== e && void 0 !== e && "" !== e) return e;
  const f = await b.findOne(c, d),
    g = f?.params?.[a];
  return null !== g && void 0 !== g && "" !== g ? g : c;
};
export const oneToManyHandler = async (a, b, c = {}, d) => {
  const { relation: e, targetResource: f, ownerResource: g } = b,
    {
      sortBy: h,
      direction: i = "asc",
      filters: j = {},
      perPage: k = RELATION_TAB_PER_PAGE,
      page: l = 1,
    } = c;
  if (!e.target.joinKey) throw new AppError(Messages.JoinKeyMissing);
  const m = e.source?.joinKey,
    n = await getOwnerJoinValue(m, g, a, d);
  j[e.target.joinKey] = n;
  const o = f.decorate().getListProperties(),
    p = o.find((a) => a.isSortable());
  let q;
  p &&
    (q = SortSetter(
      { sortBy: h, direction: i },
      p.name(),
      f.decorate().options
    ));
  const r = createFilterWithExactKeys(j, f, [e.target.joinKey]),
    s = { limit: k, offset: (l - 1) * k, sort: q },
    t = await f.find(r, s, d),
    u = await populator(t, d);
  d.records = u;
  const v = await f.count(r, d);
  return {
    meta: {
      total: v,
      perPage: k,
      page: l,
      direction: q?.direction,
      sortBy: q?.sortBy,
    },
    records: u.map((a) => a.toJSON(d.currentAdmin)), // Note: Returning owner record as "record" is a workaround so that "record" type action
    // doesn't throw an error about "record" being required
    record: d.record?.toJSON(d.currentAdmin),
  };
};
