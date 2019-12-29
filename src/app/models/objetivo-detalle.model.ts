import { Imagen } from './imagen.model';

export class ObjetivoDetalle {
    public _id: string;
    public titulo: string;
    public estado: string;
    public coordenadas: number[];
    public geo: any;
    public imagenes: Imagen[];
}