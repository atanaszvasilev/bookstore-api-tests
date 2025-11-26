import { booksApi } from '../../src/api/books.api';
import { trackTestStatus } from '../../src/utils/test.utils';

const firstBookPayload = {
    id: 1,
    title: 'Book 1',
    description: 'Lorem lorem lorem. Lorem lorem lorem. Lorem lorem lorem.\n',
    pageCount: 100,
    excerpt: 'Lorem lorem lorem. Lorem lorem lorem. Lorem lorem lorem.\nLorem lorem lorem. Lorem lorem lorem. Lorem lorem lorem.\nLorem lorem lorem. Lorem lorem lorem. Lorem lorem lorem.\nLorem lorem lorem. Lorem lorem lorem. Lorem lorem lorem.\nLorem lorem lorem. Lorem lorem lorem. Lorem lorem lorem.\n',
};

const newBookPayload = {
    title: 'The New Test Book',
    description: 'Description for the new test book',
    pageCount: 240,
    excerpt: 'Excerpt for the new test book',
    publishDate: new Date().toISOString(),
};

const longString = "lorem".repeat(5000);

describe('Books API Tests:', () => {

    // ------------------------------------------------------------
    // 📘 RETRIEVE (GET) TESTS
    // ------------------------------------------------------------

    test('retrieves all books with correct schema', trackTestStatus(async () => {
        const response = await booksApi.getAll();
        for (const book of response.data) {
            expect(book).toHaveProperty('id');
            expect(book).toHaveProperty('title');
            expect(book).toHaveProperty('description');
            expect(book).toHaveProperty('pageCount');
            expect(book).toHaveProperty('excerpt');
            expect(book).toHaveProperty('publishDate');
        }
    }));

    test('retrieves all books successfully', async () => {
        const response = await booksApi.getAll();
        expect(response.data.length).toBe(200);
    });

    test('retrieves book by ID with all required properties', trackTestStatus(async () => {
        const response = await booksApi.getById(firstBookPayload.id);
        const book = response.data;
        expect(book).toMatchObject(firstBookPayload);
    }));

    test('retrieves non-existing book ID responds with 404', trackTestStatus(async () => {
        const response = await booksApi.getById(999999);
        expect(response.status).toBe(404);
        expect(response.statusText).toBe('Not Found');
    }));

    test('retrieves book by non-numeric ID responds with 400', trackTestStatus(async () => {
        const response = await booksApi.getById("abc" as any);
        expect(response.status).toBe(400);
        expect(response.statusText).toBe('Bad Request');
    }));

    test('retrieves book by negative ID responds with 404', trackTestStatus(async () => {
        const response = await booksApi.getById(-1);
        expect(response.status).toBe(404);
        expect(response.statusText).toBe('Not Found');
    }));

    test('retrieves book by zero ID responds with 404', trackTestStatus(async () => {
        const response = await booksApi.getById(0);
        expect(response.status).toBe(404);
        expect(response.statusText).toBe('Not Found');
    }));

    test('retrieves book by float ID responds with 400', trackTestStatus(async () => {
        const response = await booksApi.getById(1.5 as any);
        expect(response.status).toBe(400);
        expect(response.statusText).toBe('Bad Request');
    }));

    test('retrieves book by extremely large ID responds with error', trackTestStatus(async () => {
        const response = await booksApi.getById(999999999999);
        expect(response.status).not.toBe(200);
    }));

    test('retrieves all books within acceptable time', trackTestStatus(async () => {
        const start = Date.now();
        await booksApi.getAll();
        expect(Date.now() - start).toBeLessThan(1000);
    }));

    test('retrieves all books as an array structure', trackTestStatus(async () => {
        const response = await booksApi.getAll();
        expect(Array.isArray(response.data)).toBe(true);
    }));

    test('retrieves book object with no undefined fields', trackTestStatus(async () => {
        const response = await booksApi.getById(1);
        Object.values(response.data).forEach(value => {
            expect(value).not.toBeUndefined();
        });
    }));

    // ------------------------------------------------------------
    // 📗 CREATE (POST) TESTS
    // ------------------------------------------------------------

    test('creates book successfully', trackTestStatus(async () => {
        const response = await booksApi.create(newBookPayload);
        expect(response.data).toMatchObject(newBookPayload);
    }));

    test('creates book with missing title responds with error', trackTestStatus(async () => {
        const response = await booksApi.create({ ...newBookPayload, title: undefined });
        expect(response.status).not.toBe(200);
    }));

    test('creates book with negative pageCount responds with error', trackTestStatus(async () => {
        const response = await booksApi.create({ ...newBookPayload, pageCount: -10 });
        expect(response.status).not.toBe(200);
    }));

    test('creates book with invalid publishDate responds with error', trackTestStatus(async () => {
        const response = await booksApi.create({ ...newBookPayload, publishDate: "invalid-date" });
        expect(response.status).not.toBe(200);
    }));

    test('creates book with duplicate payload responds with error', trackTestStatus(async () => {
        const response = await booksApi.create(newBookPayload);
        expect(response.status).not.toBe(200);
    }));

    test('creates book without ID auto-generates ID', trackTestStatus(async () => {
        const payload = { ...firstBookPayload };
        delete (payload as any).id;
        const response = await booksApi.create(payload);
        expect(response.data.id).toBe(201);
    }));

    test('creates book with empty payload responds with error', trackTestStatus(async () => {
        const response = await booksApi.create({});
        expect(response.status).not.toBe(200);
    }));

    test('creates book with extremely long field values responds with error', trackTestStatus(async () => {
        const response = await booksApi.create({
            ...newBookPayload,
            title: longString,
            description: longString,
            excerpt: longString
        });
        expect(response.status).not.toBe(200);
    }));

    test('creates book with unexpected extra fields responds with error', trackTestStatus(async () => {
        const response = await booksApi.create({
            ...newBookPayload,
            unexpected: "value",
        } as any);
        expect(response.status).not.toBe(200);
    }));

    test('creates minimal valid book successfully', trackTestStatus(async () => {
        const response = await booksApi.create({ title: "Only Title" });
        expect([200, 201]).toContain(response.status);
    }));

    test('creates book with empty title and description responds with error', trackTestStatus(async () => {
        const response = await booksApi.create({ title: '', description: '' });
        expect(response.status).not.toBe(200);
    }));

    test('creates book with special characters in fields', trackTestStatus(async () => {
        const response = await booksApi.create({
            title: '!@#$%^&*()_+=-{}[]:;<>,.?/',
            description: 'Special chars test',
            pageCount: 100,
            excerpt: 'Special'
        });
        expect(response.status).not.toBe(500);
    }));

    test('creates book with SQL injection pattern safely', trackTestStatus(async () => {
        const response = await booksApi.create({
            title: "Robert'); DROP TABLE Books;--",
            description: 'SQLi attempt',
            pageCount: 100,
            excerpt: 'SQLi'
        });
        expect(response.status).not.toBe(500);
    }));

    test('creates book with very old publish date responds with error', trackTestStatus(async () => {
        const response = await booksApi.create({
            title: 'Ancient Book',
            description: 'Old',
            pageCount: 200,
            excerpt: 'Ancient',
            publishDate: '1500-01-01T00:00:00Z'
        });
        expect(response.status).not.toBe(200);
    }));

    test('creates book with future publish date responds with error', trackTestStatus(async () => {
        const response = await booksApi.create({
            title: 'Future Book',
            description: 'Future',
            pageCount: 200,
            excerpt: 'Future',
            publishDate: '3000-01-01T00:00:00Z'
        });
        expect(response.status).not.toBe(200);
    }));

    test('creates book with XSS payload safely', trackTestStatus(async () => {
        const response = await booksApi.create({
            title: "<script>alert('xss')</script>",
            description: "XSS test",
            pageCount: 100,
            excerpt: "xss"
        });
        expect(response.status).not.toBe(500);
    }));

    test('creates book with massive payload responds with error', trackTestStatus(async () => {
        const response = await booksApi.create({
            title: longString,
            description: 'Huge payload test',
            pageCount: 100,
            excerpt: 'Huge'
        });
        expect(response.status).not.toBe(200);
    }));

    test('creates book with float pageCount responds with error', trackTestStatus(async () => {
        const response = await booksApi.create({
            title: 'Float PageCount',
            description: 'Invalid',
            pageCount: 10.5,
            excerpt: 'Float'
        });
        expect(response.status).not.toBe(200);
    }));

    test('creates book with zero pageCount responds with error', trackTestStatus(async () => {
        const response = await booksApi.create({
            title: 'Zero PageCount',
            description: 'Zero',
            pageCount: 0,
            excerpt: 'Zero'
        });
        expect(response.status).not.toBe(200);
    }));

    // ------------------------------------------------------------
    // 📙 UPDATE (PUT) TESTS
    // ------------------------------------------------------------

    test('updates book successfully', trackTestStatus(async () => {
        const updatedData = { ...firstBookPayload, title: 'Updated First Book Title' };
        const response = await booksApi.update(firstBookPayload.id, updatedData);
        expect(response.data).toMatchObject(updatedData);
    }));

    test('updates non-existing book responds with 404', trackTestStatus(async () => {
        const response = await booksApi.update(999999, { title: 'Fail Update' });
        expect(response.status).toBe(404);
        expect(response.statusText).toBe('Not Found');
    }));

    test('updates book with empty payload responds with error', trackTestStatus(async () => {
        const response = await booksApi.update(firstBookPayload.id, {});
        expect(response.status).not.toBe(200);
    }));

    test('updates book with invalid pageCount type responds with error', trackTestStatus(async () => {
        const response = await booksApi.update(firstBookPayload.id, { pageCount: "string" } as any);
        expect(response.status).not.toBe(200);
    }));

    test('updates single field while keeping others unchanged', trackTestStatus(async () => {
        const original = await booksApi.getById(1);
        const response = await booksApi.update(1, { title: 'Updated title only' });
        expect(response.data.description).toBe(original.data.description);
        expect(response.data.pageCount).toBe(original.data.pageCount);
    }));

    test('updates book with null fields responds with error', trackTestStatus(async () => {
        const response = await booksApi.update(1, { title: null } as any);
        expect(response.status).not.toBe(200);
    }));

    test('updates book with identical payload responds successfully', trackTestStatus(async () => {
        const original = await booksApi.getById(1);
        const response = await booksApi.update(1, original.data);
        expect([200, 204]).toContain(response.status);
    }));

    // ------------------------------------------------------------
    // 📕 DELETE TESTS
    // ------------------------------------------------------------

    test('deletes existing book successfully', trackTestStatus(async () => {
        const response = await booksApi.delete(firstBookPayload.id);
        expect(response.status).toBe(200);
    }));

    test('deletes non-existing book responds with 404', trackTestStatus(async () => {
        const response = await booksApi.delete(999999);
        expect(response.status).toBe(404);
        expect(response.statusText).toBe('Not Found');
    }));

    test('deletes book twice returns 404 on second attempt', trackTestStatus(async () => {
        await booksApi.delete(20);
        const second = await booksApi.delete(20);
        expect(second.status).toBe(404);
    }));

    test('deletes book with non-numeric ID responds with 400', trackTestStatus(async () => {
        const response = await booksApi.delete('abc' as any);
        expect(response.status).toBe(400);
    }));
});