"use client";

import { useState, useEffect } from "react";

const URL_API = "http://localhost:3333";

type User = {
  id: number;
  nome: string;
  idade: number;
};

export default function Home() {
  const [users, setUsers] = useState<User[]>([]); // Estado para os usuários
  const [newUser, setNewUser] = useState<User>({ id: 0, nome: "", idade: 0 }); // Estado para o novo usuário

  // Função para carregar os usuários
  const getUsers = async () => {
    try {
      const response = await fetch(URL_API + '/listar');
      const data: User[] = await response.json();
      setUsers(data);
    } catch (error) {
      console.log(error);
    }
  };

  // Função para adicionar um novo usuário
  const addUser = async (e: React.FormEvent) => {
    e.preventDefault(); // Previne o comportamento padrão do form (que é recarregar a página)

    try {
      const response = await fetch(URL_API + '/cadastro', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUser),
      });

      // Debugging: Verificar o status da resposta
      console.log("Response status:", response.status);
      console.log("Response text:", await response.text());

      if (response.ok) {
        getUsers(); // Recarrega os usuários após adicionar
        setNewUser({ id: 0, nome: "", idade: 0 }); // Limpa os campos do formulário
      } else {
        console.error("Erro ao adicionar o usuário");
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
    }
  };

  // Chama a função getUsers assim que o componente for montado
  useEffect(() => {
    getUsers();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">Cadastro de Usuários</h1>

      {/* Formulário para adicionar um novo usuário */}
      <form onSubmit={addUser} className="mb-8">
        <div className="mb-4">
          <label className="block text-sm font-medium">ID</label>
          <input
            type="number"
            value={newUser.id}
            onChange={(e) => setNewUser({ ...newUser, id: parseInt(e.target.value) })}
            className="mt-2 p-2 w-full border border-gray-300 rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium">Nome</label>
          <input
            type="text"
            value={newUser.nome}
            onChange={(e) => setNewUser({ ...newUser, nome: e.target.value })}
            className="mt-2 p-2 w-full border border-gray-300 rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium">Idade</label>
          <input
            type="number"
            value={newUser.idade}
            onChange={(e) => setNewUser({ ...newUser, idade: parseInt(e.target.value) })}
            className="mt-2 p-2 w-full border border-gray-300 rounded"
            required
          />
        </div>

        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
          Adicionar Usuário
        </button>
      </form>

      {/* Seção para visualizar os usuários cadastrados */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Lista de Usuários</h2>
        <table className="min-w-full table-auto">
          <thead>
            <tr>
              <th className="px-4 py-2 border-b">ID</th>
              <th className="px-4 py-2 border-b">Nome</th>
              <th className="px-4 py-2 border-b">Idade</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td className="px-4 py-2 border-b">{user.id}</td>
                <td className="px-4 py-2 border-b">{user.nome}</td>
                <td className="px-4 py-2 border-b">{user.idade}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
