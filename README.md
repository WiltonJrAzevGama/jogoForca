# Jogo da Forca

Este é um jogo da forca interativo desenvolvido com HTML, CSS e JavaScript. O jogo permite que os jogadores adivinhem palavras em rodadas temáticas, com um sistema de pontuação, dicas e créditos.

## Funcionalidades

- **Rodadas Temáticas**: Palavras organizadas por temas como animais, frutas e estados.
- **Sistema de Pontuação**: Pontos são ganhos ao acertar palavras.
- **Sistema de Créditos**: Créditos podem ser usados para obter dicas.
- **Dicas**: Permite revelar uma letra da palavra secreta ao custo de créditos.
- **Efeitos Sonoros**: Sons para interações e erros.
- **Interface Amigável**: Design responsivo e intuitivo.
- **Modal de Vitória e Derrota**: Feedback visual para o jogador ao final de cada rodada.

## Como Jogar

1. Abra o arquivo `index.html` no navegador.
2. Digite seu nome na tela inicial e clique em "Começar Jogo".
3. Tente adivinhar a palavra chutando uma letra por vez.
4. Use o botão de dica para revelar uma letra (custa 10 créditos).
5. Complete a palavra antes de cometer 7 erros para vencer a rodada.
6. Avance para a próxima rodada ou continue na rodada atual.


## Tecnologias Utilizadas

- **HTML**: Estrutura da interface do jogo.
- **CSS**: Estilização e design responsivo.
- **JavaScript**: Lógica do jogo e manipulação do DOM.



### Configuração do Jogo
O objeto `GAME_CONFIG` define as configurações principais, como créditos iniciais, custo de dicas e pontuação por palavra.

### Estado do Jogo
O objeto `gameState` mantém o estado atual do jogo, incluindo a palavra secreta, letras erradas, pontuação e créditos do jogador.

### Gerenciamento do Jogo
A classe `GameManager` contém toda a lógica principal do jogo, como:
- Inicialização do jogo e rodadas.
- Processamento de tentativas e dicas.
- Atualização da interface do usuário.
- Verificação de vitória ou derrota.



### Eventos
Os eventos são configurados para interações do jogador, como:
- Iniciar o jogo.
- Chutar uma letra.
- Usar uma dica.
- Reiniciar o jogo.

