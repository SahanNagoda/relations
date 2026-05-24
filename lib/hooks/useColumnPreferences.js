import { useState, useEffect } from "react";

const EMPTY_PREFS = { columnOrder: [], columnWidths: {}, hiddenColumns: [] };

/**
 * Read-only hook that fetches column preferences for a given resource from
 * the demo app's /api/column-preferences endpoint.
 *
 * @param {string|undefined} resourceId
 * @returns {{ preferences: object, loaded: boolean }}
 */
export const useColumnPreferences = (resourceId) => {
  const [preferences, setPreferences] = useState(EMPTY_PREFS);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!resourceId) {
      setLoaded(true);
      return;
    }
    setLoaded(false);
    setPreferences(EMPTY_PREFS);
    fetch(`/api/column-preferences/${encodeURIComponent(resourceId)}`, {
      credentials: "include",
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d) {
          setPreferences({
            columnOrder: d.columnOrder || [],
            columnWidths: d.columnWidths || {},
            hiddenColumns: d.hiddenColumns || [],
          });
        }
      })
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, [resourceId]);

  return { preferences, loaded };
};
