import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { AppRootProps } from '@grafana/data';
import { ROUTES } from '../../constants';
const PageOne = React.lazy(() => import('../../pages/PageOne'));
const PageTwo = React.lazy(() => import('../../pages/PageTwo'));
const MultiCloud = React.lazy(() => import('../../pages/MultiCloud'));
const GraphTransform = React.lazy(() => import('../../pages/GraphTransforms'))


function App(props: AppRootProps) {
  return (
    <Routes>

      <Route path={ROUTES.Unused} element={<PageOne />} />
      <Route path={ROUTES.PageTwo} element={<PageTwo />} />
      <Route path={ROUTES.MultiCloud} element={<MultiCloud />} />
      <Route path={ROUTES.GraphTransform} element={<GraphTransform />} />

    </Routes>
  );
}

export default App;
