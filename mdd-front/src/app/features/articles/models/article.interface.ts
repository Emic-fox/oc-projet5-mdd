export interface Article {
    id: number,
    title: string,
    content: string,
    createdAt: Date,
    topic: {
        id: number,
        name: string
    },
    author: {
        id: number,
        username: string
    }
}