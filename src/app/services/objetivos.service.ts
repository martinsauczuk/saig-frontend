import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs';
import { Objetivo } from '../models/objetivo.model';
import { ObjetivoDetalle } from '../models/objetivo-detalle.model';

@Injectable({
  providedIn: 'root'
})
export class ObjetivosService {

  constructor(
    public http: HttpClient
  ) { }

	// host = 'http://10.12.16.126:3000';
	host = 'http://localhost:3000';

  	/**
	 * Obtener todos los objetivos para listar
	 */
	getAllObjetivos(): Observable<Objetivo[]> {

		let url = `${this.host}/objetivos`;

		return this.http.get<Objetivo[]>(url);

	}
	
	/**
	 * Obtener objetivo por objetivoId
	 */
	getObjetivoById(id:string): Observable<ObjetivoDetalle> {

		let url = `${this.host}/objetivos/${id}`;

		return this.http.get<ObjetivoDetalle>(url);

	}

	/**
	 * 
	 * @param objetivo 
	 */
	postObjetivo(objetivo: Objetivo): Observable<Objetivo> {

		let url = `${this.host}/objetivos`;

		console.debug('objetivo service', objetivo);
		return this.http.post<Objetivo>(url, objetivo, {});
	}

	/**
	 * 
	 * @param objetivoId 
	 */
	deleteObjetivo(objetivoId: string): Observable<any> {

		let url = `${this.host}/objetivos/${objetivoId}`;

		return this.http.delete<any>(url);
	}
	
}