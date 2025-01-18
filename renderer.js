const characters = [
    { name: "Personagem 1", initiative: 18, image: "https://imgcdn.stablediffusionweb.com/2024/9/5/cd39e483-c51c-46a2-a635-28a196d591e4.jpg" },
    { name: "Personagem 2", initiative: 15, image: "https://i.pinimg.com/736x/36/fe/58/36fe58df9a64d54546568d093035da6a.jpg" },
    { name: "Personagem 3", initiative: 20, image: "https://i.pinimg.com/originals/7f/22/b0/7f22b01a45ba4276451379ce7dbef9d6.png" },
  ];
  
  let currentTurn = 0;

  // Carregar os personagens
  function loadCharacters() {
    const container = document.getElementById("character-container");
    container.innerHTML = ""; // Limpa o conteúdo antes de redesenhar
  
    characters.forEach((char, index) => {
      const charDiv = document.createElement("div");
      charDiv.className = `character ${index === currentTurn ? "current" : ""}`;
      charDiv.innerHTML = `
        <img src="${char.image}" alt="${char.name}">
        <p>${char.name}</p>
        <p>Iniciativa: ${char.initiative}</p>
      `;
      container.appendChild(charDiv);
    });
  }
  
  // Avançar para o próximo turno
  document.getElementById("next-btn").addEventListener("click", () => {
    currentTurn = (currentTurn + 1) % characters.length; // Cicla os turnos
    loadCharacters();
  });
  
  // Inicializar
  loadCharacters();
  