// Mock de dados - substituir pelos personagens reais carregados
let characters = [];

// Índice do personagem atual
let currentCharacterIndex = 0;

// Função para carregar os personagens do armazenamento (ou servidor)
async function loadCharactersForEncounter() {
  try {
    characters = await window.api.loadCharacters();

    // Ordenar os personagens por iniciativa (decrescente)
    characters.sort((a, b) => b.initiative - a.initiative);

    // Exibir os personagens
    renderCharacters();
  } catch (error) {
    console.error("Erro ao carregar os personagens para o encontro:", error);
    alert("Ocorreu um erro ao carregar os personagens.");
  }
}

// Função para renderizar os personagens na tela
function renderCharacters() {
  // Renderizar o personagem da vez
  const currentContainer = document.getElementById('current-character');
  const currentCharacter = characters[currentCharacterIndex];
  currentContainer.innerHTML = `
    <div class="character-card highlight">
      <img src="${currentCharacter.image}" alt="${currentCharacter.characterName}" class="character-image-large">
      <div class="character-info">
        <h3>${currentCharacter.characterName}</h3>
        <p>Jogador: ${currentCharacter.playerName}</p>
        <p>Iniciativa: ${currentCharacter.initiative}</p>
      </div>
    </div>
  `;

  // Renderizar os outros personagens
  const container = document.getElementById('character-container');
  container.innerHTML = '';

  characters.forEach((character, index) => {
    if (index !== currentCharacterIndex) {
      const card = document.createElement('div');
      card.className = 'character-card small';

      card.innerHTML = `
        <div class="small-card-content">
          <img src="${character.image}" alt="${character.characterName}" class="character-image-small">
          <div class="character-details">
            <strong>${character.characterName}</strong>
            <span>Jogador: ${character.playerName}</span>
            <span>Iniciativa: ${character.initiative}</span>
          </div>
        </div>
      `;
      container.appendChild(card);
    }
  });
}

// Função para avançar para o próximo turno
function nextTurn() {
    currentCharacterIndex = (currentCharacterIndex + 1) % characters.length;
    renderCharacters();
}

// Função para voltar para o turno anterior
function previousTurn() {
    currentCharacterIndex = (currentCharacterIndex - 1 + characters.length) % characters.length;
    renderCharacters();
}

// Adicionar evento para o botão "Próximo Turno" e "Turno Anterior"
document.getElementById('next-turn-btn').addEventListener('click', nextTurn);
document.getElementById('previous-turn-btn').addEventListener('click', previousTurn);

// Carregar os personagens ao carregar a página
document.addEventListener('DOMContentLoaded', loadCharactersForEncounter);
