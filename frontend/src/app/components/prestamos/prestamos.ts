import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../../services/api';
import { Prestamo, Libro, Miembro } from '../../models/interfaces';

@Component({
  selector: 'app-prestamos',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
<div class="mb-6 flex justify-between items-center bg-white p-6 rounded-lg shadow cursor-default">
  <div>
      <h2 class="text-3xl font-extrabold text-gray-800">Préstamos</h2>
      <p class="text-gray-500 mt-1">Control de circulación de ejemplares</p>
  </div>
  <button (click)="openModal('crear')" class="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-6 rounded-lg shadow transition">
      Nuevo Préstamo
  </button>
</div>

<div *ngIf="isLoading" class="flex justify-center py-20"><div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div></div>

<div *ngIf="!isLoading" class="bg-white rounded-lg shadow overflow-hidden">
  <table class="min-w-full divide-y divide-gray-200">
      <thead class="bg-gray-50">
          <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Libro</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Miembro</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fechas</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
              <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acciones</th>
          </tr>
      </thead>
      <tbody class="bg-white divide-y divide-gray-200">
          <tr *ngFor="let prestamo of prestamos" class="hover:bg-indigo-50 transition">
              <td class="px-6 py-4 whitespace-nowrap"><div class="text-sm font-bold text-gray-900">{{getLibroNombre(prestamo.libro)}}</div></td>
              <td class="px-6 py-4 whitespace-nowrap"><div class="text-sm text-gray-600 font-medium">{{getMiembroNombre(prestamo.miembro)}}</div></td>
              <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">Salida: {{prestamo.fecha_prestamo | date:'dd/MM/yyyy'}}</div>
                  <div class="text-xs text-gray-500 font-semibold" *ngIf="prestamo.fecha_devolucion">Regreso: {{prestamo.fecha_devolucion | date:'dd/MM/yyyy'}}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                  <span *ngIf="prestamo.estado === 'activo'" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">Activo</span>
                  <span *ngIf="prestamo.estado === 'devuelto'" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Devuelto</span>
              </td>
              <td class="px-6 py-4 text-right text-sm font-medium">
                  <button (click)="openModal('editar', prestamo)" class="text-indigo-600 hover:text-indigo-900 mr-4 font-semibold hover:underline">Editar</button>
                  <button (click)="deletePrestamo(prestamo._id!)" class="text-red-500 hover:text-red-700 font-semibold hover:underline">Eliminar</button>
              </td>
          </tr>
          <tr *ngIf="prestamos.length === 0"><td colspan="5" class="px-6 py-8 text-center text-gray-500">No hay préstamos registrados.</td></tr>
      </tbody>
  </table>
</div>

<div *ngIf="isModalOpen" class="fixed z-10 inset-0 overflow-y-auto" role="dialog">
  <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <div class="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity backdrop-blur-sm" (click)="closeModal()"></div>
      <span class="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
      <div class="inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <form [formGroup]="prestamoForm" (ngSubmit)="onSubmit()">
              <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <h3 class="text-xl leading-6 font-bold text-gray-900 mb-5">{{ isEditing ? 'Editar Préstamo' : 'Nuevo Préstamo' }}</h3>
                  <div class="space-y-4">
                      <div>
                          <label class="block text-sm font-semibold text-gray-700 mb-1">Libro *</label>
                          <select formControlName="libro" required class="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                              <option value="">Seleccione un libro...</option>
                              <option *ngFor="let lib of libros" [value]="lib._id">{{lib.titulo}}</option>
                          </select>
                      </div>
                      <div>
                          <label class="block text-sm font-semibold text-gray-700 mb-1">Miembro *</label>
                          <select formControlName="miembro" required class="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                              <option value="">Seleccione un miembro...</option>
                              <option *ngFor="let mem of miembros" [value]="mem._id">{{mem.nombre}}</option>
                          </select>
                      </div>
                      <div class="grid grid-cols-2 gap-4">
                          <div>
                              <label class="block text-sm font-semibold text-gray-700 mb-1">Fecha de Préstamo *</label>
                              <input type="date" formControlName="fecha_prestamo" required class="mt-1 focus:ring-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2 border">
                          </div>
                          <div>
                              <label class="block text-sm font-semibold text-gray-700 mb-1">Fecha de Devolución</label>
                              <input type="date" formControlName="fecha_devolucion" class="mt-1 focus:ring-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2 border">
                          </div>
                      </div>
                      <div>
                          <label class="block text-sm font-semibold text-gray-700 mb-1">Estado *</label>
                          <select formControlName="estado" required class="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                              <option value="activo">Activo</option>
                              <option value="devuelto">Devuelto</option>
                          </select>
                      </div>
                  </div>
              </div>
              <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse border-t border-gray-200">
                  <button type="submit" [disabled]="prestamoForm.invalid" class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 transition">Guardar</button>
                  <button type="button" (click)="closeModal()" class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm transition">Cancelar</button>
              </div>
          </form>
      </div>
  </div>
</div>
  `
})
export class PrestamosComponent implements OnInit {
  private api = inject(ApiService);
  private fb = inject(FormBuilder);

  prestamos: Prestamo[] = [];
  libros: Libro[] = [];
  miembros: Miembro[] = [];
  prestamoForm: FormGroup;
  isModalOpen = false;
  isEditing = false;
  currentId: string | null = null;
  isLoading = false;

  constructor() {
    this.prestamoForm = this.fb.group({
      libro: ['', Validators.required],
      miembro: ['', Validators.required],
      fecha_prestamo: [new Date().toISOString().split('T')[0], Validators.required],
      fecha_devolucion: [''],
      estado: ['activo', Validators.required]
    });
  }

  ngOnInit() {
    this.loadPrestamos();
    this.loadListas();
  }

  loadPrestamos() {
    this.isLoading = true;
    this.api.getPrestamos().subscribe({
      next: (data) => { this.prestamos = data; this.isLoading = false; },
      error: (err) => { console.error(err); this.isLoading = false; }
    });
  }

  loadListas() {
    this.api.getLibros().subscribe(data => this.libros = data);
    this.api.getMiembros().subscribe(data => this.miembros = data);
  }

  getLibroNombre(libro: Libro | string): string {
    if (typeof libro === 'object' && libro !== null) return libro.titulo;
    const found = this.libros.find(l => l._id === libro);
    return found ? found.titulo : 'Desconocido';
  }

  getMiembroNombre(miembro: Miembro | string): string {
    if (typeof miembro === 'object' && miembro !== null) return miembro.nombre;
    const found = this.miembros.find(m => m._id === miembro);
    return found ? found.nombre : 'Desconocido';
  }

  openModal(modo: 'crear' | 'editar', prestamo?: Prestamo) {
    this.isEditing = modo === 'editar';
    if (this.isEditing && prestamo) {
      this.currentId = prestamo._id || null;
      this.prestamoForm.patchValue({
        libro: typeof prestamo.libro === 'object' ? prestamo.libro._id : prestamo.libro,
        miembro: typeof prestamo.miembro === 'object' ? prestamo.miembro._id : prestamo.miembro,
        fecha_prestamo: prestamo.fecha_prestamo ? new Date(prestamo.fecha_prestamo).toISOString().split('T')[0] : '',
        fecha_devolucion: prestamo.fecha_devolucion ? new Date(prestamo.fecha_devolucion).toISOString().split('T')[0] : '',
        estado: prestamo.estado || 'activo'
      });
    } else {
      this.currentId = null;
      this.prestamoForm.reset({ fecha_prestamo: new Date().toISOString().split('T')[0], estado: 'activo' });
    }
    this.isModalOpen = true;
  }

  closeModal() { this.isModalOpen = false; this.prestamoForm.reset(); }

  onSubmit() {
    if (this.prestamoForm.invalid) return;

    // Auto fix devolution date
    let payload = { ...this.prestamoForm.value };
    if (payload.estado === 'devuelto' && !payload.fecha_devolucion) {
      payload.fecha_devolucion = new Date().toISOString().split('T')[0];
    }
    if (!payload.fecha_devolucion) delete payload.fecha_devolucion;

    const req = this.isEditing && this.currentId
      ? this.api.updatePrestamo(this.currentId, payload)
      : this.api.createPrestamo(payload);
    req.subscribe({ next: () => { this.loadPrestamos(); this.closeModal(); }, error: (err) => console.error(err) });
  }

  deletePrestamo(id: string) {
    if (confirm('¿Estás seguro de que deseas eliminar este préstamo?')) {
      this.api.deletePrestamo(id).subscribe({ next: () => this.loadPrestamos(), error: (err) => console.error(err) });
    }
  }
}
