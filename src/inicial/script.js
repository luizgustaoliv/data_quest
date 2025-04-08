// Função para carregar o CSS dinamicamente
function carregarCSS() {
  // Ocultar o corpo inicialmente
  document.body.style.visibility = "hidden";

  // Contador para rastrear carregamentos de CSS
  let cssCarregados = 0;
  const totalCSS = 2;

  // Função para verificar se todos os CSS foram carregados
  function verificarCarregamento() {
    cssCarregados++;
    if (cssCarregados >= totalCSS) {
      // Todos os CSS foram carregados, mostrar o conteúdo
      document.body.style.visibility = "visible";
    }
  }

  // Adicionar o CSS principal com evento de carregamento
  const linkCSS = document.createElement("link");
  linkCSS.rel = "stylesheet";
  linkCSS.href = "assets/telainicial/style.css";
  linkCSS.onload = verificarCarregamento;
  document.head.appendChild(linkCSS);

  // Adicionar a fonte do Google com evento de carregamento
  const fontLink = document.createElement("link");
  fontLink.rel = "stylesheet";
  fontLink.href =
    "https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap";
  fontLink.onload = verificarCarregamento;
  document.head.appendChild(fontLink);

  // Backup: Se os CSS não carregarem em 1 segundo, mostrar o conteúdo de qualquer forma
  setTimeout(() => {
    document.body.style.visibility = "visible";
  }, 1000);
}

// Função para criar o logo DATA QUEST com JavaScript
function createDataQuestLogo(parentElement) {
  // Criar o container principal
  const logoContainer = document.createElement("div");
  logoContainer.className = "logo-container";
  logoContainer.style.cssText = `
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    font-family: Arial, sans-serif;
  `;

  // Criar o texto "DATA"
  const dataText = document.createElement("div");
  dataText.className = "data";
  dataText.textContent = "DATA";
  dataText.style.cssText = `
    font-size: 80px;
    font-weight: bold;
    color:rgb(15, 183, 255);
    text-shadow: 
      0 0 10px rgba(0, 245, 245, 0.8),
      0 0 20px rgba(0, 245, 245, 0.5);
    letter-spacing: 2px;
    -webkit-text-stroke: 0.5px black;
  `;
  
  // Criar o texto "QUEST"
  const questText = document.createElement("div");
  questText.className = "quest";
  questText.textContent = "QUEST";
  questText.style.cssText = `
    font-size: 80px;
    font-weight: bold;
    color: #ffb700;
    text-shadow: 
      0 0 10px rgba(255, 183, 0, 0.8),
      0 0 20px rgba(255, 183, 0, 0.5);
    letter-spacing: 2px;
    -webkit-text-stroke: 0.5px black;
  `;
  
  // Montar a estrutura
  logoContainer.appendChild(dataText);
  logoContainer.appendChild(questText);
  
  // Adicionar ao elemento pai fornecido ou ao body se nenhum for fornecido
  (parentElement || document.body).appendChild(logoContainer);
  
  return logoContainer; // Retorna o elemento criado para possíveis manipulações futuras
}


// Com:
const logo = createDataQuestLogo();
logo.className = "logo"; // Adicionar a classe "logo" ao container

// Função para criar um botão estilizado
function criarBotaoEstilizado(texto, id, className) {
  // Container do botão
  const buttonContainer = document.createElement("div");
  buttonContainer.id = id;
  buttonContainer.className = `game-button ${className}`;
  
  // Camada externa do botão
  const buttonOuter = document.createElement("div");
  buttonOuter.className = "button-outer";
  
  // Camada interna do botão
  const buttonInner = document.createElement("div");
  buttonInner.className = "button-inner";
  
  // Texto do botão
  const buttonText = document.createElement("div");
  buttonText.className = "button-text";
  buttonText.textContent = texto;
  
  // Montar a estrutura
  buttonInner.appendChild(buttonText);
  buttonContainer.appendChild(buttonOuter);
  buttonContainer.appendChild(buttonInner);
  
  return buttonContainer;
}

// Função para criar todos os elementos da interface
function criarInterface() {
  // Adiciona estilos CSS para os botões
  const styleElement = document.createElement("style");
  styleElement.textContent = `
    .game-button {
      position: relative;
      width: 250px;
      height: 60px;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      margin-bottom: 20px;
    }

    .button-outer {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: #00979b;
      border-radius: 15px;
      z-index: 1;
    }

    .button-inner {
      position: absolute;
      top: 4px;
      left: 4px;
      right: 4px;
      bottom: 4px;
      background-color: #062b35;
      border-radius: 12px;
      z-index: 2;
      display: flex;
      justify-content: center;
      align-items: center;
      border: 2px solid #00bcbc;
    }

    .button-text {
      font-family: 'Press Start 2P', cursive;
      color: #00fff2;
      font-size: 26px;
      font-weight: bold;
      text-shadow: 0 0 8px rgba(0, 255, 242, 0.7);
      letter-spacing: 1px;
      z-index: 3;
    }

     .game-button.botaocomojogar .button-text {
      font-size: 20px;
      }

      font-size: 2px;
    }

    .game-button:hover .button-outer {
      background-color: #00b8bd;
    }

    .game-button:hover .button-inner {
      background-color: #073845;
      border-color: #00dede;
    }

    .game-button:hover .button-text {
      color: #00fffa;
      text-shadow: 0 0 12px rgba(0, 255, 242, 0.9);
    }

    .game-button:active .button-inner {
      transform: scale(0.98);
    }
  `;
  document.head.appendChild(styleElement);

  // Container do título com a logo
  const title = document.createElement("div");
  title.className = "title";

  // Assumindo que logo já foi definido em outro lugar do código
  // Se não, precisaria adicionar a criação do logo aqui
  title.appendChild(logo);
  document.body.appendChild(title);

  // Container dos botões
  const botoes = document.createElement("div");
  botoes.className = "botoes";

  // Botão Jogar - usando a nova função
  const botaoJogar = criarBotaoEstilizado("START", "botaoJogar", "botaojogar");

  // Botão Como Jogar - usando a nova função
  const botaoComoJogar = criarBotaoEstilizado("COMO JOGAR", "botaocomojogar", "botaocomojogar");

  // Botão Sobre - usando a nova função
  const botaoSobre = criarBotaoEstilizado("SOBRE", "botaosobre", "botaosobre");

  // Adiciona os botões ao container
  botoes.appendChild(botaoJogar);
  botoes.appendChild(botaoComoJogar);
  botoes.appendChild(botaoSobre);
  document.body.appendChild(botoes);

  // Popup Como Jogar
  const popupComoJogar = document.createElement("div");
  popupComoJogar.id = "popup-como-jogar";
  popupComoJogar.className = "popup";
  popupComoJogar.style.zIndex = "2000";

  const popupContentComo = document.createElement("div");
  popupContentComo.className = "popup-content";

  const closeSpanComo = document.createElement("span");
  closeSpanComo.className = "close";
  closeSpanComo.innerHTML = "&times;";

  const h2Como = document.createElement("h2");
  h2Como.textContent = "Como Jogar";

  const pComo = document.createElement("p");
  pComo.textContent = "Use as setas ou 'WASD' para mover";

  // Controles
  const controlsDiv = document.createElement("div");
  controlsDiv.className = "controls";

  // Seção WASD
  const wasdDiv = document.createElement("div");
  wasdDiv.className = "wasd";

  const keyW = document.createElement("div");
  keyW.className = "key";
  keyW.id = "key-w";
  keyW.textContent = "W";

  const rowWasd = document.createElement("div");
  rowWasd.className = "row";

  const keyA = document.createElement("div");
  keyA.className = "key";
  keyA.id = "key-a";
  keyA.textContent = "A";

  const keyS = document.createElement("div");
  keyS.className = "key";
  keyS.id = "key-s";
  keyS.textContent = "S";

  const keyD = document.createElement("div");
  keyD.className = "key";
  keyD.id = "key-d";
  keyD.textContent = "D";

  rowWasd.appendChild(keyA);
  rowWasd.appendChild(keyS);
  rowWasd.appendChild(keyD);

  wasdDiv.appendChild(keyW);
  wasdDiv.appendChild(rowWasd);

  // Seção das setas
  const arrowsDiv = document.createElement("div");
  arrowsDiv.className = "arrows";

  const keyUp = document.createElement("div");
  keyUp.className = "key";
  keyUp.id = "key-up";
  keyUp.innerHTML = "↑";

  const rowArrows = document.createElement("div");
  rowArrows.className = "row";

  const keyLeft = document.createElement("div");
  keyLeft.className = "key";
  keyLeft.id = "key-left";
  keyLeft.innerHTML = "←";

  const keyDown = document.createElement("div");
  keyDown.className = "key";
  keyDown.id = "key-down";
  keyDown.innerHTML = "↓";

  const keyRight = document.createElement("div");
  keyRight.className = "key";
  keyRight.id = "key-right";
  keyRight.innerHTML = "→";

  rowArrows.appendChild(keyLeft);
  rowArrows.appendChild(keyDown);
  rowArrows.appendChild(keyRight);

  arrowsDiv.appendChild(keyUp);
  arrowsDiv.appendChild(rowArrows);

  controlsDiv.appendChild(wasdDiv);
  controlsDiv.appendChild(arrowsDiv);

  // Seção de Interações
  const h2Interacao = document.createElement("h2");
  h2Interacao.textContent = "Interações";

  const interactionContainer = document.createElement("div");
  interactionContainer.className = "interaction-container";

  // Item 1
  const interactionItem1 = document.createElement("div");
  interactionItem1.className = "interaction-item";

  const p1 = document.createElement("p");
  p1.innerHTML = "Pressione <b>E</b><br>para NPCs";

  const interaction1 = document.createElement("div");
  interaction1.className = "interaction";

  const keyE = document.createElement("div");
  keyE.className = "key";
  keyE.id = "key-e";
  keyE.textContent = "E";

  interaction1.appendChild(keyE);
  interactionItem1.appendChild(p1);
  interactionItem1.appendChild(interaction1);

  // Item 2
  const interactionItem2 = document.createElement("div");
  interactionItem2.className = "interaction-item";

  const p2 = document.createElement("p");
  p2.innerHTML = "Pressione <b>ESPAÇO</b><br>para portas";

  const interaction2 = document.createElement("div");
  interaction2.className = "interaction";

  const keySpace = document.createElement("div");
  keySpace.className = "key";
  keySpace.id = "key-space";
  keySpace.textContent = "SPC";

  interaction2.appendChild(keySpace);
  interactionItem2.appendChild(p2);
  interactionItem2.appendChild(interaction2);

  interactionContainer.appendChild(interactionItem1);
  interactionContainer.appendChild(interactionItem2);

  // Montagem do popup Como Jogar
  popupContentComo.appendChild(closeSpanComo);
  popupContentComo.appendChild(h2Como);
  popupContentComo.appendChild(pComo);
  popupContentComo.appendChild(controlsDiv);
  popupContentComo.appendChild(h2Interacao);
  popupContentComo.appendChild(interactionContainer);

  popupComoJogar.appendChild(popupContentComo);
  document.body.appendChild(popupComoJogar);

  // Popup Sobre
  const popupSobre = document.createElement("div");
  popupSobre.id = "popup-sobre";
  popupSobre.className = "popup";
  popupSobre.style.zIndex = "2000";

  const popupContentSobre = document.createElement("div");
  popupContentSobre.className = "popup-content";

  const closeSpanSobre = document.createElement("span");
  closeSpanSobre.className = "close";
  closeSpanSobre.innerHTML = "&times;";

  const h2Sobre = document.createElement("h2");
  h2Sobre.textContent = "Sobre o Jogo";

  const pSobre = document.createElement("p");
  pSobre.innerHTML =
    "Jogo criado em parceria com a <b>Google for Education</b>";

  const h3Desenvolvedores = document.createElement("h3");
  h3Desenvolvedores.textContent = "Desenvolvedores:";

  const pDesenvolvedores = document.createElement("p");
  pDesenvolvedores.textContent =
    "André Katz, Celso Rocha, Daniel Meiches, Kaian Santos, Luiz Fernando, Miguel Almeida, Wendel Feitosa";

  // Montagem do popup Sobre
  popupContentSobre.appendChild(closeSpanSobre);
  popupContentSobre.appendChild(h2Sobre);
  popupContentSobre.appendChild(pSobre);
  popupContentSobre.appendChild(h3Desenvolvedores);
  popupContentSobre.appendChild(pDesenvolvedores);

  popupSobre.appendChild(popupContentSobre);
  document.body.appendChild(popupSobre);
  
  // Adiciona os event listeners para os botões
  botaoComoJogar.addEventListener('click', () => {
    popupComoJogar.style.display = 'flex';
  });
  
  botaoSobre.addEventListener('click', () => {
    popupSobre.style.display = 'flex';
  });
  
  // Event listeners para fechar os popups
  closeSpanComo.addEventListener('click', () => {
    popupComoJogar.style.display = 'none';
  });
  
  closeSpanSobre.addEventListener('click', () => {
    popupSobre.style.display = 'none';
  });
}


// Função para inicializar o jogo após decisão de áudio
function inicializarJogo() {
  carregarCSS();
  criarInterface();
  configurarEventos();
  animarTeclas();
  animarTeclaE();
  animarTeclaInteracao();
}

// Função para criar botão estilizado (base)
function createStyledButton(text, className) {
  // Criar o container do botão
  const buttonContainer = document.createElement("div");
  buttonContainer.className = className;
  buttonContainer.style.cssText = `
    position: relative;
    display: inline-block;
    cursor: pointer;
    margin: 10px;
  `;
  
  // Criar a borda externa do botão
  const outerBorder = document.createElement("div");
  outerBorder.className = "outer-border";
  outerBorder.style.cssText = `
    position: absolute;
    top: -3px;
    left: -3px;
    right: -3px;
    bottom: -3px;
    background: #00b3b3;
    border-radius: 12px;
    box-shadow: 0 0 8px #00ffff;
  `;
  
  // Criar o botão principal
  const button = document.createElement("div");
  button.className = "styled-button";
  button.style.cssText = `
    position: relative;
    padding: 15px 100px;
    font-family: 'Press Start 2P', Arial, sans-serif;
    background-color: #061a1f;
    border: 2px solid #00c4c4;
    border-radius: 8px;
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: 0 0 10px rgba(0, 255, 255, 0.5) inset;
    z-index: 1;
  `;
  
  // Criar o texto do botão
  const buttonText = document.createElement("div");
  buttonText.className = "button-text";
  buttonText.textContent = text;
  buttonText.style.cssText = `
    font-family: 'Press Start 2P', Arial, sans-serif;
    font-size: 24px;
    font-weight: bold;
    color: #00ffdd;
    text-shadow: 0 0 10px rgba(0, 255, 255, 0.8);
    letter-spacing: 2px;
  `;
  
  // Adicionar efeito hover
  buttonContainer.addEventListener('mouseenter', () => {
    button.style.backgroundColor = '#082a30';
    buttonText.style.color = '#00fff0';
    buttonText.style.fontFamily = "'Press Start 2P', cursive";
    buttonText.style.textShadow = '0 0 15px rgba(0, 255, 255, 1)';
    outerBorder.style.boxShadow = '0 0 12px #00ffff';
  });
  
  buttonContainer.addEventListener('mouseleave', () => {
    button.style.backgroundColor = '#061a1f';
    buttonText.style.color = '#00ffdd';
    buttonText.style.fontFamily = "'Press Start 2P', cursive";
    buttonText.style.textShadow = '0 0 10px rgba(0, 255, 255, 0.8)';
    outerBorder.style.boxShadow = '0 0 8px #00ffff';
  });
  
  // Adicionar efeito de clique
  buttonContainer.addEventListener('mousedown', () => {
    button.style.transform = 'scale(0.98)';
    button.style.boxShadow = '0 0 5px rgba(0, 255, 255, 0.5) inset';
  });
  
  buttonContainer.addEventListener('mouseup', () => {
    button.style.transform = 'scale(1)';
    button.style.boxShadow = '0 0 10px rgba(0, 255, 255, 0.5) inset';
  });
  
  // Montar a estrutura
  button.appendChild(buttonText);
  buttonContainer.appendChild(outerBorder);
  buttonContainer.appendChild(button);
  
  return buttonContainer;
}

// Funções específicas para cada botão
function createJogarButton() {
  return createStyledButton("JOGAR", "jogar-button");
}

function createComoJogarButton() {
  return createStyledButton("COMO JOGAR", "como-jogar-button");
}

function createSobreButton() {
  return createStyledButton("SOBRE", "sobre-button");
}

// Configuração dos eventos
function configurarEventos() {
  // Nota: Você precisa modificar a função criarInterface() para usar os novos botões estilizados
  // em vez das imagens. Exemplo:
  // const botaoJogar = createJogarButton();
  // botaoJogar.id = "botaoJogar";
  // botoes.appendChild(botaoJogar);

  const botaoJogar = document.getElementById("botaoJogar");
  const botaoComoJogar = document.getElementById("botaocomojogar");
  const botaoSobre = document.getElementById("botaosobre");
  const closeSpanComo = document.querySelector("#popup-como-jogar .close");
  const closeSpanSobre = document.querySelector("#popup-sobre .close");

  if (botaoJogar) {
    botaoJogar.addEventListener("click", function () {

      setTimeout(() => {
        document.body.innerHTML = '<div id="game-container"></div>';
        document.body.classList.remove("zoom-effect");
        document.body.style.margin = "0";
        document.body.style.padding = "0";
        document.body.style.overflow = "hidden";

        carregarScriptFases(); // Chama a função para carregar o script de fases
      }, 200);
    });
  }

  if (closeSpanComo) {
    closeSpanComo.addEventListener("click", fecharPopup);
  }

  if (closeSpanSobre) {
    closeSpanSobre.addEventListener("click", fecharPopupSobre);
  }
}

// Funções existentes do script original
function selecionarFase(fase) {
  alert("Você selecionou a Fase " + fase);
}

function abrirPopup() {
  document.getElementById("popup-como-jogar").style.display = "flex";
}

function animarTeclas() {
  let keys = [
    "key-w",
    "key-a",
    "key-s",
    "key-d",
    "key-up",
    "key-left",
    "key-down",
    "key-right",
  ];
  let i = 0;

  const intervalId = setInterval(() => {
    // Verificar se ainda existem os elementos antes de manipulá-los
    if (!document.getElementById(keys[0])) {
      // Se os elementos não existirem mais, parar o intervalo
      clearInterval(intervalId);
      return;
    }

    keys.forEach((key) => {
      const element = document.getElementById(key);
      if (element) {
        element.classList.remove("animate");
      }
    });

    const currentElement = document.getElementById(keys[i]);
    if (currentElement) {
      currentElement.classList.add("animate");
    }

    i = (i + 1) % keys.length;
  }, 500);
}

function animarTeclaE() {
  let key = document.getElementById("key-e");
  setInterval(() => {
    key.classList.toggle("animate");
  }, 500);
}

function animarTeclaInteracao() {
  let interactionKeys = ["key-e", "key-space"];
  let j = 0;

  const intervalId = setInterval(() => {
    // Verificar se os elementos ainda existem
    if (
      !document.getElementById(interactionKeys[0]) &&
      !document.getElementById(interactionKeys[1])
    ) {
      clearInterval(intervalId);
      return;
    }

    interactionKeys.forEach((key) => {
      const keyElement = document.getElementById(key);
      if (keyElement) {
        keyElement.classList.remove("animate");
      }
    });

    const currentElement = document.getElementById(interactionKeys[j]);
    if (currentElement) {
      currentElement.classList.add("animate");
    }

    j = (j + 1) % interactionKeys.length;
  }, 1500);
}

function fecharPopup() {
  document.getElementById("popup-como-jogar").style.display = "none";
}

function fecharPopupSobre() {
  document.getElementById("popup-sobre").style.display = "none";
}

function abrirPopupSobre() {
  document.getElementById("popup-sobre").style.display = "block";
}

// Função para carregar o script de fases dinamicamente
function carregarScriptFases() {
  const script = document.createElement("script");
  script.src = "src/teladefases/fases.js";
  script.type = "module"; // Adiciona o tipo de módulo para permitir importações

  script.onerror = function () {
    console.error("Erro ao carregar o script de fases.");
    alert("Não foi possível carregar a tela de fases. Tente novamente.");
    location.reload();
  };

  script.onload = function () {
    console.log("Script de fases carregado com sucesso!");
    if (typeof construirPagina === "function") {
      construirPagina();
    } else {
      console.error("Função construirPagina não encontrada");
    }
  };

  document.head.appendChild(script);
}

// Modificar inicialização da página
document.addEventListener("DOMContentLoaded", function () {
  // Carregamos os sons primeiro (mas não reproduzimos ainda)
  inicializarSons();

  // Mostrar tela de permissão de áudio em vez de inicializar diretamente
  mostrarTelaPermissaoAudio();
});
