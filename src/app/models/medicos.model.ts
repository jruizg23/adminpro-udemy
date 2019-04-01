import { Usuario } from './usuario.model';
import { Hospital } from './hospital.model';

export class Medico {
    constructor(
        public nombre?: string,
        public img?: string,
        public usuario?: Usuario,
        public hospital?: Hospital,
// tslint:disable-next-line: variable-name
        public _id?: string
    ) {}
}
