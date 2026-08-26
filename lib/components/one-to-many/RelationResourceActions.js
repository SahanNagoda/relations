import { Box, Button, Icon } from "@adminjs/design-system";
import { ActionButton, useTranslation } from "adminjs";
import React from "react";
import { Link } from "react-router-dom";
import { Actions } from "../../constants/messages.js";
import { useRelationConfig } from "../../providers/RelationConfigProvider.js";
import {
  joinFiltersFromOwner,
  resourceListUrlWithFilters,
} from "../../utils/relation-list-url.js";
import { useRedirectUrl } from "../shared/useRedirectUrl.js";

export const RelationResourceActions = ({ targetResource }) => {
  const { ownerRecord, relations, relation } = useRelationConfig();
  const { ta } = useTranslation();
  const redirectUrl = useRedirectUrl();
  const relationConfig = relations[relation];
  const targetResourceId = relationConfig.target.resourceId;
  const joinKey = relationConfig.target.joinKey;
  const newActions = targetResource.resourceActions.filter(
    ({ name }) => name === "new"
  );
  const listUrl = resourceListUrlWithFilters(
    targetResourceId,
    joinFiltersFromOwner(relationConfig, ownerRecord)
  );

  if (!listUrl && (!joinKey || newActions.length === 0)) return null;

  return React.createElement(
    Box,
    {
      flex: true,
      mb: "xl",
      justifyContent: "end",
      alignItems: "center",
      style: { gap: "8px", flexWrap: "wrap" },
    },
    listUrl &&
      React.createElement(
        Button,
        {
          variant: "outlined",
          as: Link,
          to: listUrl,
          title: "Open this relation in the full table to add more filters",
        },
        React.createElement(Icon, { icon: "List" }),
        ta(Actions.ViewInList, targetResource.id)
      ),
    joinKey &&
      newActions.map((action) =>
        React.createElement(
          ActionButton,
          {
            key: action.name,
            action,
            resourceId: targetResourceId,
            queryParams: { [joinKey]: ownerRecord.id, redirectUrl },
          },
          React.createElement(
            Button,
            { variant: "contained" },
            React.createElement(Icon, { icon: action.icon }),
            ta(action.name, targetResource.id)
          )
        )
      )
  );
};
