import { booksApi } from '../../src/api/books.api';
import { Book } from '../../src/types/book';

let firstBook: Book;
let createdBooks: Book[] = [];

const firstBookPayload = {
    title: 'The First Test Book',
    description: 'Description for the first test book',
    pageCount: 120,
    excerpt: 'Excerpt for the first test book',
    publishDate: new Date().toISOString(),
};

const secondBookPayload = {
    title: 'The Second Test Book',
    description: 'Description for the second test book',
    pageCount: 240,
    excerpt: 'Excerpt for the second test book',
    publishDate: new Date().toISOString(),
};

beforeAll(async () => {
    const response = await booksApi.create(firstBookPayload);
    firstBook = response.data;
    createdBooks.push(firstBook);
});

afterAll(async () => {
    for (const book of createdBooks) {
        await booksApi.delete(book.id!);
    }
});

describe('Books API', () => {

    it('should create a second book successfully', async () => {
        const response = await booksApi.create(secondBookPayload);
        const secondBook = response.data;
        createdBooks.push(secondBook);
        expect(secondBook).toMatchObject(secondBookPayload);
    });

    it('should fetch all books', async () => {
        const response = await booksApi.getAll();
        expect(response.data.length).toBeGreaterThan(0);
    });

    it('should fetch a book by ID with correct properties', async () => {
        const response = await booksApi.getById(1);
        const book = response.data;

        expect(book).toHaveProperty('id', 1);
        expect(book).toHaveProperty('title');
        expect(book).toHaveProperty('description');
        expect(book).toHaveProperty('pageCount');
        expect(book).toHaveProperty('excerpt');
        expect(book).toHaveProperty('publishDate');
    });

    it('should return 404 for a non-existing book', async () => {
        try {
            await booksApi.getById(999999);
        } catch (error: any) {
            expect(error.response.status).toBe(404);
        }
    });

    it('should update an existing book successfully', async () => {
        const updatedData = { ...firstBookPayload, title: 'Updated First Test Book' };
        const response = await booksApi.update(firstBook.id!, updatedData);
        firstBook = response.data;
        expect(firstBook).toMatchObject(updatedData);
    });

    it('should return 404 when updating a non-existing book', async () => {
        try {
            await booksApi.update(999999, { title: 'Fail Update' });
        } catch (error: any) {
            expect(error.response.status).toBe(404);
        }
    });

    it('should delete an existing book', async () => {
        await booksApi.delete(firstBook.id!);
    });

    it('should return 404 when deleting a non-existing book', async () => {
        try {
            await booksApi.delete(999999);
        } catch (error: any) {
            expect(error.response.status).toBe(404);
        }
    });
});