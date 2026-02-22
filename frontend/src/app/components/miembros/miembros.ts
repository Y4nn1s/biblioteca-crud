import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../../services/api';
import { Miembro } from '../../models/interfaces';

@Component({
  selector: 'app-miembros',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
<div class="mb-6 flex justify-between items-center bg-white p-6 rounded-lg shadow cursor-default">
  <div>
      <h2 class="text-3xl font-extrabold text-gray-800">Miembros</h2>
      <p class="text-gray-500 mt-1">Usuarios registrados en la biblioteca</p>
  </div>
  <button (click)="openModal('crear')" class="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-6 rounded-lg shadow transition">
      Nuevo Miembro
  </button>
</div>

<div *ngIf="isLoading" class="flex justify-center py-20"><div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div></div>

<div *ngIf="!isLoading" class="bg-white rounded-lg shadow overflow-hidden">
  <table class="min-w-full divide-y divide-gray-200">
      <thead class="bg-gray-50">
          <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Teléfono</th>
              <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acciones</th>
          </tr>
      </thead>
      <tbody class="bg-white divide-y divide-gray-200">
          <tr *ngFor="let miembro of miembros" class="hover:bg-indigo-50 transition">
              <td class="px-6 py-4 whitespace-nowrap"><div class="text-sm font-bold text-gray-900">{{miembro.nombre}}</div></td>
              <td class="px-6 py-4 whitespace-nowrap"><div class="text-sm text-gray-500">{{miembro.email}}</div></td>
              <td class="px-6 py-4 whitespace-nowrap"><div class="text-sm text-gray-500">{{miembro.telefono || '-'}}</div></td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button (click)="openModal('editar', miembro)" class="text-indigo-600 hover:text-indigo-900 mr-4 font-semibold hover:underline">Editar</button>
                  <button (click)="deleteMiembro(miembro._id!)" class="text-red-500 hover:text-red-700 font-semibold hover:underline">Eliminar</button>
              </td>
          </tr>
          <tr *ngIf="miembros.length === 0"><td colspan="4" class="px-6 py-8 text-center text-gray-500">No hay miembros registrados.</td></tr>
      </tbody>
  </table>
</div>

<div *ngIf="isModalOpen" class="fixed z-10 inset-0 overflow-y-auto" role="dialog">
  <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <div class="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity backdrop-blur-sm" (click)="closeModal()"></div>
      <span class="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
      <div class="inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <form [formGroup]="miembroForm" (ngSubmit)="onSubmit()">
              <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <h3 class="text-xl leading-6 font-bold text-gray-900 mb-5">{{ isEditing ? 'Editar Miembro' : 'Nuevo Miembro' }}</h3>
                  <div class="space-y-4">
                      <div>
                          <label class="block text-sm font-semibold text-gray-700 mb-1">Nombre Completo *</label>
                          <input type="text" formControlName="nombre" required class="mt-1 focus:ring-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2 border">
                      </div>
                      <div>
                          <label class="block text-sm font-semibold text-gray-700 mb-1">Email *</label>
                          <input type="email" formControlName="email" required class="mt-1 focus:ring-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2 border">
                      </div>
                      <div>
                          <label class="block text-sm font-semibold text-gray-700 mb-1">Teléfono</label>
                          <input type="text" formControlName="telefono" class="mt-1 focus:ring-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2 border">
                      </div>
                  </div>
              </div>
              <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse border-t border-gray-200">
                  <button type="submit" [disabled]="miembroForm.invalid" class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 transition">Guardar</button>
                  <button type="button" (click)="closeModal()" class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm transition">Cancelar</button>
              </div>
          </form>
      </div>
  </div>
</div>
  `
})
export class MiembrosComponent implements OnInit {
  private api = inject(ApiService);
  private fb = inject(FormBuilder);

  miembros: Miembro[] = [];
  miembroForm: FormGroup;
  isModalOpen = false;
  isEditing = false;
  currentId: string | null = null;
  isLoading = false;

  constructor() {
    this.miembroForm = this.fb.group({
      nombre: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['']
    });
  }

  ngOnInit() { this.loadMiembros(); }

  loadMiembros() {
    this.isLoading = true;
    this.api.getMiembros().subscribe({
      next: (data) => { this.miembros = data; this.isLoading = false; },
      error: (err) => { console.error(err); this.isLoading = false; }
    });
  }

  openModal(modo: 'crear' | 'editar', miembro?: Miembro) {
    this.isEditing = modo === 'editar';
    if (this.isEditing && miembro) {
      this.currentId = miembro._id || null;
      this.miembroForm.patchValue({ nombre: miembro.nombre, email: miembro.email, telefono: miembro.telefono });
    } else {
      this.currentId = null;
      this.miembroForm.reset();
    }
    this.isModalOpen = true;
  }

  closeModal() { this.isModalOpen = false; this.miembroForm.reset(); }

  onSubmit() {
    if (this.miembroForm.invalid) return;
    const req = this.isEditing && this.currentId
      ? this.api.updateMiembro(this.currentId, this.miembroForm.value)
      : this.api.createMiembro(this.miembroForm.value);
    req.subscribe({ next: () => { this.loadMiembros(); this.closeModal(); }, error: (err) => console.error(err) });
  }

  deleteMiembro(id: string) {
    if (confirm('¿Estás seguro de que deseas eliminar este miembro?')) {
      this.api.deleteMiembro(id).subscribe({ next: () => this.loadMiembros(), error: (err) => console.error(err) });
    }
  }
}
