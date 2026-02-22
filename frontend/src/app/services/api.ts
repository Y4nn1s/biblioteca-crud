import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Autor, Categoria, Libro, Miembro, Prestamo } from '../models/interfaces';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private http = inject(HttpClient);
  private apiUrl = '/api'; // Será resuelto por proxy.conf.json hacia localhost:3000/api

  // === Autores ===
  getAutores(): Observable<Autor[]> { return this.http.get<Autor[]>(`${this.apiUrl}/autores`); }
  getAutor(id: string): Observable<Autor> { return this.http.get<Autor>(`${this.apiUrl}/autores/${id}`); }
  createAutor(autor: Autor): Observable<Autor> { return this.http.post<Autor>(`${this.apiUrl}/autores`, autor); }
  updateAutor(id: string, autor: Autor): Observable<Autor> { return this.http.put<Autor>(`${this.apiUrl}/autores/${id}`, autor); }
  deleteAutor(id: string): Observable<any> { return this.http.delete(`${this.apiUrl}/autores/${id}`); }

  // === Categorías ===
  getCategorias(): Observable<Categoria[]> { return this.http.get<Categoria[]>(`${this.apiUrl}/categorias`); }
  getCategoria(id: string): Observable<Categoria> { return this.http.get<Categoria>(`${this.apiUrl}/categorias/${id}`); }
  createCategoria(cat: Categoria): Observable<Categoria> { return this.http.post<Categoria>(`${this.apiUrl}/categorias`, cat); }
  updateCategoria(id: string, cat: Categoria): Observable<Categoria> { return this.http.put<Categoria>(`${this.apiUrl}/categorias/${id}`, cat); }
  deleteCategoria(id: string): Observable<any> { return this.http.delete(`${this.apiUrl}/categorias/${id}`); }

  // === Libros ===
  getLibros(): Observable<Libro[]> { return this.http.get<Libro[]>(`${this.apiUrl}/libros`); }
  getLibro(id: string): Observable<Libro> { return this.http.get<Libro>(`${this.apiUrl}/libros/${id}`); }
  createLibro(libro: Libro): Observable<Libro> { return this.http.post<Libro>(`${this.apiUrl}/libros`, libro); }
  updateLibro(id: string, libro: Libro): Observable<Libro> { return this.http.put<Libro>(`${this.apiUrl}/libros/${id}`, libro); }
  deleteLibro(id: string): Observable<any> { return this.http.delete(`${this.apiUrl}/libros/${id}`); }

  // === Miembros ===
  getMiembros(): Observable<Miembro[]> { return this.http.get<Miembro[]>(`${this.apiUrl}/miembros`); }
  getMiembro(id: string): Observable<Miembro> { return this.http.get<Miembro>(`${this.apiUrl}/miembros/${id}`); }
  createMiembro(miembro: Miembro): Observable<Miembro> { return this.http.post<Miembro>(`${this.apiUrl}/miembros`, miembro); }
  updateMiembro(id: string, miembro: Miembro): Observable<Miembro> { return this.http.put<Miembro>(`${this.apiUrl}/miembros/${id}`, miembro); }
  deleteMiembro(id: string): Observable<any> { return this.http.delete(`${this.apiUrl}/miembros/${id}`); }

  // === Préstamos ===
  getPrestamos(): Observable<Prestamo[]> { return this.http.get<Prestamo[]>(`${this.apiUrl}/prestamos`); }
  getPrestamo(id: string): Observable<Prestamo> { return this.http.get<Prestamo>(`${this.apiUrl}/prestamos/${id}`); }
  createPrestamo(prestamo: Prestamo): Observable<Prestamo> { return this.http.post<Prestamo>(`${this.apiUrl}/prestamos`, prestamo); }
  updatePrestamo(id: string, prestamo: Prestamo): Observable<Prestamo> { return this.http.put<Prestamo>(`${this.apiUrl}/prestamos/${id}`, prestamo); }
  deletePrestamo(id: string): Observable<any> { return this.http.delete(`${this.apiUrl}/prestamos/${id}`); }
}
