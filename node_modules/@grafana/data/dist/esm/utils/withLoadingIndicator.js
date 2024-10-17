import { merge, timer } from 'rxjs';
import { mapTo, takeUntil } from 'rxjs/operators';

function withLoadingIndicator({ whileLoading, source }) {
  return merge(timer(200).pipe(mapTo(whileLoading), takeUntil(source)), source);
}

export { withLoadingIndicator };
//# sourceMappingURL=withLoadingIndicator.js.map
