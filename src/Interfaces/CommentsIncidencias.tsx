export interface CommentIncidencia {
  _id: string;
  update: string;
  incidencias: string;
  fechaCreacion?: Date;
  usuarioCreador?: UsuarioCreador;
}

export interface UsuarioCreador {
  nombre: string;
}
