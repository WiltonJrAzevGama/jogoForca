// Configuração do Jogoc.
const GAME_CONFIG = {
  initialCredits: 50, // Créditos iniciais do jogador
  hintCost: 10, // Custo para usar uma dica
  scorePerWord: 10, // Pontos ganhos por palavra acertada
  diamondsPerWin: 3, // Diamantes ganhos por vitória
  minWordsPerRound: 2, // Mínimo de palavras necessárias por rodada
};

// Estado do Jogo: Mantém o controle do estado atual do jogo, como rodada atual, pontuação e créditos
const gameState = {
  currentRoundIndex: 0, // Índice da rodada atual
  palavraSecreta: "", // Palavra que o jogador precisa adivinhar
  palavraExibida: [], // Array com letras reveladas e ocultas (_)
  letrasErradas: [], // Letras erradas já tentadas
  erros: 0, // Contador de erros
  score: 0, // Pontuação total
  palavrasAcertadasNaRodada: 0, // Palavras acertadas na rodada atual
  playerCredits: GAME_CONFIG.initialCredits, // Créditos do jogador
};

// Dados do Jogo
const rounds = [
  {
    title: "Rodada de Animais",
    words: ["cachorro", "gato", "elefante", "girafa", "tigre", "leão", "sapo"],
  },
  {
    title: "Rodada de Frutas",
    words: ["banana", "abacaxi", "morango", "laranja", "uva"],
  },
  {
    title: "Rodada de Estados",
    words: [
      "Tocantins",
      "Bahia",
      "Ceará",
      "Paraná",
      "São Paulo",
      "Rio de Janeiro",
      "Acre",
      "Alagoas",
    ],
  },
];

// Elementos do DOM: Referências aos elementos HTML usados no jogo
const elements = {
  telaInicial: document.getElementById("tela-inicial"),
  jogoContainer: document.getElementById("jogo-container"),
  nomeUsuarioInput: document.getElementById("nome-usuario"),
  roundMessage: document.getElementById("round-message"),
  exibicaoPalavra: document.getElementById("exibicao-palavra"),
  letrasChutadas: document.getElementById("letras-chutadas"),
  mensagem: document.getElementById("mensagem"),
  botaoReiniciar: document.getElementById("botao-reiniciar"),
  entradaLetra: document.getElementById("entrada-letra"),
  btnChutar: document.getElementById("btn-chutar"),
  modalVitoria: document.getElementById("modal-vitoria"),
  mensagemModal: document.getElementById("mensagem-modal"),
  fecharModal: document.getElementById("fechar-modal"),
  forcaImagem: document.getElementById("forca-imagem"),
  proximaRodadaBtn: document.getElementById("proxima-rodada-btn"),
  permanecerRodadaBtn: document.getElementById("permanecer-rodada-btn"),
  hintButton: document.getElementById("hint-button"),
  playerCreditsElement: document.getElementById("player-credits"),
  scoreElement: document.getElementById("score"),
  clickSound: document.getElementById("click-sound"),
  errorSound: document.getElementById("error-sound"),
};

// Gerenciador de Sons: Controla a reprodução dos efeitos sonoros do jogo
const SoundManager = {
  // Reproduz o som de clique
  async playClickSound() {
    try {
      if (elements.clickSound) {
        elements.clickSound.currentTime = 0;
        await elements.clickSound.play();
      }
    } catch (error) {
      console.error("Erro ao tocar som:", error);
    }
  },

  // Reproduz o som de erro
  async playErrorSound() {
    try {
      if (elements.errorSound) {
        elements.errorSound.currentTime = 0;
        await elements.errorSound.play();
      }
    } catch (error) {
      console.error("Erro ao tocar som:", error);
    }
  },
};

// Classe GameManager: Contém toda a lógica principal do jogo
class GameManager {
  // Inicializa o jogo resetando o estado e iniciando a primeira rodada
  static initializeGame() {
    gameState.erros = 0;
    gameState.score = 0;
    gameState.currentRoundIndex = 0;
    gameState.palavrasAcertadasNaRodada = 0;
    gameState.playerCredits = GAME_CONFIG.initialCredits;
    this.updateUI();
    this.startRound(gameState.currentRoundIndex);
  }

  // Inicia uma nova rodada selecionando uma palavra aleatória
  static startRound(roundIndex) {
    this.resetRoundState();
    const availableWords = this.getAvailableWords(roundIndex);
    gameState.palavraSecreta = this.selectRandomWord(availableWords);
    gameState.palavraExibida = this.createHiddenWord(gameState.palavraSecreta);
    this.updateUI();
  }

  // Reseta o estado da rodada atual
  static resetRoundState() {
    gameState.erros = 0;
    gameState.letrasErradas = [];
    elements.forcaImagem.src = "img/img/forca00.png";
    elements.btnChutar.disabled = false;
    elements.entradaLetra.disabled = false;
    elements.botaoReiniciar.style.display = "none";
  }

  // Obtém a lista de palavras disponíveis para a rodada atual
  static getAvailableWords(roundIndex) {
    return rounds[roundIndex].words;
  }

  // Seleciona uma palavra aleatória da lista de palavras disponíveis
  static selectRandomWord(words) {
    return words[Math.floor(Math.random() * words.length)];
  }

  // Cria uma versão oculta da palavra, substituindo letras por underscores
  static createHiddenWord(word) {
    return word.split("").map((char) => (char === " " ? " " : "_"));
  }

  // Processa a tentativa do jogador e atualiza o estado do jogo
  static processGuess(letra) {
    if (!this.isValidGuess(letra)) return;

    if (gameState.palavraSecreta.includes(letra)) {
      this.revealLetter(letra);
    } else {
      this.handleWrongGuess(letra);
    }

    this.updateUI();
    this.checkGameStatus();
  }

  // Valida se a tentativa do jogador é válida (letra única e não tentada antes)
  static isValidGuess(letra) {
    return (
      letra &&
      letra.match(/^[a-z]$/) &&
      !gameState.palavraExibida.includes(letra) &&
      !gameState.letrasErradas.includes(letra)
    );
  }

  // Revela a letra adivinhada na palavra exibida
  static revealLetter(letra) {
    for (let i = 0; i < gameState.palavraSecreta.length; i++) {
      if (gameState.palavraSecreta[i] === letra) {
        gameState.palavraExibida[i] = letra;
      }
    }
  }

  // Processa uma tentativa errada, tocando som de erro e atualizando o estado
  static handleWrongGuess(letra) {
    SoundManager.playErrorSound();
    gameState.letrasErradas.push(letra);
    gameState.erros++;
    elements.forcaImagem.src = `img/img/forca0${gameState.erros}.png`;
  }

  // Verifica o status do jogo para determinar vitória ou derrota
  static checkGameStatus() {
    if (!gameState.palavraExibida.includes("_")) {
      this.handleVictory();
    } else if (gameState.erros >= 7) {
      this.handleDefeat();
    }
  }

  // Processa a vitória atualizando pontuação e mostrando modal
  static handleVictory() {
    gameState.score += GAME_CONFIG.scorePerWord;
    gameState.palavrasAcertadasNaRodada++;
    gameState.playerCredits += GAME_CONFIG.diamondsPerWin;
    this.updateUI();
    this.showVictoryModal();
  }

  // Processa a derrota mostrando a palavra correta e desabilitando controles
  static handleDefeat() {
    document.getElementById("correct-word").textContent =
      gameState.palavraSecreta;
    this.disableGameControls();
    this.showDefeatAnimation();
  }

  // Atualiza os elementos da interface com o estado atual do jogo
  static updateUI() {
    elements.exibicaoPalavra.textContent = gameState.palavraExibida.join(" ");
    elements.letrasChutadas.textContent = gameState.letrasErradas.join(" ");
    elements.scoreElement.textContent = gameState.score;
    elements.playerCreditsElement.textContent = gameState.playerCredits;
    elements.hintButton.disabled =
      gameState.playerCredits < GAME_CONFIG.hintCost;
    elements.roundMessage.textContent =
      rounds[gameState.currentRoundIndex].title;
  }

  // Processa pedido de dica revelando uma letra aleatória
  static processHint() {
    if (gameState.playerCredits < GAME_CONFIG.hintCost) return;

    const hiddenLetters = gameState.palavraSecreta
      .split("")
      .filter((letra) => !gameState.palavraExibida.includes(letra));

    if (hiddenLetters.length > 0) {
      const randomLetter =
        hiddenLetters[Math.floor(Math.random() * hiddenLetters.length)];
      gameState.playerCredits -= GAME_CONFIG.hintCost;
      this.revealLetter(randomLetter);
      this.updateUI();
      this.checkGameStatus();
    }
  }

  // Exibe o modal de vitória com mensagem apropriada
  static showVictoryModal() {
    elements.mensagemModal.textContent = `Parabéns! Você completou ${gameState.palavrasAcertadasNaRodada}/${GAME_CONFIG.minWordsPerRound} palavras desta rodada.`;
    elements.proximaRodadaBtn.style.display =
      gameState.palavrasAcertadasNaRodada >= GAME_CONFIG.minWordsPerRound
        ? "inline-block"
        : "none";
    elements.modalVitoria.style.display = "block";
  }

  // Desabilita os controles do jogo após derrota
  static disableGameControls() {
    elements.btnChutar.disabled = true;
    elements.entradaLetra.disabled = true;
    elements.botaoReiniciar.style.display = "block";
  }

  // Exibe a animação/modal de derrota
  static showDefeatAnimation() {
    document.getElementById("game-over-modal").style.display = "block";
  }
}

// Event Listeners: Configura os ouvintes de eventos para interações do usuário
document.addEventListener("DOMContentLoaded", () => {
  // Inicializa o som de clique
  elements.clickSound
    .play()
    .then(() => {
      elements.clickSound.pause();
      elements.clickSound.currentTime = 0;
    })
    .catch(console.error);

  // Adiciona som de clique a todos os botões
  document.querySelectorAll("button").forEach((btn) => {
    btn.addEventListener("click", SoundManager.playClickSound);
  });

  // Botão de iniciar jogo
  document.getElementById("start-game").addEventListener("click", () => {
    const nomeInput = elements.nomeUsuarioInput;
    const errorMessage = document.getElementById("name-error");

    if (!nomeInput.value.trim() || nomeInput.value.length < 2) {
      nomeInput.classList.add("invalid");
      errorMessage.classList.add("visible");
      return;
    }

    nomeInput.classList.remove("invalid");
    errorMessage.classList.remove("visible");

    elements.telaInicial.style.display = "none";
    elements.jogoContainer.style.display = "block";
    GameManager.initializeGame();

    const nomeJogador = nomeInput.value.trim();
    alert(`Bem-vindo, ${nomeJogador}!`);
  });

  // Controles do jogo
  elements.btnChutar.addEventListener("click", () => {
    const letra = elements.entradaLetra.value.toLowerCase();
    elements.entradaLetra.value = "";
    GameManager.processGuess(letra);
  });

  // Controles de teclado
  elements.entradaLetra.addEventListener("keypress", (event) => {
    if (event.key === "Enter") elements.btnChutar.click();
  });

  // Botão de reiniciar
  elements.botaoReiniciar.addEventListener("click", () => {
    gameState.currentRoundIndex =
      (gameState.currentRoundIndex + 1) % rounds.length;
    GameManager.startRound(gameState.currentRoundIndex);
  });

  // Botão de dica
  elements.hintButton.addEventListener("click", () =>
    GameManager.processHint()
  );

  // Controles do modal
  elements.fecharModal.addEventListener("click", () => {
    elements.modalVitoria.style.display = "none";
  });

  // Botão próxima rodada
  elements.proximaRodadaBtn.addEventListener("click", () => {
    elements.modalVitoria.style.display = "none";
    if (gameState.palavrasAcertadasNaRodada >= GAME_CONFIG.minWordsPerRound) {
      gameState.palavrasAcertadasNaRodada = 0;
      gameState.currentRoundIndex =
        (gameState.currentRoundIndex + 1) % rounds.length;
    }
    GameManager.startRound(gameState.currentRoundIndex);
  });

  // Botão permanecer na rodada
  elements.permanecerRodadaBtn.addEventListener("click", () => {
    elements.modalVitoria.style.display = "none";
    const availableWords = GameManager.getAvailableWords(
      gameState.currentRoundIndex
    );
    const usedWord = gameState.palavraSecreta;

    // Filtra a palavra que acabou de ser usada
    const remainingWords = availableWords.filter((word) => word !== usedWord);

    // Se não houver mais palavras, usa todas novamente
    const wordsToChooseFrom =
      remainingWords.length > 0 ? remainingWords : availableWords;

    // Seleciona uma nova palavra aleatória
    gameState.palavraSecreta = GameManager.selectRandomWord(wordsToChooseFrom);
    GameManager.resetRoundState();
    gameState.palavraExibida = GameManager.createHiddenWord(
      gameState.palavraSecreta
    );
    GameManager.updateUI();
  });

  // Botão jogar novamente
  document.getElementById("play-again-btn").addEventListener("click", () => {
    document.getElementById("game-over-modal").style.display = "none";
    GameManager.startRound(gameState.currentRoundIndex);
  });
});
