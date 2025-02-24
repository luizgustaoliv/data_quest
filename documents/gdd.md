<img src="../assets/logointeli.png">


# GDD - Game Design Document - Módulo 1 - Inteli

## CyberTech

#### André David Katz, Celso Rodrigues Rocha Júnior, Daniel Meiches, Kaian Santos Moura, Luiz Gustavo Borges Oliveira, Miguel Ferreira de Siqueira Almeida e Wendel Hebert Feitosa.



## Sumário

[1. Introdução](#c1)

[2. Visão Geral do Jogo](#c2)

[3. Game Design](#c3)

[4. Desenvolvimento do jogo](#c4)

[5. Casos de Teste](#c5)

[6. Conclusões e trabalhos futuros](#c6)

[7. Referências](#c7)

[Anexos](#c8)

<br>


# <a name="c1"></a>1. Introdução (sprints 1 a 4)

## 1.1. Plano Estratégico do Projeto

### 1.1.1. Contexto da indústria (sprint 2)

*Posicione aqui o texto que explica o contexto da indústria/mercado do qual o parceiro de projeto faz parte. Contextualize o segmento de atuação do parceiro (pode ser indústria, comércio ou serviço). Caracterize as atividades executadas pelo negócio do parceiro e a abrangência de suas atividades (âmbito internacional, nacional ou regional).*

#### 1.1.1.1. Modelo de 5 Forças de Porter (sprint 2)

*Posicione aqui o modelo de 5 Forças de Porter para sustentar o contexto da indústria.*

### 1.1.2. Análise SWOT (sprint 2)

*Posicione aqui a análise SWOT relacionada ao parceiro de projeto. Utilize a análise SWOT para fazer uma análise ambiental do parceiro no âmbito estratégico. Leve em consideração o contexto da indústria, concorrência e as características do ambiente interno (forças e fraquezas) e externo (oportunidades e ameaças) do parceiro.*

### 1.1.3. Missão / Visão / Valores (sprint 2)

*Posicione aqui a Missão, Visão e Valores do seu projeto.*

### 1.1.4. Proposta de Valor (sprint 4)

*Posicione aqui o canvas de proposta de valor. Descreva os aspectos essenciais para a criação de valor da ideia do produto com o objetivo de ajudar a entender melhor a realidade do cliente e entregar uma solução que está alinhado com o que ele espera.*

### 1.1.5. Descrição da Solução Desenvolvida (sprint 4)

*Descreva brevemente a solução desenvolvida para o parceiro de negócios. Descreva os aspectos essenciais para a criação de valor da ideia do produto com o objetivo de ajudar a entender melhor a realidade do cliente e entregar uma solução que está alinhado com o que ele espera. Observe a seção 2 e verifique que ali é possível trazer mais detalhes, portanto seja objetivo aqui. Atualize esta descrição até a entrega final, conforme desenvolvimento.*

### 1.1.6. Matriz de Riscos (sprint 4)

*Registre na matriz os riscos identificados no projeto, visando avaliar situações que possam representar ameaças e oportunidades, bem como os impactos relevantes sobre o projeto. Apresente os riscos, ressaltando, para cada um, impactos e probabilidades com plano de ação e respostas.*

### 1.1.7. Objetivos, Metas e Indicadores (sprint 4)

*Definição de metas SMART (específicas, mensuráveis, alcançáveis, relevantes e temporais) para seu projeto, com indicadores claros para mensuração*

## 1.2. Requisitos do Projeto (sprints 1 e 2)

Os requisitos do projeto descrevem as funcionalidades essenciais para o desenvolvimento do jogo, garantindo seu correto funcionamento. Eles incluem mecânicas básicas, como movimentação e interação, além de elementos específicos da jogabilidade, como o sistema de combate baseado em perguntas sobre a LGPD. Esses requisitos são fundamentais para estruturar a experiência do jogador e assegurar a coerência do jogo dentro do seu tema e objetivo educacional.

\# | Requisito | Descrição  
--- | --- | ---
1 | O controle do personagem será realizado usando as teclas WASD para movimentação. | O jogador pode mover o personagem utilizando as teclas direcionais padrão de jogos no teclado.
2 | O personagem poderá interagir com NPCs para iniciar diálogos. | Durante a exploração, o jogador pode conversar com personagens do jogo para obter informações e avançar na narrativa.
3 | O combate será baseado em perguntas e respostas sobre LGPD. | Durante os confrontos, o jogador precisará responder corretamente a perguntas sobre a Lei Geral de Proteção de Dados (LGPD) para vencer os desafios.
4 | O jogo será dividido em cinco fases representando os andares de uma escola. | Cada fase representará um andar diferente da escola, totalizando cinco andares com desafios progressivos.
5 | A história do jogo será baseada na proteção de dados dentro de uma escola. |  O jogador assume o papel de um estudante que deve proteger os dados da escola contra ameaças cibernéticas. Durante a jornada, ele aprenderá sobre os conceitos da LGPD e enfrentará desafios que testarão seus conhecimentos na área.
6 | O nível de dificuldade e progressão do jogo será baseado na complexidade das perguntas e desafios. | À medida que o jogador avança nas fases, as perguntas e desafios se tornam mais complexos. No início, as perguntas abordam conceitos básicos da LGPD, mas nas fases finais, exigem um conhecimento mais aprofundado para superar os obstáculos e vencer o jogo.

## 1.3. Público-alvo do Projeto (sprint 2)

De acordo com o nosso parceiro, nosso público abrange alunos, com idades entre 9 e 17 anos, e professores de escolas públicas. Esses alunos estão em diferentes etapas do ensino fundamental e médio, podendo ter distintos níveis de familiaridade com a temática abordada pelo projeto. Já os professores atuam como facilitadores no processo de aprendizado, auxiliando na implementação das atividades e no engajamento dos estudantes. O projeto busca atender às necessidades desse público, oferecendo materiais e metodologias adequadas à sua realidade educacional.

# <a name="c2"></a>2. Visão Geral do Jogo (sprint 2)

## 2.1. Objetivos do Jogo (sprint 2)

O jogo está distribuído em 5 fases. O objetivo final é levar o protagonista até o Data Center da escola, localizado no quinto andar, para impedir que um grupo de hackers faça o upload dos dados de todos. Para avançar, cada fase contém 4 keycards espalhados pelo mapa, protegidos por robôs inimigos. O jogador precisa coletar todos os keycards para desbloquear a última sala da fase, onde encontrará a chave que permite o acesso à próxima fase. Durante essa jornada, será necessário enfrentar batalhas contra inimigos e superar diversos obstáculos enquanto explora a escola.

## 2.2. Características do Jogo (sprint 2)

### 2.2.1. Gênero do Jogo (sprint 2)

O jogo Data Quest se enquadra no gênero RPG (Role-Playing Game), no qual os jogadores assumem o papel de um protagonista e avançam na história ao enfrentar desafios e interagir com o ambiente. O sistema de combate adotado é o turn-based combat (combate baseado em turnos), onde as batalhas ocorrem de forma estratégica, permitindo que o jogador escolha suas ações dentro de cada turno, considerando habilidades, recursos e a melhor abordagem para derrotar os inimigos.

### 2.2.2. Plataforma do Jogo (sprint 2)

O jogo Data Quest será desenvolvido para garantir compatibilidade tanto com desktop quanto com dispositivos móveis, permitindo que os jogadores possam acessá-lo de forma prática e flexível. Para assegurar uma experiência fluida e acessível, o jogo será projetado para rodar diretamente em navegadores da web, sem necessidade de instalação adicional. Os navegadores compatíveis incluem Google Chrome, Opera, Firefox, Safari e Microsoft Edge, garantindo um amplo suporte para diferentes sistemas operacionais e preferências dos usuários.

### 2.2.3. Número de jogadores (sprint 2)

O jogo Data Quest foi projetado para ser uma experiência single-player, oferecendo suporte exclusivo para um único jogador. Todo o desenvolvimento do jogo, incluindo mecânicas, progressão e desafios, foi pensado para proporcionar uma jornada individual imersiva, permitindo que o jogador explore a narrativa, enfrente inimigos e supere obstáculos sem a necessidade de interação com outros jogadores em tempo real.

### 2.2.4. Títulos semelhantes e inspirações (sprint 2)

O desenvolvimento de Data Quest foi inspirado em títulos específicos que serviram como referência tanto para a mecânica quanto para a estética do projeto. As principais influências incluem:

- Pokémon: O sistema de combate por turnos de Data Quest foi inspirado na série de jogos Pokémon, adotando uma abordagem estratégica em que o jogador pode escolher suas ações dentro de cada turno, tornando as batalhas mais táticas e dinâmicas.
- Undertale: A estética visual do jogo, incluindo o design gráfico e as animações das sprites do protagonista, foi influenciada por Undertale. Elementos como pixel art e expressões dinâmicas foram utilizados para trazer personalidade e carisma ao personagem principal, criando uma experiência visual única e envolvente.

### 2.2.5. Tempo estimado de jogo (sprint 5)

O tempo estimado para a conclusão de Data Quest é de aproximadamente 3 horas, considerando que o jogador passe por todas as fases do jogo. Esse tempo pode variar dependendo da habilidade do jogador, da exploração de áreas extras e da dificuldade das batalhas. Cada partida individual dentro do jogo tem uma duração média de até 15 minutos, o que permite que os jogadores aproveitem sessões rápidas e dinâmicas, sem a necessidade de longos períodos de tempo. A experiência de jogo foi planejada para ser tanto acessível quanto desafiadora, com a possibilidade de retorno para revisitar fases e conquistar todos os objetivos dentro de cada mapa.

# <a name="c3"></a>3. Game Design (sprints 2 e 3)

## 3.1. Enredo do Jogo (sprints 2 e 3)

Em um dia comum de aula na escola Bitshine, um hacker com um plano bem elaborado invade a instituição e toma controle dos sistemas internos, trancando as portas de entrada e as salas de aula com alunos dentro. Superando esses obstáculos, ele avança até o quinto e último andar, onde se encontra o Data Center que abriga os servidores com informações sensíveis sobre alunos, professores e a própria escola. O hacker assume o controle dos professores robôs, programados para ensinar os alunos.

Nosso protagonista, Connie, estudante da Bitshine, perde a hora e é acordado apressadamente para se dirigir à escola. Chegando lá, não encontra opções de entrada, mas percebe uma janela que está aberta que leva até a sala do faxineiro da escola. Dentro da sala, Connie e o faxineiro tem uma conversa que contextualiza o conflito da Bitshine e ensina os básicos da LGPD para o jogador.

Desse ponto, o jogador, controlando Connie, vai progredir por cada andar coletando key-cards protegidos pelos professores robôs, controlados pelo hacker, que lhe dá acesso aos diferentes andares da instituição. Ao longo do enredo, o jogador vai encontrar alunos e professores diferentes que o ajudarão a enfrentar os inimigos e que ajudarão a passar conhecimentos das leis LGPD, necessárias para a solução do problema. O objetivo final do protagonista é impedir o sucesso dos planos do hacker e libertar os alunos e professores das salas trancadas, enquanto o jogador aprende sobre a LGPD e a importância da proteção de dados pessoais.

## 3.2. Personagens (sprints 2 e 3)

### 3.2.1. Controláveis

Os jogadores poderão escolher entre seis personagens disponíveis, que representará aluno desajeitado que enfrenta dificuldades com horários e costuma não prestar atenção nas aulas. No entanto, ao longo do jogo, essa falta de atenção se transforma em uma vantagem, pois os personagens se encontram em uma situação onde esses conhecimentos aparentemente negligenciados se tornam suas armas mais poderosas.

Conceitos iniciais da face do personagem:
<br>
<img src ="../assets/concepts/protagonista_conceito2.png" width="200">

Desenhos de maior qualidade feitos do personagem:
<br>
<img src ="../assets/concepts/protag_doodles.png" width="400">

Spritesheet desenvolvida para a Sprint 1. Personagem não tinha cores definidas:
<br>
<img src ="../assets/concepts/protag_sprites_semcor.png">

### 3.2.2. Non-Playable Characters (NPC)

O Hacker Anônimo: Um criminoso cibernético que arquitetou o ataque na escola Bitshine. Seu principal objetivo é obter lucros substanciais por meio da venda de dados roubados, comprometendo a privacidade e a segurança das vítimas no processo.
<br>
<img src ="../assets/concepts/hacker_concept.png" width="400">


Faxineiro: Primeiro personagem que o protagonista vai interagir no jogo. Dará informações sobre o conflito e ensinará o protagonista sobre conceitos básicos das leis LGPD.
<br>
<img src ="../assets/concepts/faxineiro_concept.png" width="400">

(Terão outros personagens coadjuvantes que são aunos e professores da escola, mas esses não foram definidos ainda)

### 3.2.3. Diversidade e Representatividade dos Personagens

Alinhamento com o público-alvo: O jogo se passa no ambiente escolar e aborda a Lei Geral de Proteção de Dados (LGPD), um tema essencial para estudantes que crescem em um mundo digital. Todos os personagens enfrentam desafios comuns, como atrasos e desatenção nas aulas, o que facilita a identificação do público jovem com eles.

Diversidade dentro da realidade do Brasil e impacto esperado: A escola Bitshine é um reflexo da diversidade presente na realidade do Brasil, com personagens que representam diferentes etnias, gêneros e acessibilidade. O jogo oferece aos jogadores a possibilidade de escolher entre seis personagens distintos, permitindo que se identifiquem com aquele que mais se aproxima de sua própria realidade. O impacto esperado é reforçar a importância da inclusão tanto na educação quanto no setor da tecnologia.
## 3.3. Mundo do jogo (sprints 2 e 3)

### 3.3.1. Locações Principais e/ou Mapas (sprints 2 e 3)

O cenário do jogo se passa na escola Bitshine, que foi invadida e hackeada por um criminoso digital. A narrativa se desenrola ao longo de 5 andares diferentes da escola, cada um representando uma fase única. Conforme os jogadores avançam, eles exploram diferentes ambientes como salas de aula trancadas, corredores bloqueados por segurança digital e áreas secretas dentro do prédio. [O mapeamento exato dessas áreas ainda está em desenvolvimento]

<br>

<p align="center">
<img src="../assets/concepts/escola_normal.png" width="400">
<img src="../assets/concepts/escola_hack.png" width="400">
<p>

### 3.3.2. Navegação pelo mundo (sprints 2 e 3)

- As 5 fases do jogo vão se passar nos 5 andares diferentes da escola.
- O protagonista explorará cada andar, entrando em salas diferentes tentando encontrar key-cards.
- Cada andar terá um key-card e a coleção desses cards é essencial para a progressão no jogo.
- Uma fase se encerra quando o protagonista encontrar a chave contida em uma certa sala.
- Assim, o acesso para o próximo andar é liberado e a próxima fase é desbloqueada.

### 3.3.3. Condições climáticas e temporais (sprints 2 e 3)

Embora a história do jogo se desenrole ao longo de um único dia escolar, com eventos acontecendo durante as aulas e interações entre os personagens, não haverá limite de tempo para a conclusão das fases. O objetivo é permitir que o jogador explore cada área da escola, resolva puzzles e interaja com os personagens sem pressões externas relacionadas ao tempo. Isso visa garantir uma experiência mais estratégica e imersiva, focada na resolução de problemas e tomada de decisões.

Além disso, o jogo não incluirá variações climáticas, já que a narrativa ocorre inteiramente dentro da escola Bitshine, que está isolada do ambiente externo devido à invasão hacker. Consequentemente, o clima externo e os ciclos temporais, como mudanças de dia para noite, não serão aplicados ou influenciarão o andamento da história ou das fases. A principal ênfase estará na progressão do enredo, nos desafios internos da escola e na interação com o ambiente hackeado.

### 3.3.4. Concept Art (sprint 2)
<br>
<p align="center">
<img src="../assets/concepts/conceitos_escola_data_quest_hackeada1.png" width="400">
<img src="../assets/concepts/conceitos_escola_data_quest_hackeada2.png" width="400">
<p>

Figuras 1 e 2: Conceitos iniciais da aparência externa da escola Bitshine. Figura 1 representa a escola em seu estado de normalidade e a Figura 2 representa a escola hackeada.

<img src="../assets/concepts/conceitos_protagonista.png" width="300">

Figura 3: Conceitos iniciais do protagonista, Connie.

<img src="../assets/concepts/dialogue_concept.png" width="300">

Figura 4: Conceito inicial do estilo visual do diálogo do jogo.

<img src="../assets/concepts/more_robot_concepts.png" width="300">

Figura 5: Conceitos de ataques feitos pelos inimigos robôs.

<img src="../assets/concepts/robo_concept.png" width="300">

Figura 6: Ilustração do inimigo robô com suas cores definidas.


### 3.3.5. Trilha sonora (sprint 3)

*Descreva a trilha sonora do jogo, indicando quais músicas serão utilizadas no mundo e nas fases. Utilize listas ou tabelas para organizar esta seção. Caso utilize material de terceiros em licença Creative Commons, não deixe de citar os autores/fontes.*

*Exemplo de tabela*
\# | titulo | ocorrência | autoria
--- | --- | --- | ---
1 | tema de abertura | tela de início | própria
2 | tema de combate | cena de combate com inimigos comuns | Hans Zimmer
3 | ... 

## 3.4. Inventário e Bestiário (sprint 3)

### 3.4.1. Inventário

*\<opcional\> Caso seu jogo utilize itens ou poderes para os personagens obterem, descreva-os aqui, indicando títulos, imagens, meios de obtenção e funções no jogo. Utilize listas ou tabelas para organizar esta seção. Caso utilize material de terceiros em licença Creative Commons, não deixe de citar os autores/fontes.* 

*Exemplo de tabela*
\# | item |  | como obter | função | efeito sonoro
--- | --- | --- | --- | --- | ---
1 | moeda | <img src="../assets/coin.png"> | há muitas espalhadas em todas as fases | acumula dinheiro para comprar outros itens | som de moeda
2 | madeira | <img src="../assets/wood.png"> | há muitas espalhadas em todas as fases | acumula madeira para construir casas | som de madeiras
3 | ... 

### 3.4.2. Bestiário

*\<opcional\> Caso seu jogo tenha inimigos, descreva-os aqui, indicando nomes, imagens, momentos de aparição, funções e impactos no jogo. Utilize listas ou tabelas para organizar esta seção. Caso utilize material de terceiros em licença Creative Commons, não deixe de citar os autores/fontes.* 

*Exemplo de tabela*
\# | inimigo |  | ocorrências | função | impacto | efeito sonoro
--- | --- | --- | --- | --- | --- | ---
1 | robô terrestre | <img src="../assets/inimigo2.PNG"> |  a partir da fase 1 | ataca o personagem vindo pelo chão em sua direção, com velocidade constante, atirando parafusos | se encostar no inimigo ou no parafuso arremessado, o personagem perde 1 ponto de vida | sons de tiros e engrenagens girando
2 | robô voador | <img src="../assets/inimigo1.PNG"> | a partir da fase 2 | ataca o personagem vindo pelo ar, fazendo movimento em 'V' quando se aproxima | se encostar, o personagem perde 3 pontos de vida | som de hélice
3 | ... 

## 3.5. Gameflow (Diagrama de cenas) (sprint 2)

*Posicione aqui seu "storyboard de programação" - o diagrama de cenas do jogo. Indique, por exemplo, como o jogo começa, quais opções o jogador tem, como ele avança nas fases, quais as condições de 'game over', como o jogo reinicia. Seu diagrama deve representar as classes, atributos e métodos usados no jogo.*

## 3.6. Regras do jogo (sprint 3)

*Descreva aqui as regras do seu jogo: objetivos/desafios, meios para se conseguir alcançar*

*Ex. O jogador deve pilotar o carro e conseguir terminar a corrida dentro de um minuto sem bater em nenhum obstáculo.*

*Ex. O jogador deve concluir a fase dentro do tempo, para obter uma estrela. Se além disso ele coletar todas as moedas, ganha mais uma estrela. E se além disso ele coletar os três medalhões espalhados, ganha mais uma estrela, totalizando três. Ao final do jogo, obtendo três estrelas em todas as fases, desbloqueia o mundo secreto.*  

## 3.7. Mecânicas do jogo (sprint 3)

*Descreva aqui as formas de controle e interação que o jogador tem sobre o jogo: quais os comandos disponíveis, quais combinações de comandos, e quais as ações consequentes desses comandos. Utilize listas ou tabelas para organizar esta seção.*

*Ex. Em um jogo de plataforma 2D para desktop, o jogador pode usar as teclas WASD para mecânicas de andar, mirar para cima, agachar, e as teclas JKL para atacar, correr, arremesar etc.*

*Ex. Em um jogo de puzzle para celular, o jogador pode tocar e arrastar sobre uma peça para movê-la sobre o tabuleiro, ou fazer um toque simples para rotacioná-la*

## 3.8. Implementação Matemática de Animação/Movimento (sprint 3)

*Descreva aqui a função que implementa a movimentação/animação de personagens ou elementos gráficos no seu jogo. Sua função deve se basear em alguma formulação matemática (e.g. fórmula de aceleração). A explicação do funcionamento desta função deve conter notação matemática formal de fórmulas/equações. Se necessário, crie subseções para sua descrição.*

# <a name="c4"></a>4. Desenvolvimento do Jogo

## 4.1. Desenvolvimento preliminar do jogo (sprint 1)

A primeira versão do jogo foi desenvolvida com foco na implementação das mecânicas essenciais, garantindo que a estrutura básica estivesse funcional. Durante essa fase inicial, trabalhamos na movimentação do personagem, na interação com NPCs, no sistema de combate baseado em perguntas e respostas sobre a Lei Geral de Proteção de Dados (LGPD) e na estruturação da primeira fase dentro do cenário escolar.

Em termos de código, foi implementado um sistema de movimentação utilizando as teclas WASD, permitindo que o jogador navegue pelo ambiente do jogo de forma fluida. Além disso, foi criada a mecânica de interação com personagens não jogáveis (NPCs), possibilitando diálogos que fornecem informações e desafios ao jogador. O combate foi desenvolvido com um modelo inovador de perguntas e respostas, no qual o progresso depende do conhecimento do jogador sobre LGPD. Caso acerte as respostas, o jogador avança; caso contrário, perde pontos ou enfrenta consequências dentro do jogo.

A estrutura das fases foi pensada para representar os cinco andares de uma escola, onde cada fase corresponde a um andar. Isso cria uma progressão lógica e imersiva, incentivando o jogador a explorar novos desafios conforme avança. Essa abordagem contribui para a ambientação e narrativa do jogo, tornando a experiência mais envolvente.

### Ilustrações e Prints de Tela
<p align="center">
  <img src="https://github.com/Daniel00Meiches/DataQuest-M1/blob/main/assets/telainicial.jpeg" width="500">
  <img src="https://github.com/Daniel00Meiches/DataQuest-M1/blob/main/assets/teladefases.jpeg" width="500">
  <img src="https://github.com/Daniel00Meiches/DataQuest-M1/blob/main/assets/telacomojogar.png" width="500">
  <img src="https://github.com/Daniel00Meiches/DataQuest-M1/blob/main/assets/telajogocenario.png" width="500">
  
</p>

### Dificuldades Encontradas
Durante o desenvolvimento, algumas dificuldades foram identificadas. A implementação do sistema de diálogos exigiu ajustes para garantir que os textos fossem exibidos corretamente e fluíssem de maneira natural. No sistema de combate, um dos desafios foi equilibrar a dificuldade das perguntas para que o jogo permanecesse desafiador sem ser frustrante. Além disso, alguns problemas técnicos surgiram na movimentação do personagem, como colisões inesperadas e ajustes na resposta do teclado.

Outra questão foi o design das fases. Criar um ambiente escolar que fosse visualmente interessante e intuitivo para navegação exigiu várias iterações. Ainda estamos aprimorando a disposição dos elementos no cenário para tornar a progressão mais clara ao jogador.

Os próximos passos incluem a melhoria do sistema de combate, tornando as perguntas mais dinâmicas, a expansão dos diálogos com NPCs para enriquecer a interação, o refinamento dos cenários e fases para uma progressão mais intuitiva, além da correção de bugs e otimização do código. Também planejamos adicionar trilha sonora e efeitos visuais para aumentar a imersão do jogador.

## 4.2. Desenvolvimento básico do jogo (sprint 2)

*Descreva e ilustre aqui o desenvolvimento da versão básica do jogo, explicando brevemente o que foi entregue em termos de código e jogo. Utilize prints de tela para ilustrar. Indique as eventuais dificuldades e próximos passos.*

Durante o sprint 2, focamos em aprimorar o personagem principal e introduzir novos personagens, o que enriqueceu a narrativa e a jogabilidade do jogo. Os novos personagens foram integrados de forma a complementar a história, trazendo diversidade e ampliando as possibilidades de interação.
Além disso, criamos e implementamos diálogos entre os personagens. Essa funcionalidade foi essencial para tornar a experiência do jogador mais imersiva, permitindo o desenvolvimento da trama de forma mais dinâmica. A implementação envolveu a construção de um sistema básico de diálogos, com ramificações que afetam o progresso do jogador.
Outro ponto importante deste sprint foi o aprimoramento e a conclusão da fase 01. Foram feitos ajustes no design do cenário, correção de bugs e otimização da mecânica de jogo, garantindo uma experiência fluida e envolvente para o jogador.

Dificuldades Encontradas:

 - Ajuste preciso da sincronização dos diálogos com as ações dos personagens.
 - Problemas de desempenho ao adicionar novos personagens, exigindo otimização do código.
 - Balanceamento da dificuldade da fase 01 para manter o jogo desafiador, mas acessível.

Próximos Passos:
- Implementação da fase 02, com novos desafios e ambientes.
- Melhoria no sistema de diálogos, incluindo opções de resposta mais complexas.
- Testes de jogabilidade para refinar a experiência do usuário.

Ilustrações do Desenvolvimento

(Inserir aqui prints de tela que demonstrem os novos personagens, exemplos de diálogos e a fase 01 concluída)



## 4.3. Desenvolvimento intermediário do jogo (sprint 3)

*Descreva e ilustre aqui o desenvolvimento da versão intermediária do jogo, explicando brevemente o que foi entregue em termos de código e jogo. Utilize prints de tela para ilustrar. Indique as eventuais dificuldades e próximos passos.*

## 4.4. Desenvolvimento final do MVP (sprint 4)

*Descreva e ilustre aqui o desenvolvimento da versão final do jogo, explicando brevemente o que foi entregue em termos de MVP. Utilize prints de tela para ilustrar. Indique as eventuais dificuldades e planos futuros.*

## 4.5. Revisão do MVP (sprint 5)

*Descreva e ilustre aqui o desenvolvimento dos refinamentos e revisões da versão final do jogo, explicando brevemente o que foi entregue em termos de MVP. Utilize prints de tela para ilustrar.*

# <a name="c5"></a>5. Testes

## 5.1. Casos de Teste (sprints 2 a 4)

*Descreva nesta seção os casos de teste comuns que podem ser executados a qualquer momento para testar o funcionamento e integração das partes do jogo. Utilize tabelas para facilitar a organização.*

*Exemplo de tabela*
\# | pré-condição | descrição do teste | pós-condição 
--- | --- | --- | --- 
1 | posicionar o jogo na tela de abertura | iniciar o jogo desde seu início | o jogo deve iniciar da fase 1
2 | posicionar o personagem em local seguro de inimigos | aguardar o tempo passar até o final da contagem | o personagem deve perder uma vida e reiniciar a fase
3 | ...

## 5.2. Testes de jogabilidade (playtests) (sprint 4)

### 5.2.1 Registros de testes

*Descreva nesta seção as sessões de teste/entrevista com diferentes jogadores. Registre cada teste conforme o template a seguir.*

Nome | João Jonas (use nomes fictícios)
--- | ---
Já possuía experiência prévia com games? | sim, é um jogador casual
Conseguiu iniciar o jogo? | sim
Entendeu as regras e mecânicas do jogo? | entendeu as regras, mas sobre as mecânicas, apenas as essenciais, não explorou os comandos complexos
Conseguiu progredir no jogo? | sim, sem dificuldades  
Apresentou dificuldades? | Não, conseguiu jogar com facilidade e afirmou ser fácil
Que nota deu ao jogo? | 9.0
O que gostou no jogo? | Gostou  de como o jogo vai ficando mais difícil ao longo do tempo sem deixar de ser divertido
O que poderia melhorar no jogo? | A responsividade do personagem aos controles, disse que havia um pouco de atraso desde o momento do comando até a resposta do personagem

### 5.2.2 Melhorias

*Descreva nesta seção um plano de melhorias sobre o jogo, com base nos resultados dos testes de jogabilidade*

# <a name="c6"></a>6. Conclusões e trabalhos futuros (sprint 5)

*Escreva de que formas a solução do jogo atingiu os objetivos descritos na seção 1 deste documento. Indique pontos fortes e pontos a melhorar de maneira geral.*

*Relacione os pontos de melhorias evidenciados nos testes com plano de ações para serem implementadas no jogo. O grupo não precisa implementá-las, pode deixar registrado aqui o plano para futuros desenvolvimentos.*

*Relacione também quaisquer ideias que o grupo tenha para melhorias futuras*

# <a name="c7"></a>7. Referências (sprint 5)

_Incluir as principais referências de seu projeto, para que seu parceiro possa consultar caso ele se interessar em aprofundar. Um exemplo de referência de livro e de site:_<br>

LUCK, Heloisa. Liderança em gestão escolar. 4. ed. Petrópolis: Vozes, 2010. <br>
SOBRENOME, Nome. Título do livro: subtítulo do livro. Edição. Cidade de publicação: Nome da editora, Ano de publicação. <br>

INTELI. Adalove. Disponível em: https://adalove.inteli.edu.br/feed. Acesso em: 1 out. 2023 <br>
SOBRENOME, Nome. Título do site. Disponível em: link do site. Acesso em: Dia Mês Ano

# <a name="c8"></a>Anexos

*Inclua aqui quaisquer complementos para seu projeto, como diagramas, imagens, tabelas etc. Organize em sub-tópicos utilizando headings menores (use ## ou ### para isso)*
