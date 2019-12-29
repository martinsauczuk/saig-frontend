import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MapEditorComponent } from './components/map-editor/map-editor.component';
import { GalleryComponent } from './components/gallery/gallery.component';


const routes: Routes = [
  // { path: 'map', component: MapComponent },
  { path: '', component: MapEditorComponent },
  { path: 'map-editor', component: MapEditorComponent },
  { path: 'imagenes', component: GalleryComponent },
  { path: '**', pathMatch: 'full', redirectTo: 'home' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
