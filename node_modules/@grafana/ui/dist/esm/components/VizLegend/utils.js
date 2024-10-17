import { SeriesVisibilityChangeMode } from '../PanelChrome/types.js';

function mapMouseEventToMode(event) {
  if (event.ctrlKey || event.metaKey || event.shiftKey) {
    return SeriesVisibilityChangeMode.AppendToSelection;
  }
  return SeriesVisibilityChangeMode.ToggleSelection;
}

export { mapMouseEventToMode };
//# sourceMappingURL=utils.js.map
