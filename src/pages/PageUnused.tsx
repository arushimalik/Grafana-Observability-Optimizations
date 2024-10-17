import React from 'react';
import { testIds } from '../components/testIds';
import { PluginPage } from '@grafana/runtime';

function PageUnused() {
  return (
    <PluginPage>
      <div data-testid={testIds.pageUnused.container}>
        <p>This is unused metrics page.</p>
      </div>
    </PluginPage>
  );
}

export default PageUnused;
