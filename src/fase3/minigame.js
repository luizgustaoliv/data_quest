// Create a proper Phaser scene
class MinigameScene extends Phaser.Scene {
    constructor() {
        super('MinigameScene');
        this.popupsHandled = 0;
        this.requiredPopups = 3;
        this.gameActive = false;
        this.currentPopup = null;
        this.timer = null;
        this.timeLimit = 5000; // 5 seconds to respond
    }

    preload() {
        // Try using absolute path from base URL
        this.load.image("background", "../../assets/fase3/minigame/computer.jpg");

        // Load popup images
        this.load.image("alterarSenha", "../../assets/fase3/minigame/abas/alterarsenha_senha.png");
        this.load.image("apagarArquivo", "../../assets/fase3/minigame/abas/apagar_arquivos.png");
        this.load.image("apagarArquivo2", "../../assets/fase3/minigame/abas/apagar_arquivosuspeito.png");
        
        // Additional popup assets (you'll need to create these images)
        this.load.image("anuncio", "../../assets/fase3/minigame/abas/anuncio.png");
        this.load.image("formulario", "../../assets/fase3/minigame/abas/formulario.png");
        this.load.image("email", "../../assets/fase3/minigame/abas/email.png");
        this.load.image("configuracoes", "../../assets/fase3/minigame/abas/configuracoes.png");
        this.load.image("firewall", "../../assets/fase3/minigame/abas/firewall.png");
        
        // Add a loading event to debug image loading
        this.load.on('filecomplete', (key) => {
            console.log(`File loaded: ${key}`);
        });
        
        this.load.on('loaderror', (file) => {
            console.error('Error loading file:', file.key);
        });
    }

    create() { 
        // Create a container for the background that covers the entire game area
        const gameWidth = this.scale.width;
        const gameHeight = this.scale.height;
        console.log(`Game dimensions: ${gameWidth}x${gameHeight}`);
        
        // Try to use DOM element as fallback if image doesn't load properly
        const bg = this.add.image(gameWidth/2, gameHeight/2, "background");
        
        // Determine which dimension to fit to
        const scaleX = gameWidth / bg.width;
        const scaleY = gameHeight / bg.height;
        
        // Use the larger scale factor to ensure coverage
        const scale = Math.max(scaleX, scaleY);
        bg.setScale(scale);
        
        // Add a solid color backup in case image doesn't load
        const colorBg = this.add.rectangle(0, 0, gameWidth, gameHeight, 0x333333).setOrigin(0, 0);
        colorBg.setDepth(-1);
        
        this.scale.on('resize', (gameSize) => {
            const newWidth = gameSize.width;
            const newHeight = gameSize.height;
            
            // Resize the color background
            colorBg.width = newWidth;
            colorBg.height = newHeight;
            
            // Recalculate image scaling
            bg.x = newWidth/2;
            bg.y = newHeight/2;
            const newScaleX = newWidth / bg.width;
            const newScaleY = newHeight / bg.height;
            const newScale = Math.max(newScaleX, newScaleY);
            bg.setScale(newScale);
        });

        // Define popup types with required actions
        this.popupTypes = [
            { key: 'alterarSenha', action: 'restore', text: 'Configurações alteradas! Restaure-as!' },
            { key: 'apagarArquivo', action: 'delete', text: 'Arquivo suspeito! Apague-o!' },
            { key: 'apagarArquivo2', action: 'delete', text: 'Arquivo suspeito! Apague-o!' },
            { key: 'alterarSenha', action: 'restore', text: 'Configurações alteradas! Restaure-as!' },
            { key: 'apagarArquivo', action: 'delete', text: 'Arquivo suspeito! Apague-o!' },
            { key: 'apagarArquivo2', action: 'delete', text: 'Arquivo suspeito! Apague-o!' }
        ];
        
        // Create UI elements
        this.createUI();
        
        // Start game after a short delay
        this.time.delayedCall(1000, () => {
            this.startGame();
        });
    }
    
    createUI() {
        const gameWidth = this.scale.width;
        const gameHeight = this.scale.height;
        
        // Create score text
        this.scoreText = this.add.text(20, 20, 'Pop-ups: 0/' + this.requiredPopups, { 
            fontSize: '24px', 
            fill: '#fff',
            stroke: '#000',
            strokeThickness: 4
        });
        
        // Create timer bar
        this.timerBar = this.add.rectangle(gameWidth / 2, 40, 300, 20, 0x00ff00);
        this.timerBar.setOrigin(0.5, 0.5);
        this.timerBar.visible = false;
        
        // Create instructions text
        this.instructionsText = this.add.text(gameWidth / 2, 80, 'Proteja o computador dos pop-ups!', {
            fontSize: '28px',
            fill: '#fff',
            stroke: '#000',
            strokeThickness: 4
        }).setOrigin(0.5);
        
        // Create action text
        this.actionText = this.add.text(gameWidth / 2, 120, '', {
            fontSize: '24px',
            fill: '#ffff00',
            stroke: '#000',
            strokeThickness: 4
        }).setOrigin(0.5);
    }
    
    startGame() {
        this.gameActive = true;
        this.popupsHandled = 0;
        this.scoreText.setText('Pop-ups: ' + this.popupsHandled + '/' + this.requiredPopups);
        this.spawnPopup();
    }
    
    spawnPopup() {
        if (!this.gameActive) return;
        
        // Remove any existing popup
        if (this.currentPopup) {
            this.currentPopup.destroy();
        }
        
        // Get random popup type
        const popupType = Phaser.Utils.Array.GetRandom(this.popupTypes);
        const gameWidth = this.scale.width;
        const gameHeight = this.scale.height;
        
        // Create popup container
        this.currentPopup = this.add.container(
            Phaser.Math.Between(100, gameWidth - 400),
            Phaser.Math.Between(100, gameHeight - 300)
        );
        
        // Create popup background
        const popupBg = this.add.rectangle(0, 0, 400, 300, 0xffffff);
        popupBg.setOrigin(0);
        this.currentPopup.add(popupBg);
        
        // Add popup image
        const popupImage = this.add.image(200, 150, popupType.key);
        popupImage.setScale(Math.min(380 / popupImage.width, 240 / popupImage.height));
        this.currentPopup.add(popupImage);
        
        // Add popup title bar
        const titleBar = this.add.rectangle(0, 0, 400, 40, 0x4444ff);
        titleBar.setOrigin(0);
        this.currentPopup.add(titleBar);
        
        // Add popup title text
        const titleText = this.add.text(10, 10, 'Alerta de Segurança', { 
            fontSize: '18px', 
            fill: '#fff'
        });
        this.currentPopup.add(titleText);
        
        // Add close button
        const closeBtn = this.add.rectangle(385, 20, 20, 20, 0xff0000);
        closeBtn.setOrigin(0.5);
        closeBtn.setInteractive({ useHandCursor: true });
        closeBtn.on('pointerdown', () => this.handlePopupAction('close'));
        this.currentPopup.add(closeBtn);
        
        // Add X to close button
        const closeX = this.add.text(385, 20, 'X', { 
            fontSize: '18px', 
            fill: '#fff' 
        }).setOrigin(0.5);
        this.currentPopup.add(closeX);
        
        // Add action buttons based on popup type
        if (popupType.action === 'report' || popupType.action === 'delete' || popupType.action === 'restore') {
            let buttonText = '';
            if (popupType.action === 'report') buttonText = 'Denunciar';
            if (popupType.action === 'delete') buttonText = 'Apagar';
            if (popupType.action === 'restore') buttonText = 'Restaurar';
            
            const actionBtn = this.add.rectangle(200, 260, 150, 30, 0x00aa00);
            const actionText = this.add.text(200, 260, buttonText, { 
                fontSize: '18px', 
                fill: '#fff' 
            }).setOrigin(0.5);
            
            actionBtn.setInteractive({ useHandCursor: true });
            actionBtn.on('pointerdown', () => this.handlePopupAction(popupType.action));
            
            this.currentPopup.add(actionBtn);
            this.currentPopup.add(actionText);
        }
        
        // Make the entire container draggable
        titleBar.setInteractive({ useHandCursor: true });
        
        // Create a dragging variable to track dragging state
        let isDragging = false;
        let dragStartX = 0;
        let dragStartY = 0;
        
        titleBar.on('pointerdown', (pointer) => {
            isDragging = true;
            dragStartX = pointer.x - this.currentPopup.x;
            dragStartY = pointer.y - this.currentPopup.y;
        });
        
        this.input.on('pointermove', (pointer) => {
            if (isDragging) {
                this.currentPopup.x = pointer.x - dragStartX;
                this.currentPopup.y = pointer.y - dragStartY;
            }
        });
        
        this.input.on('pointerup', () => {
            isDragging = false;
        });
        
        // Store the required action
        this.currentPopup.requiredAction = popupType.action;
        
        // Update instruction text
        this.actionText.setText(popupType.text);
        
        // Start timer
        this.startTimer();
    }
    
    startTimer() {
        // Reset timer bar
        this.timerBar.visible = true;
        this.timerBar.width = 300;
        this.timerBar.fillColor = 0x00ff00;
        
        // Clear existing timer
        if (this.timer) {
            this.timer.remove();
        }
        
        // Create new timer
        this.timer = this.time.addEvent({
            delay: this.timeLimit,
            callback: () => {
                this.handleTimeout();
            }
        });
    }
    
    updateTimer() {
        if (!this.timer) return;
        
        const progress = 1 - this.timer.getProgress();
        this.timerBar.width = 300 * progress;
        
        // Change color based on time remaining
        if (progress < 0.3) {
            this.timerBar.fillColor = 0xff0000; // Red
        } else if (progress < 0.6) {
            this.timerBar.fillColor = 0xffff00; // Yellow
        }
    }
    
    handlePopupAction(action) {
        if (!this.currentPopup || !this.gameActive) return;
        
        if (action === this.currentPopup.requiredAction) {
            // Correct action
            this.popupsHandled++;
            this.scoreText.setText('Pop-ups: ' + this.popupsHandled + '/' + this.requiredPopups);
            
            // Check win condition
            if (this.popupsHandled >= this.requiredPopups) {
                this.gameWin();
            } else {
                // Spawn next popup
                this.spawnPopup();
            }
        } else {
            // Wrong action
            this.gameLose('Ação incorreta!');
        }
    }
    
    handleTimeout() {
        if (this.gameActive) {
            this.gameLose('Tempo esgotado!');
        }
    }
    
    gameWin() {
        this.gameActive = false;
        if (this.currentPopup) {
            this.currentPopup.destroy();
            this.currentPopup = null;
        }
        
        this.timerBar.visible = false;
        this.actionText.setText('');
        
        // Show win message
        const gameWidth = this.scale.width;
        const gameHeight = this.scale.height;
        
        const winText = this.add.text(gameWidth / 2, gameHeight / 2, 'VOCÊ VENCEU!\nComputador seguro!', {
            fontSize: '40px',
            fill: '#00ff00',
            stroke: '#000',
            strokeThickness: 6,
            align: 'center'
        }).setOrigin(0.5);
        
        // Add reset button
        const resetBtn = this.add.rectangle(gameWidth / 2, gameHeight / 2 + 100, 200, 50, 0x00aa00);
        const resetText = this.add.text(gameWidth / 2, gameHeight / 2 + 100, 'Jogar Novamente', {
            fontSize: '24px',
            fill: '#fff'
        }).setOrigin(0.5);
        
        resetBtn.setInteractive({ useHandCursor: true });
        resetBtn.on('pointerdown', () => {
            winText.destroy();
            resetBtn.destroy();
            resetText.destroy();
            this.startGame();
        });
    }
    
    gameLose(reason) {
        this.gameActive = false;
        if (this.currentPopup) {
            this.currentPopup.destroy();
            this.currentPopup = null;
        }
        
        this.timerBar.visible = false;
        this.actionText.setText('');
        
        // Show lose message
        const gameWidth = this.scale.width;
        const gameHeight = this.scale.height;
        
        const loseText = this.add.text(gameWidth / 2, gameHeight / 2, 'VOCÊ PERDEU!\n' + reason, {
            fontSize: '40px',
            fill: '#ff0000',
            stroke: '#000',
            strokeThickness: 6,
            align: 'center'
        }).setOrigin(0.5);
        
        // Add reset button
        const resetBtn = this.add.rectangle(gameWidth / 2, gameHeight / 2 + 100, 200, 50, 0x880000);
        const resetText = this.add.text(gameWidth / 2, gameHeight / 2 + 100, 'Tentar Novamente', {
            fontSize: '24px',
            fill: '#fff'
        }).setOrigin(0.5);
        
        resetBtn.setInteractive({ useHandCursor: true });
        resetBtn.on('pointerdown', () => {
            loseText.destroy();
            resetBtn.destroy();
            resetText.destroy();
            this.startGame();
        });
    }

    update() { 
        // Update timer
        if (this.gameActive && this.timer) {
            this.updateTimer();
        }
    }
}

// Wrap config and game initialization in a function
function startGame() {
    const config = {
      type: Phaser.WEBGL,
      width: window.innerWidth,
      height: window.innerHeight,
      parent: "game-container",
      backgroundColor: "#000000",
      scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH,
      },
      physics: {
        default: "arcade",
        arcade: {
          gravity: { y: 0 },
          debug: false,
        },
      },
      scene: [MinigameScene]
    };
  
    const game = new Phaser.Game(config);
}
  
// Start the game after page loads
window.onload = function () {
    startGame();
};