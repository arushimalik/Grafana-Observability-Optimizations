import memoize from 'micro-memoize';

function stylesFactory(stylesCreator) {
  return memoize(stylesCreator);
}

export { stylesFactory };
//# sourceMappingURL=stylesFactory.js.map
