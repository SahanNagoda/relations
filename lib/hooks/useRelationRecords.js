import { ApiClient, useNotice, useQueryParams } from "adminjs";
import { useEffect, useState } from "react";
import { useRelationConfig } from "../providers/RelationConfigProvider.js";
import { RELATION_TAB_PER_PAGE } from "../utils/relation-list-url.js";

const api = new ApiClient();

export const useRelationRecords = (props) => {
  const { record, resource, targetResourceId, tab } = props;
  const { relation, refreshToken } = useRelationConfig();
  const [data, setData] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const { direction, sortBy, page, parsedQuery } = useQueryParams();
  const addNotice = useNotice();

  useEffect(() => {
    if (tab !== relation || !record) return;
    setIsLoading(true);
    api
      .recordAction({
        actionName: "findRelation",
        recordId: record.id,
        resourceId: resource.id,
        params: {
          relation,
          direction,
          sortBy,
          page,
          perPage: RELATION_TAB_PER_PAGE,
        },
      })
      .then(({ data: { records, meta, notice } }) => {
        if (notice) addNotice(notice);
        setIsLoading(false);
        setData({ records, meta });
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [
    tab,
    relation,
    record,
    resource.id,
    targetResourceId,
    direction,
    sortBy,
    page,
    parsedQuery,
    refreshToken,
  ]);

  return { data, isLoading };
};
