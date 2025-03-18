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

// Função para criar todos os elementos da interface
function criarInterface() {
  // Container do título com a logo
  const title = document.createElement("div");
  title.className = "title";

  const logo = document.createElement("img");
  logo.className = "logo";
  logo.src = "assets/loading/logo_data_quest.png";

  title.appendChild(logo);
  document.body.appendChild(title);

  // Container dos botões
  const botoes = document.createElement("div");
  botoes.className = "botoes";

  // Botão Jogar
  const botaoJogar = document.createElement("img");
  botaoJogar.id = "botaoJogar";
  botaoJogar.className = "botaojogar";
  botaoJogar.src = "assets/telainicial/botoes/botaostart.png";
  botaoJogar.alt = "Jogar";

  // Botão Como Jogar
  const botaoComoJogar = document.createElement("img");
  botaoComoJogar.id = "botaocomojogar";
  botaoComoJogar.className = "botaocomojogar";
  botaoComoJogar.src = "assets/telainicial/botoes/comojogar.png";
  botaoComoJogar.alt = "comojogar";

  // Botão Sobre
  const botaoSobre = document.createElement("img");
  botaoSobre.id = "botaosobre";
  botaoSobre.className = "botaosobre";
  botaoSobre.src = "assets/telainicial/botoes/botaosobre.png";
  botaoSobre.alt = "Sobre";

  // Adiciona os botões ao container
  botoes.appendChild(botaoJogar);
  botoes.appendChild(botaoComoJogar);
  botoes.appendChild(botaoSobre);
  document.body.appendChild(botoes);

  // Popup Como Jogar
  const popupComoJogar = document.createElement("div");
  popupComoJogar.id = "popup-como-jogar";
  popupComoJogar.className = "popup";

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
    "André Katz, Celso Rocha, Daniel Meiches, Kaian Santos, Luiz Fernando, Miguel Almeida, Wendel";

  // Montagem do popup Sobre
  popupContentSobre.appendChild(closeSpanSobre);
  popupContentSobre.appendChild(h2Sobre);
  popupContentSobre.appendChild(pSobre);
  popupContentSobre.appendChild(h3Desenvolvedores);
  popupContentSobre.appendChild(pDesenvolvedores);

  popupSobre.appendChild(popupContentSobre);
  document.body.appendChild(popupSobre);
}

// Configuração dos eventos
function configurarEventos() {
  const botaoJogar = document.getElementById("botaoJogar");
  const botaoComoJogar = document.getElementById("botaocomojogar");
  const botaoSobre = document.getElementById("botaosobre");
  const closeSpanComo = document.querySelector("#popup-como-jogar .close");
  const closeSpanSobre = document.querySelector("#popup-sobre .close");

  if (botaoJogar) {
    botaoJogar.addEventListener("click", function () {
      document.body.classList.add("zoom-effect");

      setTimeout(() => {
        document.body.innerHTML = '<div id="game-container"></div>';
        document.body.classList.remove("zoom-effect");
        document.body.style.margin = "0";
        document.body.style.padding = "0";
        document.body.style.overflow = "hidden";

        carregarScriptFases(); // Chama a função para carregar o script de fases
      }, 1800);
    });

    botaoJogar.addEventListener("mousedown", function () {
      this.src = "assets/telainicial/botoes/botaostartpress.png";
    });

    botaoJogar.addEventListener("mouseup", function () {
      this.src = "assets/telainicial/botoes/botaostart.png";
    });
  }

  if (botaoComoJogar) {
    botaoComoJogar.addEventListener("click", abrirPopup);

    botaoComoJogar.addEventListener("mousedown", function () {
      this.src = "assets/telainicial/botoes/comojogarpress.png";
    });

    botaoComoJogar.addEventListener("mouseup", function () {
      this.src = "assets/telainicial/botoes/comojogar.png";
    });
  }

  if (botaoSobre) {
    botaoSobre.addEventListener("click", abrirPopupSobre);

    botaoSobre.addEventListener("mousedown", function () {
      this.src = "assets/telainicial/botoes/botaosobrepress.png";
    });

    botaoSobre.addEventListener("mouseup", function () {
      this.src = "assets/telainicial/botoes/botaosobre.png";
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

// Inicializar a página quando o documento estiver completamente carregado
document.addEventListener("DOMContentLoaded", function () {
  carregarCSS();
  criarInterface();
  configurarEventos();
  animarTeclas();
  animarTeclaE();
  animarTeclaInteracao();
});
