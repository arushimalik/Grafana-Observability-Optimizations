const linkModelToContextMenuItems = (links) => {
  return links().map((link) => {
    return {
      label: link.title,
      ariaLabel: link.title,
      // TODO: rename to href
      url: link.href,
      target: link.target,
      icon: `${link.target === "_blank" ? "external-link-alt" : "link"}`,
      onClick: link.onClick
    };
  });
};
const isCompactUrl = (url) => {
  const compactExploreUrlRegex = /\/explore\?.*&(left|right)=\[(.*\,){2,}(.*){1}\]/;
  return compactExploreUrlRegex.test(url);
};

export { isCompactUrl, linkModelToContextMenuItems };
//# sourceMappingURL=dataLinks.js.map
