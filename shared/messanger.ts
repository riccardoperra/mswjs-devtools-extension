export type EventMap<EventType extends PropertyKey> = Record<
  EventType,
  unknown
>;

export type EventSource = "bridge" | "content-script" | "devtools";

export type GenericMessage<
  TMessageMap extends EventMap<string>,
  Source extends string = EventSource
> = Message<TMessageMap, keyof TMessageMap, Source>;

export type Message<
  TMessageMap extends EventMap<PropertyKey>,
  TMessageType extends keyof TMessageMap,
  Source extends string = EventSource
> = {
  type: TMessageType;
  payload: TMessageMap[TMessageType];
  source: `mswjs-${Source}`;
  receiver?: EventSource;
};

type CleanupCallback = () => void;

type ListenerConnectorCallback<TEventMap extends EventMap<string>> = (
  connectorFn: (event: GenericMessage<TEventMap>) => void,
  sender: EventSource | "default"
) => CleanupCallback;

type SendMessageConnectorCallback<TEventMap extends EventMap<string>> = <
  TEventType extends keyof TEventMap
>(
  data: Message<TEventMap, TEventType>
) => void;

type ListenerByTypeCallback<
  TEventMap extends EventMap<string>,
  TEventType extends keyof TEventMap,
  TMessage extends Message<
    TEventMap,
    TEventType extends "*" ? keyof TEventMap : TEventType
  >
> = (payload: TMessage) => undefined | void | (() => void);

class Observer<T> {
  #cleanupCallback: () => void = () => {};

  constructor(
    private readonly observerCallback: (
      next: T
    ) => undefined | void | (() => void)
  ) {}

  next(payload: T) {
    this.#cleanupCallback = this.observerCallback(payload) ?? (() => void 0);
  }

  unsubscribe() {
    this.#cleanupCallback();
  }
}

export function createMessenger<TEventMap extends EventMap<string>>(
  sendMessageConnector: SendMessageConnectorCallback<TEventMap>,
  listenerConnector: ListenerConnectorCallback<TEventMap>,
  source: EventSource
): Messanger<TEventMap, EventSource> {
  type TGenericMessage = GenericMessage<TEventMap>;
  const map = {
    default: new Map<keyof TEventMap, Observer<TGenericMessage>>(),
  } as Record<
    EventSource | "default",
    Map<keyof TEventMap, Observer<TGenericMessage>>
  >;

  let cleanupListenerConnector: undefined | (() => void) = undefined;

  return {
    dispatch<TEventType extends keyof TEventMap, Receiver extends EventSource>(
      type: TEventType,
      payload: TEventMap[TEventType],
      receiver?: EventSource
    ) {
      const data: Message<TEventMap, TEventType> = {
        type,
        payload,
        source: `mswjs-${source}`,
        receiver,
      };
      sendMessageConnector(data);
    },
    on<
      TEventType extends keyof TEventMap,
      TMessage extends Message<
        TEventMap,
        TEventType extends "*" ? keyof TEventMap : TEventType
      >
    >(
      eventType: TEventType,
      listenerFn: ListenerByTypeCallback<TEventMap, TEventType, TMessage>,
      sender?: EventSource
    ): () => void {
      const unsafeListener = listenerFn as ListenerByTypeCallback<
        TEventMap,
        keyof TEventMap,
        any
      >;
      const observer = new Observer(unsafeListener);

      let targetObserversMap: Map<keyof TEventMap, Observer<TGenericMessage>>;
      if (!sender) {
        targetObserversMap = map.default;
      } else {
        const maybeObserverMap = map[sender];
        if (!maybeObserverMap) {
          map[sender] = new Map<keyof TEventMap, Observer<TGenericMessage>>();
        }
        targetObserversMap = maybeObserverMap ?? map[sender];
      }
      if (targetObserversMap.size === 0) {
        targetObserversMap.set(eventType, observer);
        cleanupListenerConnector = listenerConnector((event) => {
          const observers = [...targetObserversMap.entries()];
          observers.forEach(([type, observer]) => {
            if (event.type === type) {
              observer.next(event);
            }
            if (type === "*") {
              observer.next(event);
            }
          });
        }, sender ?? "default");
      } else {
        targetObserversMap.set(eventType, observer);
      }
      return () => {
        const observer = targetObserversMap.get(eventType);
        targetObserversMap.delete(eventType);
        observer?.unsubscribe?.();
        if (targetObserversMap.size === 0) {
          cleanupListenerConnector?.();
        }
      };
    },
  };
}

export interface Messanger<
  TEventMap extends EventMap<string>,
  Source extends EventSource
> {
  on<
    TEventType extends keyof TEventMap | "*",
    TMessage extends Message<
      TEventMap,
      TEventType extends "*" ? keyof TEventMap : TEventType,
      Source
    >
  >(
    eventType: TEventType,
    listenerFn: (payload: TMessage) => void,
    sender?: EventSource
  ): () => void;

  dispatch<TEventType extends keyof TEventMap, Receiver extends EventSource>(
    type: TEventType,
    message: TEventMap[TEventType],
    receiver?: Receiver
  ): void;
}
