import { SQSEvent } from 'aws-lambda'

export function sqsEventNormalizer<T = any>(event: SQSEvent, parseInternalMessage = false): T {
    const firstRecordIndex = 0
    const normalizedBody = JSON.parse(event.Records[firstRecordIndex].body)
    return parseInternalMessage ? JSON.parse(normalizedBody.Message) : normalizedBody
}