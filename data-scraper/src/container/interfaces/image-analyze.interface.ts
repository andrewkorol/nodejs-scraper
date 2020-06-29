export interface IImageAnalyzeQueue {
    fire(): void;
    test(url): void;
}