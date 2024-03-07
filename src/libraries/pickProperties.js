export function pickProperties(source, ...properties) {
    return properties.reduce((target, property) => {
      target[property] = source[property];
      return target;
    }, {});
  }