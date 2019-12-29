import { Component, OnInit, NgZone } from '@angular/core';
import { tileLayer, latLng, DrawEvents, FeatureGroup, circle, polygon, TileLayer, Marker, LatLng, MarkerOptions, icon, AwesomeMarkers, geoJSON, Point, MapOptions, DrawOptions, Icon, LeafletEvent, LayerEvent } from 'leaflet';
import { ObjetivosService } from '../../services/objetivos.service';
import { ImagenesService } from '../../services/imagenes.service';
import { Objetivo } from 'src/app/models/objetivo.model';
import 'leaflet.awesome-markers';
import { LeafletControlLayersConfig } from '@asymmetrik/ngx-leaflet';
import { Estado } from 'src/app/services/estado.enum';



@Component({
	selector: 'app-map-editor',
	templateUrl: './map-editor.component.html',
	//   styleUrls: ['./map-editor.component.css']
})
export class MapEditorComponent implements OnInit {

	constructor(
		private objetivosService: ObjetivosService,
		private imagenesService: ImagenesService,
		private zone: NgZone
	) { }

	objetivos: Objetivo[];
	objetivosLayer = new FeatureGroup();
	objetivoSeleccionado: Objetivo;


	osm = new TileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, attribution: '...' });
	markerOptionsObjetivo: MarkerOptions = {
		icon: icon({
			iconSize: [25, 41],
			iconAnchor: [13, 41],
			iconUrl: 'leaflet/marker-icon.png',
			shadowUrl: 'leaflet/marker-shadow.png'
		})
	}

	leafletOptions: MapOptions = {
		layers: [
			this.osm,
			// 	tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: 'Open Street Map' }),
			this.objetivosLayer
		],
		zoom: 12,
		center: latLng({ lat: -34.60523684562201, lng: -58.379716873168945 })
	};

	/**
	 * Opciones para el panel de layers
	 */
	layersControl: LeafletControlLayersConfig = {
		baseLayers: {
			'Open Street Map': this.osm,
			'Open Cycle Map': tileLayer('http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '...' }),
		},
		overlays: {
			'Big Circle': circle([46.95, -122], { radius: 5000 }),
			'Big Square': polygon([[46.8, -121.55], [46.9, -121.55], [46.9, -121.7], [46.8, -121.7]]),
			'Objetivos': this.objetivosLayer
		}
	}

	/**
	 * Opciones para Draw
	 */
	drawOptions = {
		position: 'bottomright',
		draw: {
			marker: {
				icon: icon({
					iconSize: [25, 41],
					iconAnchor: [13, 41],
					iconUrl: 'leaflet/marker-icon.png',
					shadowUrl: 'leaflet/marker-shadow.png'
				})
			},
			edit: {
				// featureGroup: this.objetivosDraw,
				remove: true
			},
			polyline: false,
			polygon: false,
			rectangle: false,
			circle: false,
			circlemarker: false
		}
	};

	/**
	 * 
	 */
	ngOnInit() {

		this.refreshMarkers();

	}


	/**
	 * Actualizar markers del server
	 */
	refreshMarkers() {

		this.objetivosService.getAllObjetivos().subscribe(data => {
			console.log('data', data)
			this.objetivos = data;
			this.drawMarkers();
		});
		this.objetivoSeleccionado = null;
	}

	/**
	 * Dibujar todos los markers
	 */
	drawMarkers() {

		this.objetivosLayer.clearLayers();
		this.objetivos.forEach(obj => {

			let iconMarker: AwesomeMarkers.Icon;

			// Marker NUEVO
			if (obj.imagenes.length == 0) {
				iconMarker = AwesomeMarkers.icon({
					icon: '',
					prefix: 'fa',
					markerColor: 'cadetblue'
				});
			}

			// Marker FOTO
			if (obj.imagenes.length > 0) {
				iconMarker = AwesomeMarkers.icon({
					icon: 'camera',
					prefix: 'fa',
					markerColor: 'green'
				});
			}

			let marker: Marker = new Marker(
				new LatLng(obj.geo.coordinates[1], obj.geo.coordinates[0]),
				{
					icon: iconMarker
				}
			);

			marker.bindPopup(
				'<b>ID:</b>' + obj._id + '<br>' +
				'<b>Fotos:</b>' + obj.imagenes.length + '<br>'
			);

			marker.on('click', (event: LeafletEvent) => {

				this.zone.run(() => {
					this.clickOnMarker(event);
				});
	
			});

			this.objetivosLayer.addLayer(marker)
			obj.leafletId = marker['_leaflet_id']
		})

	}

	/**
	 * clickOnMarker
	 */
	public clickOnMarker(event: LeafletEvent) {

		const leafletId = event.target._leaflet_id
		console.log('click en marker leafletId:', leafletId);

		const objetivo =  this.objetivos.find( m => m.leafletId == leafletId );

		console.log('click en marker ', objetivo);
		
		this.imagenesService.getByObjetivoId(objetivo._id).subscribe( imagenes => {
			console.log('imagenes', imagenes);
			objetivo.imagenes = imagenes;
			this.objetivoSeleccionado = objetivo;
		});

		// this.objetivosService.getObjetivoById(objetivo._id).subscribe( objetivoDetalle => {
		// 	console.log('objetivo detalle:' , objetivoDetalle);
		
		// });


	}

	/**
	 * 
	 * @param e 
	 */
	public onDrawCreated(e: DrawEvents.Created) {

		console.log('Draw Created Event!', e);
		let geojson = e.layer.toGeoJSON();
		console.log('Marker geojson:', geojson);


		let obj: Objetivo = new Objetivo();
		obj.estado = 'NUEVO';
		obj.geo = geojson.geometry;
		
		// console.log('objetivosDraw', this.objetivosDraw);

		console.log('Objetivo a guardar', obj);
		this.objetivosService.postObjetivo(obj).subscribe(
			result => {
				console.log('Objetivo guardado OK', result)
				this.refreshMarkers();
			});
	}

	public clickOnMap(event: any) {
		console.log('onClick on map !!!');
		this.objetivoSeleccionado = null;
			
	}

	/**
	 * Eliminar objetivoSeleccionado
	 */
	public eliminarObjetivoSeleccionado() {

		console.log('eliminar objetivo', this.objetivoSeleccionado);
		
		this.objetivosService.deleteObjetivo(this.objetivoSeleccionado._id).subscribe( resp => {

			console.log('eliminado ok');
			this.refreshMarkers();
		});

	}

	/**
	 * 
	 * @param imagenId 
	 */
	public eliminarImagen(imagenId: string) {
		
		this.imagenesService.deleteById(imagenId).subscribe( resp => {
			this.refreshMarkers();
		});

	}
}
