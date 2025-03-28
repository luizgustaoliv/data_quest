// Carrega o Phaser dinamicamente
function loadScript(url) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = url;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

// Inicializa o jogo após carregar o Phaser
async function initGame() {
    try {
        // Check if Phaser is already loaded
        if (typeof Phaser === 'undefined') {
            await loadScript('https://cdnjs.cloudflare.com/ajax/libs/phaser/3.88.2/phaser.min.js');
        }
        
        // Create a game container that will be placed inside the minigame container
        const gameContainer = document.createElement('div');
        gameContainer.id = 'projetil-game';
        
        // Get or create minigame container
        let minigameContainer = document.getElementById('projetil-minigame-container');
        if (!minigameContainer) {
            minigameContainer = document.createElement('div');
            minigameContainer.id = 'projetil-minigame-container';
            minigameContainer.style.position = 'fixed';
            minigameContainer.style.top = '0';
            minigameContainer.style.left = '0';
            minigameContainer.style.width = '100%';
            minigameContainer.style.height = '100%';
            minigameContainer.style.zIndex = '5000';
            document.body.appendChild(minigameContainer);
        }
        
        minigameContainer.appendChild(gameContainer);
        
        // Add UI elements - title and exit button
        const titleBar = document.createElement('div');
        titleBar.style.position = 'absolute';
        titleBar.style.top = '10px';
        titleBar.style.left = '0';
        titleBar.style.width = '100%';
        titleBar.style.textAlign = 'center';
        titleBar.style.zIndex = '5001';
        titleBar.innerHTML = '<h2 style="color:white; margin:0; font-family:Arial;">Mini-Game: Proteja os Dados</h2>';
        minigameContainer.appendChild(titleBar);
        
        const exitButton = document.createElement('button');
        exitButton.textContent = 'Sair';
        exitButton.style.position = 'absolute';
        exitButton.style.top = '10px';
        exitButton.style.right = '10px';
        exitButton.style.padding = '5px 15px';
        exitButton.style.zIndex = '5001';
        exitButton.style.cursor = 'pointer';
        exitButton.onclick = () => {
            // Call the global exit function if it exists
            if (typeof window.exitProjetilMinigame === 'function') {
                window.exitProjetilMinigame();
            } else {
                // Fallback if the global function isn't available
                if (game) game.destroy(true);
                if (minigameContainer) minigameContainer.remove();
            }
        };
        minigameContainer.appendChild(exitButton);
        
        // Add instructions
        const instructions = document.createElement('div');
        instructions.style.position = 'absolute';
        instructions.style.bottom = '20px';
        instructions.style.left = '0';
        instructions.style.width = '100%';
        instructions.style.textAlign = 'center';
        instructions.style.color = 'white';
        instructions.style.fontFamily = 'Arial';
        instructions.style.zIndex = '5001';
        instructions.innerHTML = 'Clique para lançar o projetil e proteger os dados pessoais!';
        minigameContainer.appendChild(instructions);
        
        // Add counter for protected data
        const counterElement = document.createElement('div');
        counterElement.id = 'data-counter';
        counterElement.style.position = 'absolute';
        counterElement.style.top = '50px';
        counterElement.style.left = '10px';
        counterElement.style.color = 'white';
        counterElement.style.padding = '10px';
        counterElement.style.background = 'rgba(0,0,0,0.5)';
        counterElement.style.borderRadius = '5px';
        counterElement.style.zIndex = '5001';
        counterElement.innerHTML = 'Dados protegidos: 0/4';
        minigameContainer.appendChild(counterElement);
        
        // Configuração do jogo
        const config = {
            type: Phaser.AUTO,
            width: window.innerWidth,
            height: window.innerHeight,
            parent: 'projetil-game',
            scale: {
                mode: Phaser.Scale.FIT,
                autoCenter: Phaser.Scale.CENTER_BOTH
            },
            scene: {
                preload: preload,
                create: create,
                update: update
            },
            physics: {
                default: 'arcade',
                arcade: {
                    gravity: { y: 0 },
                    debug: false
                }
            }
        };

        // Variáveis globais do jogo
        const game = new Phaser.Game(config);
        let projetilAtivo = null;
        let dadosProtegidos = 0;
        const totalDados = 4;

        function preload() {
            this.load.image('projetil', 'assets/fase2/minigame-projetil/projetil.png');
            this.load.image('cadeado', 'assets/fase2/minigame-projetil/cadeado.png');
            this.load.image('fundo', 'assets/fase2/minigame-projetil/background.png');
            this.load.image('borda', 'assets/fase2/minigame-projetil/borda.png');
            this.load.image('efeito', 'assets/fase2/minigame-projetil/efeito.png');
            this.load.image('obstaculo', 'assets/fase2/minigame-projetil/obstaculo.png');
        }

        function create() {
            const fundo = this.add.image(0, 0, 'fundo').setOrigin(0, 0);
            fundo.setDisplaySize(this.scale.width, this.scale.height);
            
            this.dadosGroup = this.physics.add.staticGroup();
            
            criarcadeados.call(this);
            criarobsatculos.call(this);
            
            this.input.on('pointerdown', lancarprojetil, this);
            
            const borda = this.add.image(0, 0, 'borda').setOrigin(0, 0);
            borda.setDisplaySize(this.scale.width, this.scale.height);
            borda.setDepth(1);

            const efeito = this.add.image(0, 0, 'efeito').setOrigin(0, 0);
            efeito.setDisplaySize(this.scale.width, this.scale.height);
            efeito.setDepth(1);
            efeito.setAlpha(0.3);
        }

        function criarcadeados() {
            for (let i = 0; i < totalDados; i++) {
                const x = Phaser.Math.Between(700, 1100);
                const y = Phaser.Math.Between(400, 700);
                const cadeado = this.dadosGroup.create(x, y, 'cadeado');
                cadeado.setScale(1.7);
            }
        }

        function criarobsatculos() {
            const obstaculo = this.physics.add.image(700, 200, 'obstaculo');
            obstaculo.setScale(1);
            obstaculo.setImmovable(true);
        }

        function lancarprojetil(pointer) {
            if (projetilAtivo) return; // Prevent multiple projectiles
            
            projetilAtivo = this.physics.add.image(200, 600, 'projetil');
            projetilAtivo.setScale(1.6);
            
            const anguloLancamento = Phaser.Math.Angle.Between(200, 600, pointer.x, pointer.y);
            
            const forcaLancamento = 600;
            const velocidadeX = Math.cos(anguloLancamento) * forcaLancamento; // Cálculo da velocidade em X (MU)
            const velocidadeY = Math.sin(anguloLancamento) * forcaLancamento; // Cálculo da velocidade em Y (MU)
            projetilAtivo.setVelocity(velocidadeX, velocidadeY); //Velocidades iniciais em X e Y
            projetilAtivo.setAccelerationY(250); // Adicionando aceleração constante em Y (tornando em MUV)
            
            projetilAtivo.setDepth(0);
            
            this.physics.add.collider(
                projetilAtivo, 
                this.dadosGroup,
                protegerDado,
                null,
                this
            );
        }

        function protegerDado(projetil, dado) {
            dado.disableBody(true, true);
            projetil.destroy();
            projetilAtivo = null;
            
            // Update counter
            dadosProtegidos++;
            const counterElement = document.getElementById('data-counter');
            if (counterElement) {
                counterElement.innerHTML = `Dados protegidos: ${dadosProtegidos}/${totalDados}`;
            }
            
            // Check if all data is protected
            if (dadosProtegidos >= totalDados) {
                // Show victory message
                const victoryMsg = document.createElement('div');
                victoryMsg.style.position = 'absolute';
                victoryMsg.style.top = '50%';
                victoryMsg.style.left = '50%';
                victoryMsg.style.transform = 'translate(-50%, -50%)';
                victoryMsg.style.background = 'rgba(0,100,0,0.8)';
                victoryMsg.style.color = 'white';
                victoryMsg.style.padding = '20px';
                victoryMsg.style.borderRadius = '10px';
                victoryMsg.style.textAlign = 'center';
                victoryMsg.style.zIndex = '5002';
                victoryMsg.innerHTML = '<h2>Você protegeu todos os dados!</h2><p>Agora pode prosseguir para a próxima fase.</p>';
                minigameContainer.appendChild(victoryMsg);
                
                // Add button to continue
                const continueBtn = document.createElement('button');
                continueBtn.textContent = 'Continuar';
                continueBtn.style.padding = '10px 20px';
                continueBtn.style.margin = '10px auto';
                continueBtn.style.display = 'block';
                continueBtn.onclick = () => {
                    // Return to main game or go to next phase
                    if (typeof window.exitProjetilMinigame === 'function') {
                        window.exitProjetilMinigame();
                        // Here you could add code to progress to the next phase
                    }
                };
                victoryMsg.appendChild(continueBtn);
            }
        }

        function update() {
            if (projetilAtivo) {
                console.log(`MU: Posição X: ${projetilAtivo.x.toFixed(2)}, Velocidade X: ${projetilAtivo.body.velocity.x.toFixed(2)}`);
                console.log(`MUV: Posição Y: ${projetilAtivo.y.toFixed(2)}, Velocidade Y: ${projetilAtivo.body.velocity.y.toFixed(2)}, Aceleração Y: 250`);
                
                if (
                    projetilAtivo.x < 0 || projetilAtivo.x > this.scale.width ||
                    projetilAtivo.y < 0 || projetilAtivo.y > this.scale.height
                ) {
                    projetilAtivo.destroy();
                    projetilAtivo = null;
                }
            }
        }
    } catch (error) {
        console.error('Erro ao carregar o Phaser:', error);
        // Show error message in container
        const errorMsg = document.createElement('div');
        errorMsg.style.position = 'absolute';
        errorMsg.style.top = '50%';
        errorMsg.style.left = '50%';
        errorMsg.style.transform = 'translate(-50%, -50%)';
        errorMsg.style.color = 'white';
        errorMsg.style.background = 'rgba(200,0,0,0.8)';
        errorMsg.style.padding = '20px';
        errorMsg.style.borderRadius = '10px';
        errorMsg.textContent = `Erro ao carregar o minigame: ${error.message}`;
        
        const minigameContainer = document.getElementById('projetil-minigame-container');
        if (minigameContainer) {
            minigameContainer.appendChild(errorMsg);
        }
    }
}

// Auto-inicialização quando o script é carregado
initGame();
