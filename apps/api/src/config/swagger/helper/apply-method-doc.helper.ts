/**
 * Documenta métodos CRUD heredados de BaseController en Swagger.
 * Al envolver el método hay que copiar la metadata de Nest (@Get, @Put, @Delete…)
 * o esas rutas dejan de aparecer en OpenAPI.
 */
function copyReflectMetadata(source: object, target: object): void {
  const keys = Reflect.getMetadataKeys(source) ?? [];
  for (const key of keys) {
    const value = Reflect.getMetadata(key, source);
    Reflect.defineMetadata(key, value, target);
  }
}

export function shadowInheritedMethod(
  prototype: object,
  methodName: string,
): PropertyDescriptor | undefined {
  const ownDescriptor = Object.getOwnPropertyDescriptor(prototype, methodName);
  if (ownDescriptor?.value && typeof ownDescriptor.value === 'function') {
    return ownDescriptor;
  }

  let parent = Object.getPrototypeOf(prototype);
  while (parent && parent !== Object.prototype) {
    const parentDescriptor = Object.getOwnPropertyDescriptor(
      parent,
      methodName,
    );
    if (
      parentDescriptor?.value &&
      typeof parentDescriptor.value === 'function'
    ) {
      const original = parentDescriptor.value as (
        this: unknown,
        ...args: unknown[]
      ) => unknown;

      const wrapped = function (this: unknown, ...args: unknown[]) {
        return original.apply(this, args);
      };

      copyReflectMetadata(original, wrapped);

      Object.defineProperty(prototype, methodName, {
        value: wrapped,
        writable: true,
        enumerable: false,
        configurable: true,
      });

      return Object.getOwnPropertyDescriptor(prototype, methodName);
    }
    parent = Object.getPrototypeOf(parent);
  }

  return undefined;
}

export function applyMethodDoc(
  prototype: object,
  methodName: string,
  decorator: MethodDecorator,
): void {
  const descriptor = shadowInheritedMethod(prototype, methodName);
  if (!descriptor) return;
  decorator(prototype, methodName, descriptor);
}
