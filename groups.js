const selectedCharacters = []; // Lista para armazenar os personagens selecionados

// Função para carregar os personagens do ElectronStore
async function loadCharacters() {
  try {
    const characters = await window.api.loadCharacters(); // Assume que a API do ElectronStore está disponível aqui
    characters.sort((a, b) => a.characterName.localeCompare(b.characterName)); // Ordena os personagens por nome

    if (characters && characters.length > 0) {
      renderCharacters(characters); // Renderiza os personagens na tela
    } else {
      document.getElementById('character-list').innerHTML = "<p>Nenhum personagem encontrado.</p>"; // Exibe mensagem se não houver personagens
    }
  } catch (error) {
    console.error("Erro ao carregar os personagens:", error);
    alert("Ocorreu um erro ao carregar os personagens.");
  }
}

// Função para renderizar os personagens na tela
function renderCharacters(characters) {
  const container = document.getElementById('character-list');
  container.innerHTML = ''; // Limpa a lista antes de renderizar novamente

  characters.forEach(character => {
    const card = document.createElement('div');
    card.classList.add('character-card');

    card.innerHTML = `
      <div class="character-info">
        <img src="${character.image}" alt="image">
        <div>
          <span><strong>${character.characterName}</strong></span>
          <span>${character.playerName}</span>
        </div>
      </div>
      <input type="checkbox" class="character-checkbox" data-id="${character.characterName + character.playerName}" data-character='${JSON.stringify(character)}'>
    `;

    container.appendChild(card);
  });

  // Adiciona evento para capturar seleção de personagens
  container.addEventListener('change', function (event) {
    if (event.target.classList.contains('character-checkbox')) {
      const character = JSON.parse(event.target.getAttribute('data-character')); // Obtém o objeto completo do personagem

      if (event.target.checked) {
        selectedCharacters.push(character); // Adiciona o personagem completo na lista
      } else {
        const index = selectedCharacters.findIndex(selected => selected.characterName + selected.playerName === character.characterName + character.playerName);
        if (index > -1) {
          selectedCharacters.splice(index, 1); // Remove o personagem da lista
        }
      }
      console.log(selectedCharacters); // Verifica o array de personagens selecionados
    }
  });
}

// Evento para iniciar o encontro com os personagens selecionados
document.getElementById('start-encounter-btn').addEventListener('click', async function () {
  if (selectedCharacters.length > 1) {
    try {
      // Armazena os personagens selecionados no Electron Store
      await window.api.saveSelectedCharacters(selectedCharacters);
      console.log(selectedCharacters); // Exibe os personagens selecionados no console

      // Redireciona para a tela de encontros
      window.location.href = "encounters.html";
    } catch (error) {
      console.error("Erro ao salvar os personagens selecionados:", error);
      alert("Ocorreu um erro ao salvar os personagens. Tente novamente.");
    }
  } else {
    alert('Selecione pelo menos dois personagens!'); // Alerta caso menos de dois personagens sejam selecionados
  }
});

// Evento para voltar ao menu
document.getElementById("return-to-menu-btn").addEventListener("click", () => {
  window.location.href = "index.html"; // Redireciona para o menu
});

// Carrega os personagens ao carregar a página
document.addEventListener('DOMContentLoaded', loadCharacters);
