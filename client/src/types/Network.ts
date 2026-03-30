export interface INetworkAction<TInput> {
  update(input: TInput): void;
}
