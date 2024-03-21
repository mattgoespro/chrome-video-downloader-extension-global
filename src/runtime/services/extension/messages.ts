import { Message, PayloadMessage } from "shared/message";

export type ExtensionErrorMessage = PayloadMessage<"extensionError", { extensionError: Error }>;

type PayloadMap = {
  examplePayloadMessage: null;
  logMessage: {
    message: string;
    args: unknown[];
  };
};

export type ExampleMessage = Message<"exampleMessage">;

export type ExamplePayloadMessage = PayloadMessage<"examplePayloadMessage", PayloadMap>;

export type LogMessage = PayloadMessage<"logMessage", PayloadMap>;

export type ExtensionMessage = ExamplePayloadMessage | LogMessage;
