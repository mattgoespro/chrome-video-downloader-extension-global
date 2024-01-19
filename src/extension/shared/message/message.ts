export type Message<
  PayloadMap extends Record<string, unknown> = Record<string, unknown>,
  Subject extends keyof PayloadMap = keyof PayloadMap
> = {
  type: "extensionMessage";
  subject: Subject;
  payload: PayloadMap[Subject];
};

export type MessagePayload<M> = M extends Message<infer PayloadMap, infer Subject>
  ? PayloadMap[Subject]
  : never;

export function isExtensionMessage<M extends Message>(message: M) {
  return message.type === "extensionMessage" && message.subject !== undefined;
}
