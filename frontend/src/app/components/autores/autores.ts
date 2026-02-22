import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../../services/api';
import { Autor } from '../../models/interfaces';

@Component({
  selector: 'app-autores',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './autores.html',
})
export class AutoresComponent implements OnInit {
  private api = inject(ApiService);
  private fb = inject(FormBuilder);

  autores: Autor[] = [];
  autorForm: FormGroup;

  isModalOpen = false;
  isEditing = false;
  currentId: string | null = null;
  isLoading = false;

  constructor() {
    this.autorForm = this.fb.group({
      nombre: ['', Validators.required],
      nacionalidad: [''],
      fecha_nacimiento: [''],
      biografia: ['']
    });
  }

  ngOnInit() {
    this.loadAutores();
  }

  loadAutores() {
    this.isLoading = true;
    this.api.getAutores().subscribe({
      next: (data) => {
        this.autores = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error cargando autores', err);
        this.isLoading = false;
      }
    });
  }

  openModal(modo: 'crear' | 'editar', autor?: Autor) {
    this.isEditing = modo === 'editar';
    if (this.isEditing && autor) {
      this.currentId = autor._id || null;
      this.autorForm.patchValue({
        nombre: autor.nombre,
        nacionalidad: autor.nacionalidad,
        fecha_nacimiento: autor.fecha_nacimiento ? new Date(autor.fecha_nacimiento).toISOString().split('T')[0] : '',
        biografia: autor.biografia
      });
    } else {
      this.currentId = null;
      this.autorForm.reset();
    }
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.autorForm.reset();
  }

  onSubmit() {
    if (this.autorForm.invalid) return;

    if (this.isEditing && this.currentId) {
      this.api.updateAutor(this.currentId, this.autorForm.value).subscribe({
        next: () => {
          this.loadAutores();
          this.closeModal();
        },
        error: (err) => console.error(err)
      });
    } else {
      this.api.createAutor(this.autorForm.value).subscribe({
        next: () => {
          this.loadAutores();
          this.closeModal();
        },
        error: (err) => console.error(err)
      });
    }
  }

  deleteAutor(id: string) {
    if (confirm('¿Estás seguro de que deseas eliminar este autor?')) {
      this.api.deleteAutor(id).subscribe({
        next: () => this.loadAutores(),
        error: (err) => console.error(err)
      });
    }
  }
}
