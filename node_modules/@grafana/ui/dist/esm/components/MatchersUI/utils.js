import { useMemo } from 'react';
import { FieldNamePickerBaseNameMode, getFieldDisplayName } from '@grafana/data';
import { getFieldTypeIcon } from '../../types/icon.js';

function frameHasName(name, names) {
  if (!name) {
    return false;
  }
  return names.display.has(name) || names.raw.has(name);
}
function getFrameFieldsDisplayNames(data, filter) {
  const names = {
    display: /* @__PURE__ */ new Set(),
    raw: /* @__PURE__ */ new Set(),
    fields: /* @__PURE__ */ new Map()
  };
  for (const frame of data) {
    for (const field of frame.fields) {
      if (filter && !filter(field)) {
        continue;
      }
      const disp = getFieldDisplayName(field, frame, data);
      names.display.add(disp);
      names.fields.set(disp, field);
      if (field.name && disp !== field.name) {
        names.raw.add(field.name);
        names.fields.set(field.name, field);
      }
    }
  }
  return names;
}
function useFieldDisplayNames(data, filter) {
  return useMemo(() => {
    return getFrameFieldsDisplayNames(data, filter);
  }, [data, filter]);
}
function useSelectOptions(displayNames, currentName, firstItem, fieldType, baseNameMode) {
  return useMemo(() => {
    let found = false;
    const options = [];
    if (firstItem) {
      options.push(firstItem);
    }
    if (baseNameMode === FieldNamePickerBaseNameMode.OnlyBaseNames) {
      for (const name of displayNames.raw) {
        if (!found && name === currentName) {
          found = true;
        }
        options.push({
          value: name,
          label: `${name} (base field name)`
        });
      }
    } else {
      for (const name of displayNames.display) {
        if (!found && name === currentName) {
          found = true;
        }
        const field = displayNames.fields.get(name);
        if (!fieldType || fieldType === (field == null ? void 0 : field.type)) {
          options.push({
            value: name,
            label: name,
            icon: field ? getFieldTypeIcon(field) : void 0
          });
        }
      }
      if (baseNameMode !== FieldNamePickerBaseNameMode.ExcludeBaseNames) {
        for (const name of displayNames.raw) {
          if (!displayNames.display.has(name)) {
            if (!found && name === currentName) {
              found = true;
            }
            options.push({
              value: name,
              label: `${name} (base field name)`
            });
          }
        }
      }
    }
    if (currentName && !found) {
      options.push({
        value: currentName,
        label: `${currentName} (not found)`
      });
    }
    return options;
  }, [displayNames, currentName, firstItem, fieldType, baseNameMode]);
}

export { frameHasName, getFrameFieldsDisplayNames, useFieldDisplayNames, useSelectOptions };
//# sourceMappingURL=utils.js.map
