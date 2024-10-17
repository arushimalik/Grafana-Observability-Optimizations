const alwaysMonoIcons = [
  "grafana",
  "favorite",
  "heart-break",
  "heart",
  "panel-add",
  "library-panel",
  "circle-mono"
];
function getIconSubDir(name, type) {
  if (name == null ? void 0 : name.startsWith("gf-")) {
    return "custom";
  } else if (alwaysMonoIcons.includes(name)) {
    return "mono";
  } else if (type === "default") {
    return "unicons";
  } else if (type === "solid") {
    return "solid";
  } else {
    return "mono";
  }
}
function getSvgSize(size) {
  switch (size) {
    case "xs":
      return 12;
    case "sm":
      return 14;
    case "md":
      return 16;
    case "lg":
      return 18;
    case "xl":
      return 24;
    case "xxl":
      return 36;
    case "xxxl":
      return 48;
  }
}
let iconRoot;
function getIconRoot() {
  if (iconRoot) {
    return iconRoot;
  }
  const grafanaPublicPath = typeof window !== "undefined" && window.__grafana_public_path__;
  if (grafanaPublicPath) {
    iconRoot = grafanaPublicPath + "img/icons/";
  } else {
    iconRoot = "public/img/icons/";
  }
  return iconRoot;
}

export { getIconRoot, getIconSubDir, getSvgSize };
//# sourceMappingURL=utils.js.map
