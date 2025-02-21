// Mock de dados - substituir pelos personagens reais carregados
let characters = [];

// Índice do personagem atual
let currentCharacterIndex = 0;

// Contador de rodadas
let currentRound = 1;

// Função para carregar os personagens do armazenamento (ou servidor)
async function loadCharactersForEncounter() {
    try {
      // Carregar os personagens salvos no ElectronStore (certifique-se de que são objetos e não strings)
      if(characters.length === 0) {
        characters = await window.api.loadSelectedCharacters();
        // console.log("FIRST LOAD", characters); // Exibe os objetos de personagens
      }

      // Se os dados carregados estiverem em formato string, converta de volta para objetos
      // (se necessário, dependendo de como você os salvou)
      if (typeof characters[0] === 'string') {
        characters = characters.map(character => JSON.parse(character));
      }

      // Ordenar os personagens por iniciativa (decrescente)
      characters.sort((a, b) => b.initiative - a.initiative);
      // console.log("SORTED LOAD", characters); // Exibe os objetos ordenados

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
        <h2>${currentCharacter.characterName}</h2>
        <h3>Iniciativa: ${currentCharacter.initiative}</h3>
        <span>Jogador: ${currentCharacter.playerName}</span>
      </div>
    </div>
  `;

  // Renderizar os outros personagens
  const container = document.getElementById('character-container');
  container.innerHTML = '';

  characters.forEach((character, index) => {
    if (index !== currentCharacterIndex) {
      const card = document.createElement('div');
      card.className = index === 1 ? 'character-card small-dark' : 'character-card small';

      card.innerHTML = `
        <div class="small-card-content">
          <img src="${character.image}" alt="${character.characterName}" class="character-image-small">
          <div class="character-details">
            <h2>${character.characterName}</h2>
          </div>
          <div class="character-details-initiative">
            <h2>${character.initiative}</h2>
          </div>
        </div>
      `;
      container.appendChild(card);
    }
  });

  // Atualiza o contador de rodadas
  updateRoundCounter();
}

// Função para avançar para o próximo turno
async function nextTurn() {
  currentCharacterIndex = (currentCharacterIndex + 1) % characters.length;
  renderCharacters();

  // Se todos os turnos foram feitos, incrementa a rodada
  if (currentCharacterIndex === 0) {
    currentRound++;
    updateRoundCounter(); // Atualiza o contador de rodadas
  }
}

// Função para voltar para o turno anterior
function previousTurn() {
  // Verifica se estamos no primeiro turno da rodada
  if (currentCharacterIndex === 0 && currentRound > 1) {
    currentRound--; // Diminui a rodada se for o primeiro turno
    updateRoundCounter(); // Atualiza o contador de rodadas
  }

  // Move para o turno anterior
  currentCharacterIndex = (currentCharacterIndex - 1 + characters.length) % characters.length;
  renderCharacters();
}

// Atualizar o contador de rodadas na tela
function updateRoundCounter() {
  document.getElementById('round-counter').textContent = `Rodada: ${currentRound}`;
}

function editInitiative(){
      // Abrir o modal para edição de initiative
      const modal = document.getElementById('initiative-edit-modal');
      const saveBtn = document.getElementById('save-initiative-btn');
      const modalContent = document.getElementById('modal-content');

      // Preencher o modal com inputs para editar a initiative de cada personagem
      modalContent.innerHTML = ''; // Limpa o conteúdo do modal
      characters.forEach((character, index) => {
        const characterRow = document.createElement('div');
        characterRow.className = 'character-row';

        const nameLabel = document.createElement('span');
        nameLabel.textContent = character.characterName;
        nameLabel.className = 'character-name';

        const initiativeInput = document.createElement('input');
        initiativeInput.type = 'number';
        initiativeInput.value = character.initiative;
        initiativeInput.className = 'initiative-input';
        initiativeInput.dataset.index = index;

        characterRow.appendChild(nameLabel);
        characterRow.appendChild(initiativeInput);
        modalContent.appendChild(characterRow);
      });

      // Exibir o modal
      modal.style.display = 'flex';

      // Aguardar o clique no botão salvar
      return new Promise((resolve, reject) => {
        saveBtn.onclick = () => {
          try {
            console.log("SAVE", characters);
            // Salvar as iniciativas atualizadas
            const inputs = document.querySelectorAll('.initiative-input');
            inputs.forEach(async input => {
              const index = input.dataset.index;
              characters[index].initiative = parseInt(input.value, 10);
              // await window.api.editCharacter(index, characters[index]);
            });
            console.log("AFTER SAVE", characters);
            loadCharactersForEncounter();

            // Fechar o modal
            modal.style.display = 'none';
            resolve();
          } catch (error) {
            console.error("Erro ao salvar iniciativas:", error);
            alert("Erro ao salvar iniciativas. Tente novamente.");
            reject(error);
          }
        };
      });
}

// Adicionar evento para o botão "Próximo Turno" e "Turno Anterior"
document.getElementById('next-turn-btn').addEventListener('click', nextTurn);
document.getElementById('previous-turn-btn').addEventListener('click', previousTurn);

document.getElementById('return-to-menu-btn').addEventListener('click', () => {
    window.location.href = 'index.html';
});
document.getElementById('config-btn-btn').addEventListener('click', editInitiative);

// Carregar os personagens ao carregar a página
document.addEventListener('DOMContentLoaded', loadCharactersForEncounter);
