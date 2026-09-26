import { Box, Table, TableBody } from "@adminjs/design-system";
import { RecordsTableHeader, useQueryParams } from "adminjs";
import React from "react";
import { useRelationConfig } from "../../providers/RelationConfigProvider.js";
import { useColumnPreferences } from "../../hooks/useColumnPreferences.js";
import {
  applyColumnPreferences,
  joinKeysOf,
  withoutOwnerJoinColumns,
} from "../../utils/column-preferences.js";
import { RelationNoRecords } from "./RelationNoRecords.js";
import { RelationRecordInList } from "./RelationRecordInList.js";

const DEFAULT_COLUMN_WIDTH = 150;
// Each icon action button is ~32px plus spacing; the cell adds horizontal padding.
const ACTION_BUTTON_WIDTH = 40;
const ACTIONS_CELL_PADDING = 32;
const MIN_ACTIONS_WIDTH = 80;

export const RelationRecordsTable = (props) => {
  const { targetResource, records, isLoading } = props;
  const { ownerResource, relations, relation } = useRelationConfig();
  const { direction, sortBy } = useQueryParams();

  const { preferences, loaded } = useColumnPreferences(targetResource?.id);
  const joinKeys = joinKeysOf(relations?.[relation]?.target);
  const ownerColumnOpts = { ownerResourceId: ownerResource.id, joinKeys };

  if (!records.length && !isLoading) {
    return React.createElement(RelationNoRecords, { resource: targetResource });
  }

  // Build the displayed properties respecting column preferences.
  // Fall back to listProperties (minus the owner join columns) when prefs are
  // empty so the table is never blank on first render.
  let displayedProperties;
  if (loaded) {
    const derived = applyColumnPreferences(
      targetResource,
      preferences,
      ownerColumnOpts
    );
    displayedProperties =
      derived.length > 0
        ? derived
        : withoutOwnerJoinColumns(targetResource.listProperties, ownerColumnOpts);
  } else {
    displayedProperties = withoutOwnerJoinColumns(
      targetResource.listProperties,
      ownerColumnOpts
    );
  }

  // Build a resource-like object for RecordsTableHeader (it expects listProperties)
  const resourceForHeader = {
    ...targetResource,
    listProperties: displayedProperties,
  };

  // Size the actions column to fit the widest row's buttons so they don't
  // overflow into the neighbouring cell.
  const maxActions = records.reduce(
    (max, r) => Math.max(max, r.recordActions?.length || 0),
    0
  );
  const actionsWidth = Math.max(
    MIN_ACTIONS_WIDTH,
    maxActions * ACTION_BUTTON_WIDTH + ACTIONS_CELL_PADDING
  );

  // Total min-width: sum of property columns + the actions col.
  const totalWidth = displayedProperties.reduce(
    (sum, p) => sum + (p.width || DEFAULT_COLUMN_WIDTH),
    actionsWidth
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
        React.createElement("col", {
          key: "__actions",
          style: { width: `${actionsWidth}px` },
        })
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
