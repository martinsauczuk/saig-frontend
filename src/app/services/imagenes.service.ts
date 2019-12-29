import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs';
import { Objetivo } from '../models/objetivo.model';
import { ObjetivoDetalle } from '../models/objetivo-detalle.model';
import { Imagen } from '../models/imagen.model';

@Injectable({
  providedIn: 'root'
})
export class ImagenesService {

  constructor(
    public http: HttpClient
  ) { }

	host = 'http://localhost:3000';

  	/**
	 * Obtener todos los objetivos para listar
	 */
	getAll(): Observable<Imagen[]> {

		let url = `${this.host}/imagenes`;

		return this.http.get<Imagen[]>(url);

	}
	
	/**
	 * Obtener objetivo por objetivoId
	 */
	getByObjetivoId(objetivoId: string): Observable<Imagen[]> {

		let url = `${this.host}/imagenes`;

		return this.http.get<Imagen[]>(url, { params: { objetivoId: objetivoId}} );

	}

	/**
	 * 
	 * @param imagenId 
	 */
	deleteById(imagenId: string) {

		let url = `${this.host}/imagenes/${imagenId}`;

		console.log('eliminar img ', imagenId);
		
		return this.http.delete(url);
	}


}