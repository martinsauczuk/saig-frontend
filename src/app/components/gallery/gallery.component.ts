import { Component, OnInit } from '@angular/core';
import { ImagenesService } from '../../services/imagenes.service';
import { Imagen } from '../../models/imagen.model';
import { tileLayer } from 'leaflet';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css']
})
export class GalleryComponent implements OnInit {

  imagenes: Imagen[]

  constructor(
    private imagenesService: ImagenesService
  ) { }

  ngOnInit() {
    this.refresh();
  }
  
  refresh() {
    this.imagenesService.getAll().subscribe( data => {
      this.imagenes = data;
      console.log(`cant: ${this.imagenes.length}`);
      
    });
    
  }





  /**
	 * 
	 * @param imagenId 
	 */
	public eliminarImagen(imagenId: string) {
		
		this.imagenesService.deleteById(imagenId).subscribe( resp => {
			this.refresh();
		});

	}

}
