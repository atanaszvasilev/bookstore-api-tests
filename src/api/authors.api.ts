import { httpClient } from '../config/http.client';
import { Author } from '../types/author';

/**
 * Authors API client
 * Provides methods to interact with the Authors endpoints of the Bookstore API.
 */
class AuthorsApi {
    /** Base path for the Authors API */
    private basePath = '/Authors';

    /**
     * Fetch all authors.
     * @returns Promise resolving to an array of Author objects
     */
    getAll() {
        return httpClient.get<Author[]>(this.basePath);
    }

    /**
     * Fetch an author by their ID.
     * @param id - The ID of the author
     * @returns Promise resolving to the Author object
     */
    getById(id: number) {
        return httpClient.get<Author>(`${this.basePath}/${id}`);
    }

    /**
     * Fetch all authors for a specific book.
     * @param idBook - The ID of the book
     * @returns Promise resolving to an array of Author objects
     */
    getByBookId(idBook: number) {
        return httpClient.get<Author[]>(`${this.basePath}/authors/books/${idBook}`);
    }

    /**
     * Create a new author.
     * @param payload - Author object without the ID
     * @returns Promise resolving to the created Author
     */
    create(payload: Omit<Author, 'id'>) {
        return httpClient.post<Author>(this.basePath, payload);
    }

    /**
     * Update an existing author.
     * @param id - The ID of the author to update
     * @param payload - Partial author object (excluding ID)
     * @returns Promise resolving to the updated Author
     */
    update(id: number, payload: Partial<Omit<Author, 'id'>>) {
        return httpClient.put<Author>(`${this.basePath}/${id}`, payload);
    }

    /**
     * Delete an author by ID.
     * @param id - The ID of the author to delete
     * @returns Promise resolving to the delete response
     */
    delete(id: number) {
        return httpClient.delete(`${this.basePath}/${id}`);
    }
}

/** Singleton instance for use across the project */
export const authorsApi = new AuthorsApi();