// Função para carregar e exibir os personagens
async function loadCharacters() {
  try {
    // Carregar os personagens do processo principal
    const characters = await window.api.loadCharacters();
    const listContainer = document.getElementById('character-list');
    listContainer.innerHTML = ''; // Limpar antes de carregar

    characters.forEach((character, index) => {
      const div = document.createElement('div');
      div.className = 'character-item';
      div.innerHTML = `
        <div>
          <img src="${character.image}" alt="${character.characterName}" style="width: 40px; height: 40px; border-radius: 50%; margin-right: 10px;">
          <strong>${character.characterName}</strong> (Iniciativa: ${character.initiative})
        </div>
        <div>
          <button onclick="editCharacter(${index})">Editar</button>
          <button onclick="deleteCharacter(${index})">Excluir</button>
        </div>
      `;
      listContainer.appendChild(div);
    });
  } catch (error) {
    console.error("Erro ao carregar os personagens:", error);
    alert("Ocorreu um erro ao carregar os personagens.");
  }
}

// Função para editar um personagem
async function editCharacter(index) {
  try {
    const characters = await window.api.loadCharacters();
    const character = characters[index];

    const newPlayerName = prompt("Novo nome do jogador", character.playerName);
    const newCharacterName = prompt("Novo nome do personagem", character.characterName);
    const newImage = prompt("Nova URL da imagem", character.image);
    const newInitiative = prompt("Novo valor da iniciativa", character.initiative);

    if (newPlayerName && newCharacterName && newImage && newInitiative) {
      const updatedCharacter = {
        playerName: newPlayerName,
        characterName: newCharacterName,
        image: newImage,
        initiative: parseInt(newInitiative, 10)
      };

      await window.api.editCharacter(index, updatedCharacter);
      await loadCharacters();
    } else {
      alert("Todos os campos são requeridos");
    }
  } catch (error) {
    console.error("Erro ao editar o personagem:", error);
    alert("Ocorreu um erro ao editar o personagem.");
  }
}

// Função para excluir um personagem
async function deleteCharacter(index) {
  if (confirm("Tem certeza de que deseja excluir este personagem?")) {
    try {
      await window.api.deleteCharacter(index);
      await loadCharacters();
    } catch (error) {
      console.error("Erro ao excluir o personagem:", error);
      alert("Ocorreu um erro ao excluir o personagem.");
    }
  }
}

// Função para adicionar um personagem
async function addCharacter(newCharacter) {
  try {
    // Chama a função do API para adicionar um personagem
    await window.api.addCharacter(newCharacter);
  } catch (error) {
    console.error("Erro ao adicionar o personagem:", error);
    throw new Error("Erro ao adicionar o personagem.");
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  if (window.location.pathname.endsWith('characters.html')) {
    await loadCharacters();

    // Evento para adicionar um personagem
    document.getElementById('add-btn').addEventListener('click', async () => {
      const playerName = document.getElementById('playerName').value;
      const characterName = document.getElementById('characterName').value;
      const imageInput = document.getElementById('image'); // Agora é um input file
      const imageFile = imageInput.files[0]; // Pega o arquivo de imagem selecionado
      const initiative = parseInt(document.getElementById('initiative').value, 10);

      if (playerName && characterName && imageFile && !isNaN(initiative)) {
        const reader = new FileReader(); // Usado para converter a imagem em base64

        reader.onload = function(e) {
          // A imagem foi convertida para base64
          const newCharacter = {
            playerName,
            characterName,
            image: e.target.result, // A imagem em formato base64
            initiative
          };

          try {
            // Adiciona o novo personagem
            window.api.addCharacter(newCharacter);

            // Recarregar os personagens e limpar os campos
            loadCharacters();
            document.getElementById('playerName').value = '';
            document.getElementById('characterName').value = '';
            document.getElementById('image').value = '';
            document.getElementById('initiative').value = '';
          } catch (error) {
            alert("Erro ao adicionar o personagem: " + error.message);
          }
        };

        // Converte a imagem selecionada para base64
        reader.readAsDataURL(imageFile);
      } else {
        alert("Por favor, preencha todos os campos corretamente!");
      }
    });
  }
});

