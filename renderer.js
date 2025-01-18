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
    // Carregar os personagens
    const characters = await window.api.loadCharacters();
    const character = characters[index];

    // Abertura do Modal de Edição
    const modal = document.getElementById("editModal");
    const closeModal = document.getElementById("close-modal");

    // Preenche os campos do formulário com os dados atuais
    document.getElementById("editPlayerName").value = character.playerName;
    document.getElementById("editCharacterName").value = character.characterName;
    document.getElementById("editInitiative").value = character.initiative;

    // Exibe o modal
    modal.style.display = "block";

    // Fecha o modal
    closeModal.onclick = () => {
      modal.style.display = "none";
    };

    // Quando o formulário de edição for enviado
    document.getElementById("editForm").onsubmit = async (e) => {
      e.preventDefault();

      const newPlayerName = document.getElementById("editPlayerName").value;
      const newCharacterName = document.getElementById("editCharacterName").value;
      const newInitiative = parseInt(document.getElementById("editInitiative").value, 10);
      let newImage = character.image; // Se não mudar, mantém a imagem original

      // Verifica se o usuário escolheu uma nova imagem
      const fileInput = document.getElementById("editImage");
      if (fileInput.files.length > 0) {
        const imageFile = fileInput.files[0];
        const reader = new FileReader();

        reader.onload = async () => {
          newImage = reader.result; // A imagem convertida para base64
          await updateCharacter();
        };

        reader.readAsDataURL(imageFile); // Lê o arquivo como base64
      } else {
        await updateCharacter();
      }

      // Função para atualizar o personagem
      async function updateCharacter() {
        if (newPlayerName && newCharacterName && !isNaN(newInitiative)) {
          const updatedCharacter = {
            playerName: newPlayerName,
            characterName: newCharacterName,
            image: newImage,
            initiative: newInitiative,
          };

          await window.api.editCharacter(index, updatedCharacter);
          await loadCharacters(); // Recarrega os personagens
          modal.style.display = "none"; // Fecha o modal
        } else {
          alert("Por favor, preencha todos os campos corretamente!");
        }
      }
    };
  } catch (error) {
    console.error("Erro ao editar o personagem:", error);
    alert("Ocorreu um erro ao editar o personagem.");
  }
}

// Função para excluir um personagem
async function deleteCharacter(index) {
  try {
    // Exibir o modal de confirmação
    const modal = document.getElementById('confirm-modal');
    modal.style.display = 'flex'; // Exibir o modal

    // Aguardar a confirmação do usuário
    const confirmBtn = document.getElementById('confirm-delete-btn');
    const cancelBtn = document.getElementById('cancel-delete-btn');

    return new Promise((resolve, reject) => {
      // Quando o usuário confirmar a exclusão
      confirmBtn.onclick = async () => {
        try {
          await window.api.deleteCharacter(index);  // Excluir o personagem
          await loadCharacters();  // Recarregar a lista de personagens

          // Fechar o modal
          modal.style.display = 'none';
          resolve();
        } catch (error) {
          console.error("Erro ao excluir o personagem:", error);
          alert("Ocorreu um erro ao excluir o personagem.");
          modal.style.display = 'none';  // Fechar o modal
          reject(error);
        }
      };

      // Quando o usuário cancelar a exclusão
      cancelBtn.onclick = () => {
        modal.style.display = 'none';  // Fechar o modal
        reject('Exclusão cancelada');
      };
    });
  } catch (error) {
    console.error("Erro ao excluir o personagem:", error);
    alert("Ocorreu um erro ao excluir o personagem.");
  }
}

// Função para adicionar um personagem
async function addCharacter(newCharacter) {
  try {
    // Chama a função do API para adicionar um personagem
    await window.api.addCharacter(newCharacter);
  } catch (error) {
    console.error("Erro ao adicionar o personagem:", error);
    alert("Erro ao adicionar o personagem.");
  }
}

function generateUniqueId(characterName, playerName) {
  const data = `${characterName}-${playerName}-${Date.now()}`;
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Converte para um número de 32 bits
  }
  return Math.abs(hash).toString(); // Retorna o hash como string positiva
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
      const id = generateUniqueId(
        document.getElementById('characterName').value,
        document.getElementById('playerName').value
      );

      if (playerName && characterName && imageFile) {
        const reader = new FileReader(); // Usado para converter a imagem em base64

        reader.onload = function(e) {
          // A imagem foi convertida para base64
          const newCharacter = {
            playerName,
            characterName,
            image: e.target.result, // A imagem em formato base64
            initiative: initiative || 0,
            id,
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
        alert("Os campos: Nome do Jogador, Nome do Personagem e Imagem são obrigatórios.");
      }
    });
  }
});

document.getElementById('return-to-menu-btn').addEventListener('click', () => {
    window.location.href = 'index.html';
});
