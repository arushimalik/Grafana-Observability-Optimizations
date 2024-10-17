import { Component } from 'react';

var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
class PopoverController extends Component {
  constructor() {
    super(...arguments);
    __publicField(this, "hideTimeout", null);
    __publicField(this, "state", { show: false });
    __publicField(this, "showPopper", () => {
      if (this.hideTimeout) {
        clearTimeout(this.hideTimeout);
      }
      this.setState({ show: true });
    });
    __publicField(this, "hidePopper", () => {
      this.hideTimeout = setTimeout(() => {
        this.setState({ show: false });
      }, this.props.hideAfter);
    });
  }
  render() {
    const { children, content, placement = "auto" } = this.props;
    const { show } = this.state;
    return children(this.showPopper, this.hidePopper, {
      show,
      placement,
      content
    });
  }
}

export { PopoverController };
//# sourceMappingURL=PopoverController.js.map
