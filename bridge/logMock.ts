interface LogMockOptions {
  color: string;
  description: string;
}

export function logMock(mockName: string, options: LogMockOptions) {
  console.log(
    `%c[mswjs-devtools] ${mockName} ${options.description}`,
    `color:${options.color};font-weight:bold;`
  );
}
