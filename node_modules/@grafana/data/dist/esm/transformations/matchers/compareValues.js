import { ComparisonOperation } from '@grafana/schema';

function compareValues(left, op, right) {
  if (left == null || right == null) {
    if (left == null) {
      left = "null";
    }
    if (right == null) {
      right = "null";
    }
    if (op === ComparisonOperation.GTE || op === ComparisonOperation.LTE) {
      op = ComparisonOperation.EQ;
    }
  }
  switch (op) {
    case ComparisonOperation.EQ:
      return `${left}` === `${right}`;
    case ComparisonOperation.NEQ:
      return `${left}` !== `${right}`;
    case ComparisonOperation.GT:
      return left > right;
    case ComparisonOperation.GTE:
      return left >= right;
    case ComparisonOperation.LT:
      return left < right;
    case ComparisonOperation.LTE:
      return left <= right;
    default:
      return false;
  }
}

export { compareValues };
//# sourceMappingURL=compareValues.js.map
