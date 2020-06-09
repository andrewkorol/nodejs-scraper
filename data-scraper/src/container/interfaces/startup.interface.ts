export interface IStartup {
    start(): Promise<void>;
}