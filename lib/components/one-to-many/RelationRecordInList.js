import { Placeholder, TableCell, TableRow } from "@adminjs/design-system";
import { BasePropertyComponent, ViewHelpers } from "adminjs";
import React from "react";
import { useNavigate } from "react-router";
import { RelationRecordInListActions } from "./RelationRecordInListActions.js";
import { useRedirectUrl } from "../shared/useRedirectUrl.js";

const DEFAULT_COLUMN_WIDTH = 150;
const v = new ViewHelpers();

export const RelationRecordInList = (props) => {
  const { resource, record, isLoading, properties } = props;
  const navigate = useNavigate();
  const redirectUrl = useRedirectUrl();

  const showAction = record.recordActions.find(({ name }) => name === "show");

  // Prefer the explicitly passed properties; fall back to resource.listProperties
  const cols = properties || resource.listProperties;

  return React.createElement(
    TableRow,
    {
      "data-id": record.id,
      "data-css": [resource.id, "row"].join("-"),
      onClick: () => {
        if (showAction) {
          const url = v.recordActionUrl({
            actionName: showAction.name,
            recordId: record.id,
            resourceId: resource.id,
            search: `?redirectUrl=${encodeURIComponent(redirectUrl)}`,
          });
          navigate(url);
        }
      },
    },
    // empty leading cell (matches RecordsTableHeader layout)
    React.createElement(TableCell, { width: 0 }),
    cols.map((prop) =>
      React.createElement(
        TableCell,
        {
          key: prop.propertyPath || prop.name,
          "data-property-name": prop.propertyPath || prop.name,
          "data-css": [resource.id, prop.name, "cell"].join("-"),
          display: "table-cell",
          style: {
            cursor: showAction ? "pointer" : "initial",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            maxWidth: `${prop.width || DEFAULT_COLUMN_WIDTH}px`,
          },
        },
        isLoading
          ? React.createElement(Placeholder, { style: { height: 14 } })
          : React.createElement(BasePropertyComponent, {
              key: prop.propertyPath || prop.name,
              where: "list",
              property: prop,
              resource,
              record,
            })
      )
    ),
    React.createElement(
      TableCell,
      { key: "options", className: "options" },
      isLoading
        ? React.createElement(Placeholder, { style: { height: 14 } })
        : React.createElement(RelationRecordInListActions, {
            record,
            resource,
          })
    )
  );
};
