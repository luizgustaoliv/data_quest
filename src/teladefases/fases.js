// Não é possível usar import diretamente em scripts carregados dinamicamente
// Vamos utilizar classes CSS para estilização em vez de estilos inline

// Injetar estilos críticos diretamente para evitar FOUC (Flash of Unstyled Content)
(function() {
  // Adicionar loader de tela cheia primeiro
  const styleLoader = document.createElement('style');
  styleLoader.textContent = `
    #loading-screen {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: #102040;
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 9999;
      transition: opacity 0.5s ease;
    }
    
    .spinner {
      width: 60px;
      height: 60px;
      border: 5px solid rgba(255, 255, 255, 0.2);
      border-radius: 50%;
      border-top-color: #3d6cb9;
      animation: spin 1s ease-in-out infinite;
    }
    
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    
    /* Estilos críticos para evitar flash de conteúdo não estilizado */
    body {
      background-color: #0a1525;
      margin: 0;
      font-family: Arial, sans-serif;
      color: white;
      overflow: hidden;
    }
    
    #game-container {
      position: relative;
      width: 100vw;
      height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: opacity 0.5s ease;
    }
    
    .background-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(rgba(0, 0, 20, 0.6), rgba(0, 0, 60, 0.8));
      z-index: 1;
    }
    
    #background-image-container {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-image: url('assets/telafases/fundofases.png');
      background-size: cover;
      background-position: center;
      z-index: 0;
    }
    
    .fase-card {
      opacity: 0;
      transform: translateY(20px);
    }
    
    /* Animação básica */
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `;
  document.head.appendChild(styleLoader);

  // Em seguida, carregue o CSS completo
  const linkCSS = document.createElement('link');
  linkCSS.rel = 'stylesheet';
  linkCSS.href = 'assets/telafases/fase.css';
  
  // Adicionar eventos para detectar quando o CSS terminar de carregar
  linkCSS.onload = function() {
    console.log('CSS carregado com sucesso');
    if (window.cssLoaded) {
      finishLoading();
    }
    window.cssLoaded = true;
  };
  
  linkCSS.onerror = function() {
    console.error('Falha ao carregar CSS');
    // Continue mesmo com erro, usando estilos básicos inline
    setTimeout(finishLoading, 500);
  };
  
  document.head.appendChild(linkCSS);
})();

// Criar e mostrar tela de carregamento
function showLoadingScreen() {
  const loadingScreen = document.createElement('div');
  loadingScreen.id = 'loading-screen';
  
  const spinner = document.createElement('div');
  spinner.className = 'spinner';
  
  loadingScreen.appendChild(spinner);
  document.body.appendChild(loadingScreen);
  
  return loadingScreen;
}

// Função para esconder a tela de carregamento com fade
function hideLoadingScreen(loadingScreen) {
  loadingScreen.style.opacity = '0';
  setTimeout(() => {
    if (loadingScreen.parentNode) {
      loadingScreen.parentNode.removeChild(loadingScreen);
    }
  }, 500);
}

// Função para finalizar o carregamento e mostrar o conteúdo
function finishLoading() {
  const loadingScreen = document.getElementById('loading-screen');
  if (!loadingScreen) return;
  
  const gameContainer = document.getElementById('game-container');
  if (gameContainer) {
    gameContainer.style.opacity = '1';
  }
  
  // Animar cards com delay escalonado
  const cards = document.querySelectorAll('.fase-card');
  cards.forEach((card, index) => {
    card.style.animation = `fadeIn 0.5s ease forwards ${0.2 + index * 0.1}s`;
  });
  
  // Esconder tela de carregamento
  hideLoadingScreen(loadingScreen);
}

// Verificar se o Phaser já está carregado, se não, carregá-lo
function carregarPhaser(callback) {
  if (window.Phaser) {
    callback();
    return;
  }

  const script = document.createElement('script');
  script.src = 'https://cdn.jsdelivr.net/npm/phaser@3.55.2/dist/phaser.min.js';
  script.onload = callback;
  script.onerror = function() {
    console.error("Não foi possível carregar o Phaser");
    alert("Erro ao carregar recursos necessários. Por favor, recarregue a página.");
  };
  document.head.appendChild(script);
}

// Função que será chamada pelo script.js quando o arquivo for carregado
function construirPagina() {
  // Mostrar tela de carregamento antes de qualquer coisa
  const loadingScreen = showLoadingScreen();
  
  // Criar container para o jogo (inicialmente invisível)
  const gameContainer = document.getElementById('game-container') || document.createElement('div');
  gameContainer.id = 'game-container';
  gameContainer.style.opacity = '0';
  
  if (!gameContainer.parentNode) {
    document.body.appendChild(gameContainer);
  }
  
  // Limpar qualquer conteúdo existente
  gameContainer.innerHTML = '';
  document.body.style.background = 'none';
  
  // Criar o background com múltiplas opções para garantir que a imagem seja carregada
  const background = document.createElement('div');
  background.id = 'background-image-container';
  document.body.insertBefore(background, document.body.firstChild);
  
  // Verificar quando a imagem de fundo é carregada
  const bgImage = new Image();
  bgImage.onload = function() {
    if (window.cssLoaded) {
      finishLoading();
    }
    window.bgLoaded = true;
  };
  bgImage.onerror = function() {
    console.error("Erro ao carregar imagem de fundo");
    // Continue mesmo sem a imagem
    if (window.cssLoaded) {
      finishLoading();
    }
    window.bgLoaded = true;
  };
  bgImage.src = 'assets/telafases/fundofases.png';
  
  // Fallback de imagem se o background-image não funcionar
  const fallbackImg = document.createElement('img');
  fallbackImg.src = 'assets/telafases/fundofases.png';
  fallbackImg.alt = 'Background';
  fallbackImg.className = 'background-fallback';
  fallbackImg.style.display = 'none'; // Oculto por padrão
  document.body.insertBefore(fallbackImg, document.body.firstChild);
  
  // Overlay do background
  const backgroundOverlay = document.createElement('div');
  backgroundOverlay.className = 'background-overlay';
  document.body.insertBefore(backgroundOverlay, document.body.firstChild);
  
  // Criar os containers de partículas
  const particlesContainerBack = document.createElement('div');
  particlesContainerBack.id = 'particles-container-back';
  document.body.insertBefore(particlesContainerBack, document.body.firstChild);
  
  const particlesContainerFront = document.createElement('div');
  particlesContainerFront.id = 'particles-container-front';
  document.body.appendChild(particlesContainerFront);
  
  // Criar sistema de partículas
  createEnhancedParticles();
  
  // Container do logo
  const logoContainer = document.createElement('div');
  logoContainer.id = 'logo-container';
  logoContainer.className = 'transition-in';
  
  const logo = document.createElement('h2');
  logo.textContent = 'Data Quest';
  
  logoContainer.appendChild(logo);
  gameContainer.appendChild(logoContainer);
  
  // Container principal
  const faseContainer = document.createElement('div');
  faseContainer.id = 'fase-container';
  faseContainer.className = 'transition-in';
  
  const title = document.createElement('h1');
  title.id = 'fase-title';
  title.textContent = 'SELECIONE UMA FASE';
  
  faseContainer.appendChild(title);
  
  // Criar grid de fases
  const botoesFase = document.createElement('div');
  botoesFase.className = 'botoes-fase';
  
  // Dados das fases
  const fases = [
    {
      number: 1,
      title: 'Escola Invadida',
      image: 'assets/telafases/fundofases.png',
      description: 'Ajude os professores a recuperar o controle e proteger os dados dos alunos.',
      status: 'available'
    },
    {
      number: 2,
      title: 'Biblioteca',
      image: 'assets/telafases/bibliotecalogo.png',
      description: 'Complete a Fase 1 para desbloquear.',
      status: 'locked'
    },
    {
      number: 3,
      title: 'Servidor Central',
      image: 'assets/telafases/datacenter.webp',
      description: 'Complete a Fase 2 para desbloquear.',
      status: 'locked'
    }
  ];
  
  // Criar cards para cada fase
  fases.forEach(fase => {
    const card = createFaseCard(fase);
    botoesFase.appendChild(card);
  });
  
  faseContainer.appendChild(botoesFase);
  
  // Botões de navegação
  const navigationButtons = document.createElement('div');
  navigationButtons.className = 'navigation-buttons';
  
  const backButton = document.createElement('button');
  backButton.id = 'back-button';
  backButton.textContent = 'VOLTAR';
  backButton.addEventListener('click', () => {
    // Adicionar overlay de transição
    const overlay = document.getElementById('transition-overlay') || createTransitionOverlay();
    overlay.classList.add('active');
    
    // Voltar para a página inicial
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  });
  
  navigationButtons.appendChild(backButton);
  faseContainer.appendChild(navigationButtons);
  
  gameContainer.appendChild(faseContainer);
  
  // Adicionar overlay de transição
  const transitionOverlay = createTransitionOverlay();
  document.body.appendChild(transitionOverlay);
  
  // Tempo mínimo de carregamento para evitar flashes rápidos
  setTimeout(() => {
    if (window.bgLoaded && window.cssLoaded) {
      finishLoading();
    } else {
      // Se depois de 2 segundos ainda não carregou tudo, continuar mesmo assim
      window.fadeTimeout = setTimeout(() => {
        console.log("Tempo limite excedido, finalizando carregamento");
        finishLoading();
      }, 2000);
    }
  }, 500);
  
  // Verificar se os recursos foram carregados corretamente
  verificarRecursos();
}

// Criar card para cada fase
function createFaseCard(fase) {
  const card = document.createElement('div');
  card.className = `fase-card ${fase.status === 'locked' ? 'locked' : ''}`;
  
  if (fase.status !== 'locked') {
    card.addEventListener('click', () => {
      const overlay = document.getElementById('transition-overlay');
      overlay.classList.add('active');
      
      setTimeout(() => {
        // Verificar qual fase foi selecionada
        if (fase.number === 1) {
          console.log("Carregando Fase 1 como cena...");
          
          // Verifica se o script da fase 1 já foi carregado
          if (window.fase1Initialized) {
            console.log("Fase1.js já carregado, iniciando a fase imediatamente.");
            if (!window.Phaser) {
              const phaserScript = document.createElement('script');
              phaserScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/phaser/3.55.2/phaser.min.js';
              phaserScript.onload = () => iniciarFase1();
              document.head.appendChild(phaserScript);
            } else {
              iniciarFase1();
            }
          } else {
            // Carregar o script da fase 1 dinamicamente
            const scriptElement = document.createElement('script');
            // Usar caminho relativo para evitar erros de resolução
            scriptElement.src = './src/fase1/fase1.js';
            scriptElement.onload = () => {
              console.log('Script da Fase 1 carregado com sucesso!');
              if (!window.Phaser) {
                const phaserScript = document.createElement('script');
                phaserScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/phaser/3.55.2/phaser.min.js';
                phaserScript.onload = () => iniciarFase1();
                document.head.appendChild(phaserScript);
              } else {
                iniciarFase1();
              }
            };
            scriptElement.onerror = () => {
              console.error('Erro ao carregar o script da Fase 1!');
              alert('Ocorreu um erro ao carregar a Fase 1. Por favor, tente novamente.');
              overlay.classList.remove('active');
            };
            document.body.appendChild(scriptElement);
          }
        } 
        else if (fase.number === 2) {
          // Futura implementação para Fase 2
          console.log("Fase 2 ainda não implementada");
          alert("Fase 2 em desenvolvimento!");
          overlay.classList.remove('active');
        }
        else if (fase.number === 3) {
          // Futura implementação para Fase 3
          console.log("Fase 3 ainda não implementada");
          alert("Fase 3 em desenvolvimento!");
          overlay.classList.remove('active');
        }
        else {
          console.log(`Selecionada fase ${fase.number}`);
          alert(`Você selecionou a Fase ${fase.number}`);
          overlay.classList.remove('active');
        }
      }, 1000);
    });
  }
  
  // Cabeçalho do card
  const header = document.createElement('div');
  header.className = 'fase-header';
  
  const numberSpan = document.createElement('span');
  numberSpan.className = 'fase-number';
  numberSpan.textContent = fase.number;
  
  const title = document.createElement('h2');
  title.textContent = fase.title;
  
  header.appendChild(numberSpan);
  header.appendChild(title);
  
  // Preview da fase
  const preview = document.createElement('div');
  preview.className = 'fase-preview';
  
  const img = document.createElement('img');
  img.src = fase.image;
  img.alt = `Fase ${fase.number}`;
  
  preview.appendChild(img);
  
  // Se a fase está bloqueada, adicionar overlay de bloqueio
  if (fase.status === 'locked') {
    const lockOverlay = document.createElement('div');
    lockOverlay.className = 'lock-overlay';
    
    const cadeado = document.createElement('img');
    cadeado.src = 'assets/telafases/cadeado.png';
    cadeado.className = 'cadeado';
    cadeado.alt = 'Bloqueado';
    
    lockOverlay.appendChild(cadeado);
    preview.appendChild(lockOverlay);
  }
  
  // Descrição da fase
  const description = document.createElement('div');
  description.className = 'fase-description';
  
  const descP = document.createElement('p');
  descP.textContent = fase.description;
  
  description.appendChild(descP);
  
  // Status da fase
  const status = document.createElement('div');
  status.className = `fase-status ${fase.status}`;
  
  const statusText = document.createElement('span');
  statusText.className = 'status-text';
  statusText.textContent = fase.status === 'available' ? 'DISPONÍVEL' : 'BLOQUEADA';
  
  status.appendChild(statusText);
  
  // Montar o card
  card.appendChild(header);
  card.appendChild(preview);
  card.appendChild(description);
  card.appendChild(status);
  
  return card;
}

// Função para iniciar a Fase 1
function iniciarFase1() {
  // Limpar o conteúdo atual da página
  const gameContainer = document.getElementById('game-container');
  gameContainer.innerHTML = '';
  
  // Ocultar elementos da tela de fases
  document.querySelectorAll('#logo-container, #fase-container, #particles-container-front, #particles-container-back').forEach(el => {
    if (el) el.style.display = 'none';
  });

  // Adicionar overlay de transição para suavizar a mudança
  const overlay = document.getElementById('transition-overlay') || createTransitionOverlay();
  overlay.classList.add('active');
  
  console.log("Iniciando Fase 1 - Carregando fase1.js");
  
  // Tentativa de corrigir o carregamento do script fase1.js usando caminho absoluto e verificação préviao para garantir que o script seja encontrado
  try {
    // Tentar várias versões do caminho'; // Caminho absoluto em vez de relativo
    const possiblePaths = [
      '/src/fase1/fase1.js',
      '../fase1/fase1.js',
      'src/fase1/fase1.js',
      window.location.origin + '/src/fase1/fase1.js'
    ];
    
    // Função para tentar cada caminho
    const tryLoadScript = (paths, index) => {
      if (index >= paths.length) {
        console.error("Todos os caminhos falharam ao carregar fase1.js");
        alert("Erro ao carregar o jogo. Por favor, tente novamente.");
        overlay.classList.remove('active');
        return;
      }
      
      const fase1Script = document.createElement('script');
      fase1Script.src = paths[index];
      
      fase1Script.onload = function() {
        console.log(`fase1.js carregado com sucesso de ${paths[index]}`);
        
        // Se startGame não existir, é porque o script não foi carregado corretamente
        if (typeof window.startGame !== 'function') {
          console.log("Script carregado, mas função startGame não encontrada. Tentando próximo caminho...");
          tryLoadScript(paths, index + 1);
          return;
        }
        
        setTimeout(() => {
          try {
            window.startGame();
            setTimeout(() => overlay.classList.remove('active'), 800);
          } catch (e) {
            console.error("Erro ao executar startGame:", e);
            alert("Erro ao iniciar o jogo. Por favor, tente novamente.");
            overlay.classList.remove('active');
          }
        }, 200);
      };
      
      fase1Script.onerror = function() {
        console.error(`Erro ao carregar fase1.js de ${paths[index]}. Tentando próximo caminho...`);
        tryLoadScript(paths, index + 1);
      };
      
      document.head.appendChild(fase1Script);
    };
    
    // Iniciar tentativa de caminhos
    tryLoadScript(possiblePaths, 0);
  } catch (e) {
    console.error("Erro ao tentar carregar fase1.js:", e);
    alert("Erro ao carregar recursos. Por favor, recarregue a página.");
    overlay.classList.remove('active');
  }
}

// Criar overlay de transição
function createTransitionOverlay() {
  const overlay = document.createElement('div');
  overlay.id = 'transition-overlay';
  return overlay;
}

// Criar sistema de partículas avançado
function createEnhancedParticles() {
  // Partículas de fundo (mais lentas e mais transparentes)
  createParticleLayer('particles-container-back', 40, {
    sizeMin: 1,
    sizeMax: 3,
    opacityMin: 0.2,
    opacityMax: 0.4,
    speedMin: 15,
    speedMax: 30,
    blur: true
  });
  
  // Partículas de frente (mais rápidas e brilhantes)
  createParticleLayer('particles-container-front', 20, {
    sizeMin: 2,
    sizeMax: 4,
    opacityMin: 0.4,
    opacityMax: 0.7,
    speedMin: 8,
    speedMax: 15,
    glow: true
  });
}

// Criar uma camada de partículas com opções personalizadas
function createParticleLayer(containerId, count, options) {
  const container = document.getElementById(containerId);
  
  for (let i = 0; i < count; i++) {
    const particle = document.createElement('div');
    particle.className = `particle ${options.blur ? 'blur' : ''} ${options.glow ? 'glow' : ''}`;
    
    // Posição aleatória
    const posX = Math.random() * 100;
    const posY = Math.random() * 100;
    
    // Tamanho aleatório
    const size = Math.random() * (options.sizeMax - options.sizeMin) + options.sizeMin;
    
    // Velocidade aleatória
    const speed = Math.random() * (options.speedMax - options.speedMin) + options.speedMin;
    
    // Opacidade aleatória
    const opacity = Math.random() * (options.opacityMax - options.opacityMin) + options.opacityMin;
    
    // Aplicar estilos mínimos necessários (o resto vem do CSS)
    particle.style.left = `${posX}%`;
    particle.style.top = `${posY}%`;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.opacity = opacity.toString();
    particle.style.animationDuration = `${speed}s`;
    particle.style.animationDelay = `${Math.random() * 5}s`;
    
    container.appendChild(particle);
  }
  
  // Adicionar evento para criar novas partículas quando o mouse se mover
  if (containerId === 'particles-container-front') {
    document.addEventListener('mousemove', (e) => {
      const mouseX = e.clientX;
      const mouseY = e.clientY;
      
      // Limitar a criação de partículas a cada 100ms para não sobrecarregar
      if (!window.lastParticleTime || Date.now() - window.lastParticleTime > 100) {
        createMouseParticle(container, mouseX, mouseY);
        window.lastParticleTime = Date.now();
      }
    });
  }
}

// Criar partículas que seguem o movimento do mouse
function createMouseParticle(container, x, y) {
  const particle = document.createElement('div');
  particle.className = 'mouse-particle';
  
  const size = Math.random() * 3 + 2;
  
  // Aplicar apenas posição e tamanho, o resto vem do CSS
  particle.style.width = `${size}px`;
  particle.style.height = `${size}px`;
  particle.style.left = `${x}px`;
  particle.style.top = `${y}px`;
  
  container.appendChild(particle);
  
  // Animação da partícula
  setTimeout(() => {
    particle.style.transform = `translate(${(Math.random() * 50) - 25}px, ${(Math.random() * 50) - 25}px)`;
    particle.style.opacity = '0';
    
    // Remover a partícula após a animação
    setTimeout(() => {
      if (particle.parentNode) {
        particle.parentNode.removeChild(particle);
      }
    }, 1000);
  }, 10);
}

// Verificar e imprimir no console para debugging
function verificarRecursos() {
  console.log("Verificando recursos de imagem...");
  
  // Lista de variações de caminhos para tentar
  const recursos = [
    'assets/telafases/fundofases.png',
    'assets/telafases/bibliotecalogo.png',
    'assets/telafases/datacenter.webp',
    'assets/telafases/cadeado.png'
  ];
  
  // Testar cada recurso
  recursos.forEach(src => {
    const img = new Image();
    img.onload = () => console.log(`✓ Recurso carregado com sucesso: ${src}`);
    img.onerror = () => console.error(`✗ Falha ao carregar recurso: ${src}`);
    img.src = src;
  });
}

// Expor a função construirPagina globalmente
window.construirPagina = construirPagina;
window.finishLoading = finishLoading;
