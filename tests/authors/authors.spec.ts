import { authorsApi } from '../../src/api/authors.api';
import { Author } from '../../src/types/author';

let firstAuthor: Author;
let createdAuthors: Author[] = [];

const firstAuthorPayload = {
    idBook: 1,
    firstName: 'First Test Author',
    lastName: 'Last Test Author',
};

const secondAuthorPayload = {
    idBook: 1,
    firstName: 'Second Test Author',
    lastName: 'Last Test Author 2',
};

beforeAll(async () => {
    const response = await authorsApi.create(firstAuthorPayload);
    firstAuthor = response.data;
    createdAuthors.push(firstAuthor);
});

afterAll(async () => {
    for (const author of createdAuthors) {
        await authorsApi.delete(author.id!);
    }
});

describe('Authors API Tests', () => {

    it('should create a second author', async () => {
        const response = await authorsApi.create(secondAuthorPayload);
        const secondAuthor = response.data;
        createdAuthors.push(secondAuthor);
        expect(secondAuthor).toMatchObject(secondAuthorPayload);
    });

    it('should fetch all authors', async () => {
        const response = await authorsApi.getAll();
        expect(response.data.length).toBeGreaterThan(0);
    });

    it('should fetch author by ID with correct properties', async () => {
        const response = await authorsApi.getById(1);
        expect(response.data).toHaveProperty('id', 1);
        expect(response.data).toHaveProperty('idBook');
        expect(response.data).toHaveProperty('firstName');
        expect(response.data).toHaveProperty('lastName');
    });

    it('should fetch authors by book ID', async () => {
        const response = await authorsApi.getByBookId(1);
        expect(Array.isArray(response.data)).toBe(true);
        expect(response.data.length).toBeGreaterThan(0);

        for (const author of response.data) {
            expect(author.idBook).toBe(1);
            expect(author).toHaveProperty('firstName');
            expect(author).toHaveProperty('lastName');
        }
    });

    it('should return empty array for book ID with no authors', async () => {
        const response = await authorsApi.getByBookId(999999);
        expect(Array.isArray(response.data)).toBe(true);
        expect(response.data.length).toBe(0);
    });

    it('should return 404 for non-existing author', async () => {
        try {
            await authorsApi.getById(999999);
        } catch (error: any) {
            expect(error.response.status).toBe(404);
        }
    });

    it('should update an existing author', async () => {
        const updatedData = { ...firstAuthorPayload, firstName: 'Updated Author' };
        const response = await authorsApi.update(firstAuthor.id!, updatedData);
        firstAuthor = response.data;
        expect(firstAuthor).toMatchObject(updatedData);
    });

    it('should fail to update non-existing author', async () => {
        try {
            await authorsApi.update(999999, { firstName: 'Fail Update' });
        } catch (error: any) {
            expect(error.response.status).toBe(404);
        }
    });

    it('should delete an existing author', async () => {
        await authorsApi.delete(firstAuthor.id!);
    });

    it('should fail to delete non-existing author', async () => {
        try {
            await authorsApi.delete(999999);
        } catch (error: any) {
            expect(error.response.status).toBe(404);
        }
    });
});