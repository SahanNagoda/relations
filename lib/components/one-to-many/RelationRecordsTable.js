import { Box, Table, TableBody } from "@adminjs/design-system";
import { RecordsTableHeader, useQueryParams } from "adminjs";
import React from "react";
import { useRelationConfig } from "../../providers/RelationConfigProvider.js";
import { useColumnPreferences } from "../../hooks/useColumnPreferences.js";
import { applyColumnPreferences } from "../../utils/column-preferences.js";
import { RelationNoRecords } from "./RelationNoRecords.js";
import { RelationRecordInList } from "./RelationRecordInList.js";

const DEFAULT_COLUMN_WIDTH = 150;

export const RelationRecordsTable = (props) => {
  const { targetResource, records, isLoading } = props;
  const { ownerResource } = useRelationConfig();
  const { direction, sortBy } = useQueryParams();

  const { preferences, loaded } = useColumnPreferences(targetResource?.id);

  if (!records.length && !isLoading) {
    return React.createElement(RelationNoRecords, { resource: targetResource });
  }

  // Build the displayed properties respecting column preferences.
  // Fall back to listProperties (minus the owner reference) when prefs are
  // empty so the table is never blank on first render.
  let displayedProperties;
  if (loaded) {
    const derived = applyColumnPreferences(targetResource, preferences, {
      ownerResourceId: ownerResource.id,
    });
    displayedProperties =
      derived.length > 0
        ? derived
        : targetResource.listProperties.filter(
            ({ reference }) => reference !== ownerResource.id
          );
  } else {
    displayedProperties = targetResource.listProperties.filter(
      ({ reference }) => reference !== ownerResource.id
    );
  }

  // Build a resource-like object for RecordsTableHeader (it expects listProperties)
  const resourceForHeader = {
    ...targetResource,
    listProperties: displayedProperties,
  };

  // Total min-width: sum of property columns + 80px actions col.
  // Start accumulator at 80 to account for the trailing actions cell.
  const totalWidth = displayedProperties.reduce(
    (sum, p) => sum + (p.width || DEFAULT_COLUMN_WIDTH),
    80
  );

  return React.createElement(
    Box,
    {
      style: { overflowX: "auto", overflowY: "hidden", width: "100%" },
      "data-css": "relations-table-scroll",
    },
    React.createElement(
      Table,
      {
        "data-css": "relations-table",
        style: {
          tableLayout: "fixed",
          width: `${totalWidth}px`,
          minWidth: `${totalWidth}px`,
        },
      },
      // colgroup: must match the exact cell count in RecordsTableHeader and
      // RelationRecordInList — leading empty cell + N property cells + actions cell.
      React.createElement(
        "colgroup",
        null,
        React.createElement("col", { key: "__leading", style: { width: "0px" } }),
        displayedProperties.map((p) =>
          React.createElement("col", {
            key: p.name,
            style: { width: `${p.width || DEFAULT_COLUMN_WIDTH}px` },
          })
        ),
        React.createElement("col", { key: "__actions", style: { width: "80px" } })
      ),
      React.createElement(RecordsTableHeader, {
        properties: resourceForHeader.listProperties,
        titleProperty: resourceForHeader.titleProperty,
        direction,
        sortBy,
      }),
      React.createElement(
        TableBody,
        { "data-css": "relations-table-body" },
        records.map((record) =>
          React.createElement(RelationRecordInList, {
            key: record.id,
            record,
            resource: targetResource,
            isLoading,
            properties: displayedProperties,
          })
        )
      )
    )
  );
};
