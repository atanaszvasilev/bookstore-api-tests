import { authorsApi } from '../../src/api/authors.api';
import { trackTestStatus } from '../../src/utils/test.utils';

const firstAuthorPayload = {
    id: 1,
    idBook: 1,
    firstName: 'First Name 1',
    lastName: 'Last Name 1',
};

const newAuthorPayload = {
    id: 600,
    idBook: 201,
    firstName: 'New Test Author',
    lastName: 'New Test Author',
};

const longString = "lorem".repeat(5000);

describe('Authors API Tests:', () => {

    // ------------------------------------------------------------
    // 📘 RETRIEVE (GET) TESTS
    // ------------------------------------------------------------

    test('retrieves all authors with correct schema', trackTestStatus(async () => {
        const response = await authorsApi.getAll();
        for (const author of response.data) {
            expect(author).toHaveProperty('id');
            expect(author).toHaveProperty('idBook');
            expect(author).toHaveProperty('firstName');
            expect(author).toHaveProperty('lastName');
        }
    }));

    test('retrieves all authors successfully', trackTestStatus(async () => {
        const response = await authorsApi.getAll();
        expect(response.status).toBe(200);
        expect(Array.isArray(response.data)).toBe(true);
    }));

    test('retrieves author by ID successfully', trackTestStatus(async () => {
        const response = await authorsApi.create(firstAuthorPayload);
        expect(response.data).toMatchObject(firstAuthorPayload);
    }));

    test('retrieves non-existing author ID returns 404', trackTestStatus(async () => {
        const response = await authorsApi.getById(999999);
        expect(response.status).toBe(404);
        expect(response.statusText).toBe('Not Found');
    }));

    test('retrieves author using non-numeric ID returns 400', trackTestStatus(async () => {
        const response = await authorsApi.getById("abc" as any);
        expect(response.status).toBe(400);
        expect(response.statusText).toBe('Bad Request');
    }));

    test('retrieves author using negative ID returns 404', trackTestStatus(async () => {
        const response = await authorsApi.getById(-10);
        expect(response.status).toBe(404);
        expect(response.statusText).toBe('Not Found');
    }));

    test('retrieves author using float ID returns 400', trackTestStatus(async () => {
        const response = await authorsApi.getById(1.7 as any);
        expect(response.status).toBe(400);
        expect(response.statusText).toBe('Bad Request');
    }));

    // ------------------------------------------------------------
    // 📗 CREATE (POST) TESTS
    // ------------------------------------------------------------

    test('creates author successfully', trackTestStatus(async () => {
        const response = await authorsApi.create(newAuthorPayload);
        expect(response.data).toMatchObject(newAuthorPayload);
    }));

    test('creates author with missing firstName returns error', trackTestStatus(async () => {
        const response = await authorsApi.create({ ...newAuthorPayload, firstName: '' });
        expect(response.status).not.toBe(200);
    }));

    test('creates author with missing lastName returns error', trackTestStatus(async () => {
        const response = await authorsApi.create({ ...newAuthorPayload, lastName: '' });
        expect(response.status).not.toBe(200);
    }));

    test('creates author with missing idBook returns error', trackTestStatus(async () => {
        const response = await authorsApi.create({ firstName: "Test", lastName: "User" } as any);
        expect(response.status).not.toBe(200);
    }));

    test('creates author with extremely long fields returns error', trackTestStatus(async () => {
        const response = await authorsApi.create({
            ...firstAuthorPayload,
            firstName: longString,
            lastName: longString
        });
        expect(response.status).not.toBe(200);
    }));

    test('creates author with unexpected extra fields returns error', trackTestStatus(async () => {
        const response = await authorsApi.create({
            ...firstAuthorPayload,
            extra: "unexpected"
        } as any);
        expect(response.status).not.toBe(200);
    }));

    test('creates author with empty payload returns error', trackTestStatus(async () => {
        const response = await authorsApi.create({} as any);
        expect(response.status).not.toBe(200);
    }));

    // ------------------------------------------------------------
    // 📙 UPDATE (PUT) TESTS
    // ------------------------------------------------------------

    test('updates author successfully', trackTestStatus(async () => {
        const updated = {
            ...firstAuthorPayload,
            firstName: 'UpdatedName'
        };
        const response = await authorsApi.update(firstAuthorPayload.id, updated);
        expect(response.data.firstName).toBe('UpdatedName');
    }));

    test('updates non-existing author returns 404', trackTestStatus(async () => {
        const response = await authorsApi.update(999999, { firstName: 'Fail' });
        expect(response.status).toBe(404);
        expect(response.statusText).toBe('Not Found');
    }));

    test('updates author using invalid idBook returns error', trackTestStatus(async () => {
        const response = await authorsApi.update(firstAuthorPayload.id, { idBook: "wrong" } as any);
        expect(response.status).not.toBe(200);
    }));

    test('updates author using empty payload returns error', trackTestStatus(async () => {
        const response = await authorsApi.update(firstAuthorPayload.id, {});
        expect(response.status).not.toBe(200);
    }));

    // ------------------------------------------------------------
    // 📕 DELETE TESTS
    // ------------------------------------------------------------

    test('deletes author successfully', trackTestStatus(async () => {
        const response = await authorsApi.delete(firstAuthorPayload.id);
        expect(response.status).toBe(200);
    }));

    test('deletes non-existing author returns 404', trackTestStatus(async () => {
        const response = await authorsApi.delete(999999);
        expect(response.status).toBe(404);
        expect(response.statusText).toBe('Not Found');
    }));
});
