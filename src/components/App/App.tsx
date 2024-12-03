import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { AppRootProps } from '@grafana/data';
import { ROUTES } from '../../constants';
const PageOne = React.lazy(() => import('../../pages/PageOne'));


function App(props: AppRootProps) {
  return (
    <Routes>

      <Route path={ROUTES.Unused} element={<PageOne />} />

    </Routes>
  );
}

export default App;
