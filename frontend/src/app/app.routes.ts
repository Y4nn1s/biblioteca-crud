import { Routes } from '@angular/router';
import { AutoresComponent } from './components/autores/autores';
import { CategoriasComponent } from './components/categorias/categorias';
import { LibrosComponent } from './components/libros/libros';
import { MiembrosComponent } from './components/miembros/miembros';
import { PrestamosComponent } from './components/prestamos/prestamos';

export const routes: Routes = [
    { path: '', redirectTo: '/autores', pathMatch: 'full' },
    { path: 'autores', component: AutoresComponent },
    { path: 'categorias', component: CategoriasComponent },
    { path: 'libros', component: LibrosComponent },
    { path: 'miembros', component: MiembrosComponent },
    { path: 'prestamos', component: PrestamosComponent }
];
