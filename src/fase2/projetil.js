// Configuração do jogo
const config = {
    type: Phaser.AUTO,
    width: 1200,
    height: 800,
    scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 250 }, // Aceleração constante no eixo Y
            debug: false
        }
    }
};

// Variáveis globais do jogo
const game = new Phaser.Game(config);
let projetilAtivo = null;

function preload() {
    // Carregar assets do jogo
    this.load.image('projetil', 'assets/projetil.png');
    this.load.image('cadeado', 'assets/cadeado.png');
    this.load.image('fundo', 'assets/background.png');
    this.load.image('borda', 'assets/borda.png');
    this.load.image('efeito', 'assets/efeito.png');
    this.load.image('obstaculo', 'assets/obstaculo.png');
}

function create() {
    // Configurar cena do jogo
    const fundo = this.add.image(0, 0, 'fundo').setOrigin(0, 0);
    fundo.setDisplaySize(this.scale.width, this.scale.height); // Ajustar o fundo para ocupar a tela inteira
    
    // Grupo de dados
    this.dadosGroup = this.physics.add.staticGroup();
    
    // Criar blocos de dados
    criarcadeados.call(this);
    criarobsatculos.call(this);
    
    // Área de lançamento do pássaro
    this.input.on('pointerdown', lancarprojetil, this);
    
    // Criar a borda por último para que fique sobreposta a tudo
    const borda = this.add.image(0, 0, 'borda').setOrigin(0, 0);
    borda.setDisplaySize(this.scale.width, this.scale.height); // Ajustar a borda para ocupar a tela inteira
    borda.setDepth(1);

    const efeito = this.add.image(0, 0, 'efeito').setOrigin(0, 0);
    efeito.setDisplaySize(this.scale.width, this.scale.height); // Ajustar o efeito para ocupar a tela inteira
    efeito.setDepth(1);
    efeito.setAlpha(0.3);
}

function criarcadeados() {
    // Criar 4 blocos de dados em posições aleatórias
    for (let i = 0; i < 4; i++) {
        const x = Phaser.Math.Between(700, 1100); // Posição X aleatória
        const y = Phaser.Math.Between(400, 700); // Posição Y aleatória
        const cadeado = this.dadosGroup.create(x, y, 'cadeado');
        cadeado.setScale(1.5); // Aumentando o tamanho do cadeado
    }
}



function criarobsatculos() {
    const obstaculo = this.physics.add.image(700, 200, 'obstaculo');
    obstaculo.setScale(1);
    obstaculo.setImmovable(true);
}

function lancarprojetil(pointer) {
    // Criar pássaro de proteção
    projetilAtivo = this.physics.add.image(200, 600, 'projetil'); // Posição inicial do projetil
    projetilAtivo.setScale(1.6);
    
    // Calcular vetor de lançamento
    const anguloLancamento = Phaser.Math.Angle.Between(
        200, 600, 
        pointer.x, pointer.y
    );
    
    // Configurar velocidade do lançamento
    const forcaLancamento = 600; // Ajuste para a força desejada
    projetilAtivo.setVelocity(
        Math.cos(anguloLancamento) * forcaLancamento, // Componente horizontal (MU)
        Math.sin(anguloLancamento) * forcaLancamento  // Componente vertical (MUV)
    );
    
    // Definir uma profundidade menor para o projetil
    projetilAtivo.setDepth(0);
    
    // Configurar colisão
    this.physics.add.collider(
        projetilAtivo, 
        this.dadosGroup,
        protegerDado,
        null,
        this
    );
}

function protegerDado(projetil, dado) {
    // Remover dado protegido
    dado.disableBody(true, true);
    
    // Destruir o projetil após a colisão
    projetil.destroy();
    projetilAtivo = null;
}

function update() {
    if (projetilAtivo) {
        console.log(`MU: Posição X: ${projetilAtivo.x.toFixed(2)}, Velocidade X: ${projetilAtivo.body.velocity.x.toFixed(2)}`);
        console.log(`MUV: Posição Y: ${projetilAtivo.y.toFixed(2)}, Velocidade Y: ${projetilAtivo.body.velocity.y.toFixed(2)}, Aceleração Y: 250`);
        
        // Verificar se o projetil saiu da tela
        if (
            projetilAtivo.x < 0 || projetilAtivo.x > this.scale.width ||
            projetilAtivo.y < 0 || projetilAtivo.y > this.scale.height
        ) {
            projetilAtivo.destroy();
            projetilAtivo = null;
        }
    }
}
