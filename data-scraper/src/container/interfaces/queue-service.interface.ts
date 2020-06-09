export interface IQueueService {
    produse(messages): Promise<void>
    consume(handler): Promise<void>
}
