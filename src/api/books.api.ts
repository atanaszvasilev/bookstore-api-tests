import { httpClient } from '../config/http.client';
import { Book } from '../types/book';

/**
 * Books API client
 * Provides methods to interact with the Books endpoints of the Bookstore API.
 */
export class BooksApi {
  /** Base path for the Books API */
  private basePath = '/Books';

  /**
   * Fetch all books.
   * @returns Promise resolving to an array of Book objects
   */
  getAll() {
    return httpClient.get<Book[]>(this.basePath);
  }

  /**
   * Fetch a book by its ID.
   * @param id - The ID of the book
   * @returns Promise resolving to the Book object
   */
  getById(id: number) {
    return httpClient.get<Book>(`${this.basePath}/${id}`);
  }

  /**
   * Create a new book.
   * @param payload - Partial Book object
   * @returns Promise resolving to the created Book
   */
  create(payload: Partial<Book>) {
    return httpClient.post<Book>(this.basePath, payload);
  }

  /**
   * Update an existing book.
   * @param id - The ID of the book to update
   * @param payload - Partial Book object
   * @returns Promise resolving to the updated Book
   */
  update(id: number, payload: Partial<Book>) {
    return httpClient.put<Book>(`${this.basePath}/${id}`, payload);
  }

  /**
   * Delete a book by its ID.
   * @param id - The ID of the book to delete
   * @returns Promise resolving to the delete response
   */
  delete(id: number) {
    return httpClient.delete(`${this.basePath}/${id}`);
  }
}

/** Singleton instance for use across the project */
export const booksApi = new BooksApi();