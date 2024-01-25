export type Message<Subject> = {
  type: "extensionMessage";
  subject: Subject;
};

export type PayloadMessage<
  Subject extends keyof PayloadMap,
  PayloadMap extends Record<string, unknown> = undefined
> = Subject extends keyof PayloadMap
  ? {
      payload: PayloadMap[Subject];
    } & Message<Subject>
  : never;

export type Payload<M> = M extends PayloadMessage<infer _, infer _> ? M["payload"] : undefined;

export function isExtensionMessage(message: Message<unknown>) {
  return message.type === "extensionMessage" && message.subject !== undefined;
}
