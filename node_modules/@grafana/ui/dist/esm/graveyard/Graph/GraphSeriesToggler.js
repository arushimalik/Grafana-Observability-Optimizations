import { isEqual, difference } from 'lodash';
import { Component } from 'react';

var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
class GraphSeriesToggler extends Component {
  constructor(props) {
    super(props);
    this.onSeriesToggle = this.onSeriesToggle.bind(this);
    this.state = {
      hiddenSeries: [],
      toggledSeries: props.series
    };
  }
  componentDidUpdate(prevProps) {
    const { series } = this.props;
    if (!isEqual(prevProps.series, series)) {
      this.setState({ hiddenSeries: [], toggledSeries: series });
    }
  }
  onSeriesToggle(label, event) {
    const { series, onHiddenSeriesChanged } = this.props;
    const { hiddenSeries } = this.state;
    if (event.ctrlKey || event.metaKey || event.shiftKey) {
      const newHiddenSeries2 = hiddenSeries.indexOf(label) > -1 ? hiddenSeries.filter((series2) => series2 !== label) : hiddenSeries.concat([label]);
      const toggledSeries2 = series.map((series2) => __spreadProps(__spreadValues({}, series2), {
        isVisible: newHiddenSeries2.indexOf(series2.label) === -1
      }));
      this.setState(
        { hiddenSeries: newHiddenSeries2, toggledSeries: toggledSeries2 },
        () => onHiddenSeriesChanged ? onHiddenSeriesChanged(newHiddenSeries2) : void 0
      );
      return;
    }
    const allSeriesLabels = series.map((series2) => series2.label);
    const newHiddenSeries = hiddenSeries.length + 1 === allSeriesLabels.length ? [] : difference(allSeriesLabels, [label]);
    const toggledSeries = series.map((series2) => __spreadProps(__spreadValues({}, series2), {
      isVisible: newHiddenSeries.indexOf(series2.label) === -1
    }));
    this.setState(
      { hiddenSeries: newHiddenSeries, toggledSeries },
      () => onHiddenSeriesChanged ? onHiddenSeriesChanged(newHiddenSeries) : void 0
    );
  }
  render() {
    const { children } = this.props;
    const { toggledSeries } = this.state;
    return children({
      onSeriesToggle: this.onSeriesToggle,
      toggledSeries
    });
  }
}

export { GraphSeriesToggler };
//# sourceMappingURL=GraphSeriesToggler.js.map
