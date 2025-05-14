export interface Categoria {
  categoriaId: string;
  nome: string;
  valor_maximo: number;
  _id: string;
}

export interface Departamento {
  departamentoId: string;
  nome: string;
  _id: string;
}

export interface Funcionario {
  userId: number;
  name: string;
  _id: string;
}

export interface Projeto {
  _id: string;
  projetoId: number;
  nome: string;
  descricao: string;
  categorias: Categoria[];
  departamentos: Departamento[];
  funcionarios: Funcionario[];
  createdAt: string;
}