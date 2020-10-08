import React from "react";

export const RenderLoader = () => {
  return (
    <div className="col-12 loadingSpinner">
      <span className="fa fa-spinner fa-pulse fa-3x fa-fw text-primary"></span>
      <b>
        <p>Loading . . .</p>
      </b>
    </div>
  );
};
