export default class ComponentSet {
  #count;

  #indices;
  #entityIds;
  #components;

  constructor(capacity) {
    this.#indices = new Array(capacity + 1);
    this.#entityIds = new Array(capacity + 1);
    this.#components = new Array(capacity + 1);
    this.#count = 0;
  }

  clear() {
    this.#count = 0;
  }

  has(entityId) {
    const index = this.#indices[entityId];
    return index < this.#count && this.#entityIds[index] === entityId;
  }

  add(entityId, component) {
    if (this.has(entityId)) return;
    this.#indices[entityId] = this.#count;
    this.#entityIds[this.#count] = entityId;
    this.#components[this.#count] = component;
    this.#count++;
  }

  remove(entityId) {
    if (!this.has(entityId)) return;
    this.#count--;
    const index = this.#indices[entityId];
    const lastEntityId = this.#entityIds[this.#count];
    const lastComponent = this.#components[this.#count];
    this.#entityIds[index] = lastEntityId;
    this.#components[index] = lastComponent;
    this.#indices[lastEntityId] = index;
  }

  get(entityId) {
    return this.#components[this.#indices[entityId]];
  }
}