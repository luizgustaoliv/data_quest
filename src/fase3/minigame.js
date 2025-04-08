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
        this.screenArea = {
            x: 180,
            y: 15,  // Changed from 100 to 50 to move up
            width: 890,
            height: 460  // Changed from 500 to 400 to better fit the screen
        };
        this.remainingPopups = [];
        this.debugGraphics = null;
    }

    preload() {
        // Load font using WebFontLoader plugin
        this.load.script('webfont', 'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js');

        // Load game assets
        this.load.image("background", "../../assets/fase3/minigame/computer.jpg");

        // Load popup images
        this.load.image("alterarSenha", "../../assets/fase3/minigame/abas/alterarsenha_senha.png");
        this.load.image("apagarArquivo", "../../assets/fase3/minigame/abas/arquivo_suspeito_apagar_ou_executar.png");
        this.load.image("fecharArquivo", "../../assets/fase3/minigame/abas/gemino_fechar.png");
        
        // Add a loading event to debug image loading
        this.load.on('filecomplete', (key) => {
            console.log(`File loaded: ${key}`);
        });
        
        this.load.on('loaderror', (file) => {
            console.error('Error loading file:', file.key);
        });
    }

    create() {
        // Load font before creating UI
        WebFont.load({
            google: {
                families: ['Press Start 2P']
            },
            active: () => {
                // Create rest of the game after font is loaded
                this.createGameElements();
            }
        });
    }

    createGameElements() {
        const gameWidth = this.scale.width;
        const gameHeight = this.scale.height;
        
        // Background setup
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
            { key: 'alterarSenha', action: 'change', text: 'Configurações alteradas! Restaure-as!', closeAction: 'wrong' },
            { key: 'apagarArquivo', action: 'delete', text: 'Arquivo suspeito! Apague-o!', closeAction: 'wrong' },
            { key: 'fecharArquivo', action: 'close', text: 'Feche este pop-up suspeito!', closeAction: 'correct' },
        ];
        
        // Create UI elements
        this.createUI();
        
        // Add visual computer screen area (semi-transparent rectangle)
        const screen = this.add.rectangle(
            this.screenArea.x,
            this.screenArea.y,
            this.screenArea.width,
            this.screenArea.height,
            0x0000ff,
            0.2  // Increased opacity from 0.1 to 0.2
        );
        screen.setOrigin(0, 0);
        screen.setDepth(0);  // Changed from -0.5 to 0 to make sure it's visible

        // Add debug visualization
        this.debugGraphics = this.add.graphics();
        this.debugGraphics.lineStyle(4, 0xff0000); // Increased thickness from 2 to 4
        this.debugGraphics.strokeRect(
            this.screenArea.x,
            this.screenArea.y,
            this.screenArea.width,
            this.screenArea.height
        );
        this.debugGraphics.setDepth(1); // Ensure debug graphics are on top
        
        // Add debug text
        this.add.text(
            this.screenArea.x,
            this.screenArea.y - 20,
            `Screen Area: ${this.screenArea.width}x${this.screenArea.height}`,
            {
                fontSize: '16px',
                fill: '#ff0000'
            }
        );

        // Add corner markers
        const corners = [
            [this.screenArea.x, this.screenArea.y],
            [this.screenArea.x + this.screenArea.width, this.screenArea.y],
            [this.screenArea.x + this.screenArea.width, this.screenArea.y + this.screenArea.height],
            [this.screenArea.x, this.screenArea.y + this.screenArea.height]
        ];

        corners.forEach(([x, y]) => {
            this.debugGraphics.lineStyle(2, 0xff0000);
            this.debugGraphics.strokeCircle(x, y, 5);
        });

        // Initialize remaining popups array with all popup types
        this.remainingPopups = [...this.popupTypes];

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
            fontSize: '20px', // reduced from 24px
            fontFamily: '"Press Start 2P"',
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
            fontSize: '24px', // reduced from 28px
            fontFamily: '"Press Start 2P"',
            fill: '#fff',
            stroke: '#000',
            strokeThickness: 4
        }).setOrigin(0.5);
        
        // Create action text
        this.actionText = this.add.text(gameWidth / 2, 120, '', {
            fontSize: '20px', // reduced from 24px
            fontFamily: '"Press Start 2P"',
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

        // Get next popup in sequence instead of random
        if (this.remainingPopups.length === 0) {
            // If all popups used, reset the array
            this.remainingPopups = [...this.popupTypes];
        }
        const popupType = this.remainingPopups.shift();

        // Calculate random position within screen area
        const x = Phaser.Math.Between(
            this.screenArea.x,
            this.screenArea.x + this.screenArea.width - 400
        );
        const y = Phaser.Math.Between(
            this.screenArea.y,
            this.screenArea.y + this.screenArea.height - 300
        );
        
        // Create popup container at calculated position
        this.currentPopup = this.add.container(x, y);
        
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
            fontSize: '14px', // reduced from 18px
            fontFamily: '"Press Start 2P"',
            fill: '#fff'
        });
        this.currentPopup.add(titleText);
        
        // Add close button
        const closeBtn = this.add.rectangle(385, 20, 20, 20, 0xff0000);
        closeBtn.setOrigin(0.5);
        closeBtn.setInteractive({ useHandCursor: true });
        closeBtn.on('pointerdown', () => {
            // Check if closing is the correct action for this popup
            if (popupType.closeAction === 'correct') {
                this.handlePopupAction('close');
            } else {
                this.handlePopupAction('wrong');
            }
        });
        this.currentPopup.add(closeBtn);
        
        // Add X to close button
        const closeX = this.add.text(385, 20, 'X', { 
            fontSize: '14px', // reduced from 18px
            fontFamily: '"Press Start 2P"',
            fill: '#fff' 
        }).setOrigin(0.5);
        this.currentPopup.add(closeX);
        
        // Add action buttons based on popup type
        if (popupType.action === 'report' || popupType.action === 'delete' || popupType.action === 'restore' || popupType.action === 'change') {
            let buttonText = '';
            let wrongButtonText = '';
            
            // Set correct button text
            if (popupType.action === 'report') buttonText = 'Denunciar';
            if (popupType.action === 'delete') buttonText = 'Apagar';
            if (popupType.action === 'restore') buttonText = 'Restaurar';
            if (popupType.action === 'change') buttonText = 'Alterar Senha';
            
            // Set wrong button text
            if (popupType.action === 'report') wrongButtonText = 'Ignorar';
            if (popupType.action === 'delete') wrongButtonText = 'Executar';
            if (popupType.action === 'restore') wrongButtonText = 'Ignorar';
            if (popupType.action === 'change') wrongButtonText = 'Ignorar';
            
            // Add correct action button
            const actionBtn = this.add.rectangle(150, 260, 150, 30, 0x00aa00);
            const actionText = this.add.text(150, 260, buttonText, { 
                fontSize: '14px', // reduced from 18px
                fontFamily: '"Press Start 2P"',
                fill: '#fff' 
            }).setOrigin(0.5);
            
            // Add wrong action button
            const wrongBtn = this.add.rectangle(320, 260, 150, 30, 0xaa0000);
            const wrongText = this.add.text(320, 260, wrongButtonText, { 
                fontSize: '14px', // reduced from 18px
                fontFamily: '"Press Start 2P"',
                fill: '#fff' 
            }).setOrigin(0.5);
            
            actionBtn.setInteractive({ useHandCursor: true });
            wrongBtn.setInteractive({ useHandCursor: true });
            
            actionBtn.on('pointerdown', () => this.handlePopupAction(popupType.action));
            wrongBtn.on('pointerdown', () => this.handlePopupAction('wrong'));
            
            this.currentPopup.add(actionBtn);
            this.currentPopup.add(actionText);
            this.currentPopup.add(wrongBtn);
            this.currentPopup.add(wrongText);
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
                let newX = pointer.x - dragStartX;
                let newY = pointer.y - dragStartY;
                
                // Constrain to screen area
                newX = Phaser.Math.Clamp(
                    newX,
                    this.screenArea.x,
                    this.screenArea.x + this.screenArea.width - 400
                );
                newY = Phaser.Math.Clamp(
                    newY,
                    this.screenArea.y,
                    this.screenArea.y + this.screenArea.height - 300
                );
                
                this.currentPopup.x = newX;
                this.currentPopup.y = newY;
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
            fontSize: '36px', // reduced from 40px
            fontFamily: '"Press Start 2P"',
            fill: '#00ff00',
            stroke: '#000',
            strokeThickness: 6,
            align: 'center'
        }).setOrigin(0.5);
        
        // Add reset button
        const resetBtn = this.add.rectangle(gameWidth / 2, gameHeight / 2 + 100, 200, 50, 0x00aa00);
        const resetText = this.add.text(gameWidth / 2, gameHeight / 2 + 100, 'Jogar Novamente', {
            fontSize: '20px', // reduced from 24px
            fontFamily: '"Press Start 2P"',
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
            fontSize: '36px', // reduced from 40px
            fontFamily: '"Press Start 2P"',
            fill: '#ff0000',
            stroke: '#000',
            strokeThickness: 6,
            align: 'center'
        }).setOrigin(0.5);
        
        // Add reset button
        const resetBtn = this.add.rectangle(gameWidth / 2, gameHeight / 2 + 100, 200, 50, 0x880000);
        const resetText = this.add.text(gameWidth / 2, gameHeight / 2 + 100, 'Tentar Novamente', {
            fontSize: '20px', // reduced from 24px
            fontFamily: '"Press Start 2P"',
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