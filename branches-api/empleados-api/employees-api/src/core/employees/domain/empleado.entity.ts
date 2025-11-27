export interface EmpleadoProps {
    id: string;             
    nombre: string;
    direccion: string;
    telefono: string;
    dni: string;
    fechaNacimiento: Date;
    idSucursal: number;     
  }
  
  export class Empleado {
    constructor(private props: EmpleadoProps) {}
  
    get id() { return this.props.id; }
    get nombre() { return this.props.nombre; }
    get direccion() { return this.props.direccion; }
    get telefono() { return this.props.telefono; }
    get dni() { return this.props.dni; }
    get fechaNacimiento() { return this.props.fechaNacimiento; }
    get idSucursal() { return this.props.idSucursal; }
  
    actualizarDatos(update: Partial<Omit<EmpleadoProps, 'id'>>) {
      this.props = { ...this.props, ...update };
    }
  
    toJSON() {
      return { ...this.props };
    }
  }