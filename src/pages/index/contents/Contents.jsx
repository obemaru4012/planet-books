import React from "react";
// Contents
import Library from "@app/pages/index/contents/library/Library";
import Reader from "@app/pages/index/contents/reader/Reader";

const Contents = ({ state }) => {
  return (
    <React.Fragment>
      {state.openedBook ? (
        <Reader key={state.openedBook.id} state={state} />
      ) : (
        <Library state={state} />
      )}
    </React.Fragment>
  );
};

export default Contents;
