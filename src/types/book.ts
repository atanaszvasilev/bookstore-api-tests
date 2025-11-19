/**
 * Represents a book in the bookstore.
 */
export interface Book {
    id: number;
    title: string;
    description: string;
    pageCount: number;
    excerpt?: string;
    publishDate: string;
}