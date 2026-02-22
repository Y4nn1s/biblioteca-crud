import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../../services/api';
import { Categoria } from '../../models/interfaces';

@Component({
  selector: 'app-categorias',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
<div class="mb-6 flex justify-between items-center bg-white p-6 rounded-lg shadow cursor-default">
  <div>
      <h2 class="text-3xl font-extrabold text-gray-800">Categorías</h2>
      <p class="text-gray-500 mt-1">Clasificación de libros</p>
  </div>
  <button (click)="openModal('crear')" class="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-6 rounded-lg shadow transition duration-200 transform hover:scale-105 flex items-center gap-2">
      Nuevo
  </button>
</div>

<!-- Loading State -->
<div *ngIf="isLoading" class="flex justify-center items-center py-20">
  <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
</div>

<!-- Tabla -->
<div *ngIf="!isLoading" class="bg-white rounded-lg shadow overflow-hidden">
  <table class="min-w-full divide-y divide-gray-200">
      <thead class="bg-gray-50">
          <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Descripción</th>
              <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acciones</th>
          </tr>
      </thead>
      <tbody class="bg-white divide-y divide-gray-200">
          <tr *ngFor="let cat of categorias" class="hover:bg-indigo-50 transition">
              <td class="px-6 py-4 whitespace-nowrap"><div class="text-sm font-medium text-gray-900">{{cat.nombre}}</div></td>
              <td class="px-6 py-4"><div class="text-sm text-gray-500">{{cat.descripcion || '-'}}</div></td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button (click)="openModal('editar', cat)" class="text-indigo-600 hover:text-indigo-900 mr-4 font-semibold transition hover:underline">Editar</button>
                  <button (click)="deleteCategoria(cat._id!)" class="text-red-500 hover:text-red-700 font-semibold transition hover:underline">Eliminar</button>
              </td>
          </tr>
          <tr *ngIf="categorias.length === 0">
              <td colspan="3" class="px-6 py-8 text-center text-gray-500">No hay categorías registradas.</td>
          </tr>
      </tbody>
  </table>
</div>

<!-- Modal -->
<div *ngIf="isModalOpen" class="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
  <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <div class="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity backdrop-blur-sm" (click)="closeModal()"></div>
      <span class="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
      <div class="inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <form [formGroup]="catForm" (ngSubmit)="onSubmit()">
              <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <h3 class="text-xl leading-6 font-bold text-gray-900 mb-5">{{ isEditing ? 'Editar Categoría' : 'Nueva Categoría' }}</h3>
                  <div class="space-y-4">
                      <div>
                          <label class="block text-sm font-semibold text-gray-700 mb-1">Nombre *</label>
                          <input type="text" formControlName="nombre" required class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2 border">
                      </div>
                      <div>
                          <label class="block text-sm font-semibold text-gray-700 mb-1">Descripción</label>
                          <textarea formControlName="descripcion" rows="3" class="mt-1 flex block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2 border resize-none"></textarea>
                      </div>
                  </div>
              </div>
              <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse border-t border-gray-200">
                  <button type="submit" [disabled]="catForm.invalid" class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 transition">Guardar</button>
                  <button type="button" (click)="closeModal()" class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm transition">Cancelar</button>
              </div>
          </form>
      </div>
  </div>
</div>
  `
})
export class CategoriasComponent implements OnInit {
  private api = inject(ApiService);
  private fb = inject(FormBuilder);

  categorias: Categoria[] = [];
  catForm: FormGroup;
  isModalOpen = false;
  isEditing = false;
  currentId: string | null = null;
  isLoading = false;

  constructor() {
    this.catForm = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: ['']
    });
  }

  ngOnInit() { this.loadCategorias(); }

  loadCategorias() {
    this.isLoading = true;
    this.api.getCategorias().subscribe({
      next: (data) => { this.categorias = data; this.isLoading = false; },
      error: (err) => { console.error(err); this.isLoading = false; }
    });
  }

  openModal(modo: 'crear' | 'editar', cat?: Categoria) {
    this.isEditing = modo === 'editar';
    if (this.isEditing && cat) {
      this.currentId = cat._id || null;
      this.catForm.patchValue({ nombre: cat.nombre, descripcion: cat.descripcion });
    } else {
      this.currentId = null;
      this.catForm.reset();
    }
    this.isModalOpen = true;
  }

  closeModal() { this.isModalOpen = false; this.catForm.reset(); }

  onSubmit() {
    if (this.catForm.invalid) return;
    const req = this.isEditing && this.currentId
      ? this.api.updateCategoria(this.currentId, this.catForm.value)
      : this.api.createCategoria(this.catForm.value);
    req.subscribe({ next: () => { this.loadCategorias(); this.closeModal(); }, error: (err) => console.error(err) });
  }

  deleteCategoria(id: string) {
    if (confirm('¿Estás seguro de que deseas eliminar esta categoría?')) {
      this.api.deleteCategoria(id).subscribe({ next: () => this.loadCategorias(), error: (err) => console.error(err) });
    }
  }
}
