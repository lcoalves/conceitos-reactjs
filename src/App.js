import React, { useState, useEffect } from "react";
import { FaThumbsUp } from 'react-icons/fa'

import { uuid } from 'uuidv4'

import api from './services/api'
import "./styles.css";

function App() {
  const [repositories, setRepositories] = useState([])

  useEffect(() => {
    api.get('repositories').then(response => {
      setRepositories(response.data)
    })
  }, [])

  async function handleAddRepository() {
    const response = await api.post('repositories', {
      title: `Repositório ${uuid()}`,
      url: "https://github.com/lcoalves/conceitos-reactjs",
      techs: [
        "ReactJS",
        "Jest"
      ]
    })

    const repository = response.data

    setRepositories([...repositories, repository])
  }

  async function handleRemoveRepository(id) {
    try {
      await api.delete(`repositories/${id}`)

      setRepositories(repositories.filter(repository => repository.id !== id))
    } catch (err) {
      alert('Falha ao remover o repositório!')
    }
  }

  async function handleLikeRepository(id) {
    try {
      const response = await api.post(`repositories/${id}/like`)

      const repositoryIndex = repositories.findIndex(repository => repository.id === id)

      const newRepository = response.data

      setRepositories(repositories.map(repository => {
        if (repository.id === id) {
          repository = newRepository
        }

        return repository
      }))
    } catch (err) {
      alert('Falha ao curtir o repositório!')
    }
  }

  return (
    <div>
      <ul data-testid="repository-list">
        {repositories.map(repository => (
          <li key={repository.id}>
            {repository.title}

            <FaThumbsUp size={14} /> {repository.likes}

            <button className="like" onClick={() => handleLikeRepository(repository.id)}>
              Curtir
            </button>
            <button className="remove" onClick={() => handleRemoveRepository(repository.id)}>
              Remover
            </button>
          </li>
        ))}
      </ul>

      <button onClick={handleAddRepository}>Adicionar</button>
    </div>
  );
}

export default App;
