import { isEqual } from 'lodash';
import { PureComponent } from 'react';
import { Subject, of, NEVER, interval } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { stringToMs } from '@grafana/data';
import { RefreshPicker } from '../RefreshPicker/RefreshPicker.js';

var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
class SetInterval extends PureComponent {
  constructor(props) {
    super(props);
    __publicField(this, "propsSubject");
    __publicField(this, "subscription");
    this.propsSubject = new Subject();
    this.subscription = null;
  }
  componentDidMount() {
    this.subscription = this.propsSubject.pipe(
      // switchMap creates a new observables based on the input stream,
      // which becomes part of the propsSubject stream
      switchMap((props) => {
        if (RefreshPicker.isLive(props.interval)) {
          return of({});
        }
        return props.loading ? NEVER : interval(stringToMs(props.interval));
      }),
      // tap will execute function passed via func prop
      // * on value from `of` stream merged if query is live
      // * on specified interval (triggered by values emitted by interval)
      tap(() => this.props.func())
    ).subscribe();
    this.propsSubject.next(this.props);
  }
  componentDidUpdate(prevProps) {
    if (RefreshPicker.isLive(prevProps.interval) && RefreshPicker.isLive(this.props.interval) || isEqual(prevProps, this.props)) {
      return;
    }
    this.propsSubject.next(this.props);
  }
  componentWillUnmount() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    this.propsSubject.unsubscribe();
  }
  render() {
    return null;
  }
}

export { SetInterval };
//# sourceMappingURL=SetInterval.js.map
