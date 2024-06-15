import React, { createContext, useContext } from "react";
import { useState } from "react";
import { useCallback } from "react";
export const RelationConfigProvider = ({ children: a, ...b }) => {
  const [c, d] = useState(0),
    e = useCallback(() => {
      d(new Date().getTime());
    }, []);
  return /*#__PURE__*/ React.createElement(
    OwnerRecordContext.Provider,
    { value: { ...b, refreshToken: c, refresh: e } },
    a
  );
};
const OwnerRecordContext = /*#__PURE__*/ createContext(null);
export const useRelationConfig = () => {
  const a = useContext(OwnerRecordContext);
  if (!a)
    throw new Error("useRelationConfig used outside of RelationConfigProvider");
  return a;
};
