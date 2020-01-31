import React from "react";
import ContentLoader from "react-content-loader";

export const BarChartLoader = () => (
  <ContentLoader
    height={300}
    width={300}
    speed={2}
    foregroundColor="orange"
    backgroundColor="#666"
  >
    <rect x="30" y="118" rx="3" ry="3" width="43" height="115" />
    <rect x="78" y="30" rx="3" ry="3" width="43" height="203" />
    <rect x="129" y="75" rx="3" ry="3" width="43" height="159" />
    <rect x="178" y="25" rx="3" ry="3" width="43" height="209" />
    <rect x="229" y="76" rx="3" ry="3" width="43" height="157" />
  </ContentLoader>
);
