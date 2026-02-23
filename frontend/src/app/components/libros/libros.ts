import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../../services/api';
import { Libro, Autor } from '../../models/interfaces';

@Component({
  selector: 'app-libros',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
<div class="mb-6 flex justify-between items-center bg-white p-6 rounded-lg shadow cursor-default">
  <div>
      <h2 class="text-3xl font-extrabold text-gray-800">Libros</h2>
      <p class="text-gray-500 mt-1">Gestión del catálogo general de la biblioteca</p>
  </div>
  <button (click)="openModal('crear')" class="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-6 rounded-lg shadow transition">
      Nuevo Libro
  </button>
</div>

<div *ngIf="isLoading" class="flex justify-center py-20"><div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div></div>

<div *ngIf="!isLoading" class="bg-white rounded-lg shadow overflow-hidden">
  <table class="min-w-full divide-y divide-gray-200">
      <thead class="bg-gray-50">
          <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Título</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Autor</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ISBN/Año</th>
              <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acciones</th>
          </tr>
      </thead>
      <tbody class="bg-white divide-y divide-gray-200">
          <tr *ngFor="let libro of libros" class="hover:bg-indigo-50 transition">
              <td class="px-6 py-4">
                  <div class="text-sm font-bold text-gray-900">{{libro.titulo}}</div>
                  <span *ngIf="libro.disponible" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 mt-1">Disponible</span>
                  <span *ngIf="!libro.disponible" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800 mt-1">Prestado</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap"><div class="text-sm text-gray-600 font-medium">{{getAutorNombre(libro.autor)}}</div></td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div class="text-xs">{{libro.isbn}}</div>
                  <div class="text-xs font-bold text-gray-400">{{libro.anio}}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button (click)="openModal('editar', libro)" class="text-indigo-600 hover:text-indigo-900 mr-4 font-semibold hover:underline">Editar</button>
                  <button (click)="deleteLibro(libro._id!)" class="text-red-500 hover:text-red-700 font-semibold hover:underline">Eliminar</button>
              </td>
          </tr>
          <tr *ngIf="libros.length === 0"><td colspan="4" class="px-6 py-8 text-center text-gray-500">No hay libros registrados.</td></tr>
      </tbody>
  </table>
</div>

<div *ngIf="isModalOpen" class="fixed z-10 inset-0 overflow-y-auto" role="dialog">
  <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <div class="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity backdrop-blur-sm" (click)="closeModal()"></div>
      <span class="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
      <div class="inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <form [formGroup]="libroForm" (ngSubmit)="onSubmit()">
              <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <h3 class="text-xl leading-6 font-bold text-gray-900 mb-5">{{ isEditing ? 'Editar Libro' : 'Nuevo Libro' }}</h3>
                  <div class="space-y-4">
                      <div>
                          <label class="block text-sm font-semibold text-gray-700 mb-1">Título *</label>
                          <input type="text" formControlName="titulo" required class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2 border">
                      </div>
                      <div>
                          <label class="block text-sm font-semibold text-gray-700 mb-1">Autor *</label>
                          <select formControlName="autor" required class="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                              <option value="">Seleccione un autor...</option>
                              <option *ngFor="let autor of autores" [value]="autor._id">{{autor.nombre}}</option>
                          </select>
                      </div>
                      <div class="grid grid-cols-2 gap-4">
                          <div>
                              <label class="block text-sm font-semibold text-gray-700 mb-1">ISBN *</label>
                              <input type="text" formControlName="isbn" required class="mt-1 focus:ring-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2 border">
                          </div>
                          <div>
                              <label class="block text-sm font-semibold text-gray-700 mb-1">Año de Publicación *</label>
                              <input type="number" formControlName="anio" required class="mt-1 focus:ring-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2 border">
                          </div>
                      </div>
                      <div class="flex items-center mt-4">
                          <input type="checkbox" formControlName="disponible" class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded">
                          <label class="ml-2 block text-sm text-gray-900 font-medium">Ejemplar disponible para préstamo</label>
                      </div>
                  </div>
              </div>
              <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse border-t border-gray-200">
                  <button type="submit" [disabled]="libroForm.invalid" class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 transition">Guardar</button>
                  <button type="button" (click)="closeModal()" class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm transition">Cancelar</button>
              </div>
          </form>
      </div>
  </div>
</div>
  `
})
export class LibrosComponent implements OnInit {
  private api = inject(ApiService);
  private fb = inject(FormBuilder);

  libros: Libro[] = [];
  autores: Autor[] = [];
  libroForm: FormGroup;
  isModalOpen = false;
  isEditing = false;
  currentId: string | null = null;
  isLoading = false;

  constructor() {
    this.libroForm = this.fb.group({
      titulo: ['', Validators.required],
      autor: ['', Validators.required],
      isbn: ['', Validators.required],
      anio: ['', Validators.required],
      disponible: [true]
    });
  }

  ngOnInit() {
    this.loadLibros();
    this.loadAutores();
  }

  loadLibros() {
    this.isLoading = true;
    this.api.getLibros().subscribe({
      next: (data) => { this.libros = data; this.isLoading = false; },
      error: (err) => { console.error(err); this.isLoading = false; }
    });
  }

  loadAutores() {
    this.api.getAutores().subscribe({
      next: (data) => this.autores = data,
      error: (err) => console.error(err)
    });
  }

  getAutorNombre(autor: Autor | string): string {
    if (typeof autor === 'object' && autor !== null) return autor.nombre;
    const found = this.autores.find(a => a._id === autor);
    return found ? found.nombre : 'Desconocido';
  }

  openModal(modo: 'crear' | 'editar', libro?: Libro) {
    this.isEditing = modo === 'editar';
    if (this.isEditing && libro) {
      this.currentId = libro._id || null;
      this.libroForm.patchValue({
        titulo: libro.titulo,
        autor: typeof libro.autor === 'object' ? libro.autor._id : libro.autor,
        isbn: libro.isbn,
        anio: libro.anio,
        disponible: libro.disponible
      });
    } else {
      this.currentId = null;
      this.libroForm.reset({ disponible: true });
    }
    this.isModalOpen = true;
  }

  closeModal() { this.isModalOpen = false; this.libroForm.reset({ disponible: true }); }

  onSubmit() {
    if (this.libroForm.invalid) return;
    const req = this.isEditing && this.currentId
      ? this.api.updateLibro(this.currentId, this.libroForm.value)
      : this.api.createLibro(this.libroForm.value);
    req.subscribe({ next: () => { this.loadLibros(); this.closeModal(); }, error: (err) => console.error(err) });
  }

  deleteLibro(id: string) {
    if (confirm('¿Estás seguro de que deseas eliminar este libro?')) {
      this.api.deleteLibro(id).subscribe({ next: () => this.loadLibros(), error: (err) => console.error(err) });
    }
  }
}
