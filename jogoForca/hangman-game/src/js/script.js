// Game Configuration
const GAME_CONFIG = {
  initialCredits: 50,
  hintCost: 10,
  scorePerWord: 10,
  diamondsPerWin: 3,
  minWordsPerRound: 2,
};

// Game State
const gameState = {
  currentRoundIndex: 0,
  palavraSecreta: "",
  palavraExibida: [],
  letrasErradas: [],
  erros: 0,
  score: 0,
  palavrasAcertadasNaRodada: 0,
  playerCredits: GAME_CONFIG.initialCredits,
};

// Game Data
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

// DOM Elements
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

// Sound Functions
const SoundManager = {
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

// Game Logic Functions
class GameManager {
  static initializeGame() {
    gameState.erros = 0;
    gameState.score = 0;
    gameState.currentRoundIndex = 0;
    gameState.palavrasAcertadasNaRodada = 0;
    gameState.playerCredits = GAME_CONFIG.initialCredits;
    this.updateUI();
    this.startRound(gameState.currentRoundIndex);
  }

  static startRound(roundIndex) {
    this.resetRoundState();
    const availableWords = this.getAvailableWords(roundIndex);
    gameState.palavraSecreta = this.selectRandomWord(availableWords);
    gameState.palavraExibida = this.createHiddenWord(gameState.palavraSecreta);
    this.updateUI();
  }

  static resetRoundState() {
    gameState.erros = 0;
    gameState.letrasErradas = [];
    elements.forcaImagem.src = "img/img/forca00.png";
    elements.btnChutar.disabled = false;
    elements.entradaLetra.disabled = false;
    elements.botaoReiniciar.style.display = "none";
  }

  static getAvailableWords(roundIndex) {
    return rounds[roundIndex].words;
  }

  static selectRandomWord(words) {
    return words[Math.floor(Math.random() * words.length)];
  }

  static createHiddenWord(word) {
    return word.split("").map((char) => (char === " " ? " " : "_"));
  }

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

  static isValidGuess(letra) {
    return (
      letra &&
      letra.match(/^[a-z]$/) &&
      !gameState.palavraExibida.includes(letra) &&
      !gameState.letrasErradas.includes(letra)
    );
  }

  static revealLetter(letra) {
    for (let i = 0; i < gameState.palavraSecreta.length; i++) {
      if (gameState.palavraSecreta[i] === letra) {
        gameState.palavraExibida[i] = letra;
      }
    }
  }

  static handleWrongGuess(letra) {
    SoundManager.playErrorSound();
    gameState.letrasErradas.push(letra);
    gameState.erros++;
    elements.forcaImagem.src = `img/img/forca0${gameState.erros}.png`;
  }

  static checkGameStatus() {
    if (!gameState.palavraExibida.includes("_")) {
      this.handleVictory();
    } else if (gameState.erros >= 7) {
      this.handleDefeat();
    }
  }

  static handleVictory() {
    gameState.score += GAME_CONFIG.scorePerWord;
    gameState.palavrasAcertadasNaRodada++;
    gameState.playerCredits += GAME_CONFIG.diamondsPerWin;
    this.updateUI();
    this.showVictoryModal();
  }

  static handleDefeat() {
    document.getElementById("correct-word").textContent =
      gameState.palavraSecreta;
    this.disableGameControls();
    this.showDefeatAnimation();
  }

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

  static showVictoryModal() {
    elements.mensagemModal.textContent = `Parabéns! Você completou ${gameState.palavrasAcertadasNaRodada}/${GAME_CONFIG.minWordsPerRound} palavras desta rodada.`;
    elements.proximaRodadaBtn.style.display =
      gameState.palavrasAcertadasNaRodada >= GAME_CONFIG.minWordsPerRound
        ? "inline-block"
        : "none";
    elements.modalVitoria.style.display = "block";
  }

  static disableGameControls() {
    elements.btnChutar.disabled = true;
    elements.entradaLetra.disabled = true;
    elements.botaoReiniciar.style.display = "block";
  }

  static showDefeatAnimation() {
    document.getElementById("game-over-modal").style.display = "block";
  }
}

// Event Listeners
document.addEventListener("DOMContentLoaded", () => {
  // Initialize click sound
  elements.clickSound
    .play()
    .then(() => {
      elements.clickSound.pause();
      elements.clickSound.currentTime = 0;
    })
    .catch(console.error);

  // Add click sound to all buttons
  document.querySelectorAll("button").forEach((btn) => {
    btn.addEventListener("click", SoundManager.playClickSound);
  });

  // Start game button
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

  // Game controls
  elements.btnChutar.addEventListener("click", () => {
    const letra = elements.entradaLetra.value.toLowerCase();
    elements.entradaLetra.value = "";
    GameManager.processGuess(letra);
  });

  elements.entradaLetra.addEventListener("keypress", (event) => {
    if (event.key === "Enter") elements.btnChutar.click();
  });

  elements.botaoReiniciar.addEventListener("click", () => {
    gameState.currentRoundIndex =
      (gameState.currentRoundIndex + 1) % rounds.length;
    GameManager.startRound(gameState.currentRoundIndex);
  });

  elements.hintButton.addEventListener("click", () =>
    GameManager.processHint()
  );

  // Modal controls
  elements.fecharModal.addEventListener("click", () => {
    elements.modalVitoria.style.display = "none";
  });

  elements.proximaRodadaBtn.addEventListener("click", () => {
    elements.modalVitoria.style.display = "none";
    if (gameState.palavrasAcertadasNaRodada >= GAME_CONFIG.minWordsPerRound) {
      gameState.palavrasAcertadasNaRodada = 0;
      gameState.currentRoundIndex =
        (gameState.currentRoundIndex + 1) % rounds.length;
    }
    GameManager.startRound(gameState.currentRoundIndex);
  });

  elements.permanecerRodadaBtn.addEventListener("click", () => {
    elements.modalVitoria.style.display = "none";
    const availableWords = GameManager.getAvailableWords(
      gameState.currentRoundIndex
    );
    const usedWord = gameState.palavraSecreta;

    // Filter out the word that was just used
    const remainingWords = availableWords.filter((word) => word !== usedWord);

    // If there are no more words, use all words again
    const wordsToChooseFrom =
      remainingWords.length > 0 ? remainingWords : availableWords;

    // Select a new random word
    gameState.palavraSecreta = GameManager.selectRandomWord(wordsToChooseFrom);
    GameManager.resetRoundState();
    gameState.palavraExibida = GameManager.createHiddenWord(
      gameState.palavraSecreta
    );
    GameManager.updateUI();
  });

  document.getElementById("play-again-btn").addEventListener("click", () => {
    document.getElementById("game-over-modal").style.display = "none";
    GameManager.startRound(gameState.currentRoundIndex);
  });
});