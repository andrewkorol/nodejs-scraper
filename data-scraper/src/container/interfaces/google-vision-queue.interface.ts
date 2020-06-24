export interface IGoogleVision {
    analyze(imageUrl: string): Promise<Array<string>>;
}