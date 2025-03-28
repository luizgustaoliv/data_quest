function preload() {
    this.load.image('chave', 'assets/chave.png');
    this.load.image('cadeado', 'assets/cadeado.png');
    this.load.image('fundo', 'assets/backgroundtutorial.png');
}

function create() {
    const fundo = this.add.image(0, 0, 'fundo').setOrigin(0, 0);
    fundo.setDisplaySize(this.scale.width, this.scale.height);
    
    this.dadosGroup = this.physics.add.staticGroup();
    
    criarcadeados.call(this);
    
    this.input.on('pointerdown', lancarChave, this);
    
    const borda = this.add.image(0, 0, 'borda').setOrigin(0, 0);
    borda.setDisplaySize(this.scale.width, this.scale.height);
    borda.setDepth(1);
}

function lancarChave() {
    const chave = this.add.image(100, 100, 'chave'); // Posição inicial
    const cadeado = { x: 500, y: 500 }; // Posição do cadeado (posição final y e x)
    const duracao = 2000; // Tempo da animação em milissegundos (2s)

    // Velocidade horizontal constante (MU)
    const velocidadeX = (cadeado.x - 100) / (duracao / 1000);
    
    // Aceleração no eixo Y para MUV com velocidade inicial nula
    const aceleracaoY = (2 * (cadeado.y - 100)) / Math.pow(duracao / 1000, 2);
    
    let tempo = 0;
    const intervalo = 16; // Aproximadamente 60 FPS

    const animacao = setInterval(() => {
        tempo += intervalo / 1000;
        
        // Movimento no eixo X (MU)
        chave.x = 100 + velocidadeX * tempo;
        console.log(`Tempo: ${tempo.toFixed(2)}s | X: ${chave.x.toFixed(2)} | VelocidadeX: ${velocidadeX.toFixed(2)}`);
        
        // Movimento no eixo Y (MUV)
        let velocidadeY = aceleracaoY * tempo;
        chave.y = 100 + (0.5 * aceleracaoY * Math.pow(tempo, 2));
        console.log(`Tempo: ${tempo.toFixed(2)}s | Y: ${chave.y.toFixed(2)} | VelocidadeY: ${velocidadeY.toFixed(2)} | AceleracaoY: ${aceleracaoY.toFixed(2)}`);
        
        // Verifica se chegou ao destino
        if (tempo >= duracao / 1000) {
            clearInterval(animacao);
            chave.x = cadeado.x;
            chave.y = cadeado.y;
            console.log("Chave chegou ao cadeado!");
        }
    }, intervalo);
}
