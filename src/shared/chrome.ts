export type EventCallbackArguments<T> =
  T extends chrome.events.Event<infer EventFnParams>
    ? EventFnParams extends (...args: infer Args) => unknown
      ? Args
      : never
    : never;
