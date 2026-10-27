# Laboratório Curie · Mulheres na Ciência

Experiência para projeção no minicurso do IFAM, com laboratório explorável, linha do tempo e desafio de dez perguntas em equipes.

## Abrir sem internet

Abra `dist/index.html` no navegador. Os estilos, os scripts e a imagem estão incluídos; não há fontes ou bibliotecas externas. Preserve a pasta `dist` inteira ao copiar para outro computador. Se uma versão antiga estiver aberta, use Ctrl+F5.

## Conduzir o desafio

1. Explore os seis objetos com o mouse, clique, toque ou teclado.
2. Selecione os anos da linha do tempo para conversar sobre a trajetória.
3. Entre em “O desafio”, configure de 2 a 30 equipes e personalize seus nomes.
4. Escolha 30, 45 ou 60 segundos de discussão, ou use o modo sem cronômetro.
5. Leia cada curiosidade, abra a pergunta e registre A, B, C, D ou “—” para cada equipe.
6. Revele o gabarito comentado e avance pelo placar até a rodada seguinte.

Cada acerto vale 100 pontos. Empates compartilham a colocação. A opção de corrigir registro recalcula os pontos, sem duplicá-los. A pergunta final de reflexão não tem pontuação.

## Salvamento

A partida é salva no armazenamento local do navegador, quando permitido. Use “Continuar partida” após recarregar. O cronômetro fica pausado quando a aba perde visibilidade ou quando você consulta o placar. Ao chegar a zero, o professor ainda pode concluir o registro das respostas. O tempo não avança automaticamente para outra pergunta.

O salvamento depende do navegador, computador e endereço utilizados. A versão por arquivo e a versão hospedada não compartilham partidas. Não há cadastro, sincronização entre aparelhos ou respostas enviadas por celulares.

## Editar conteúdo

`dist/content.js` reúne fichas dos objetos, anos da linha do tempo, perguntas, alternativas, gabaritos, explicações e fontes. `correct` usa índices começando em zero: A = 0, B = 1, C = 2, D = 3.

A imagem é uma recriação artística gerada com a ferramenta integrada ImageGen, e não um registro documental. Prompt: laboratório parisiense por volta de 1900, luz quente, madeira e verde profundo, sem pessoas ou inscrições, com seis objetos separados (balança, mineral, medidor elétrico, vidrarias, caderno e frascos) para exploração interativa. A imagem final está em `dist/assets/laboratorio.png`.

As referências históricas estão no botão “Fontes & créditos” e nos links de cada ficha e explicação.

## Prévia por HTTP, opcional

Com Python instalado, execute na pasta do projeto:

```powershell
python -m http.server 4173 --bind 127.0.0.1 --directory dist
```

Abra http://127.0.0.1:4173. Para encerrar, pressione Ctrl+C no terminal do servidor.

## Estrutura

- `dist/index.html`: estrutura da aplicação.
- `dist/styles.css`: identidade visual e layouts responsivos.
- `dist/app.js`: navegação, interações e regras do jogo.
- `dist/content.js`: conteúdo editorial e fontes.
- `dist/assets/`: imagem local e ícone.

Não há etapa de instalação ou compilação. O diretório de publicação é `dist`.

## Publicar no GitHub Pages

O fluxo `.github/workflows/pages.yml` publica apenas a pasta `dist`, usando as ações oficiais do GitHub. Ele é executado ao atualizar o site na branch `main` e também pode ser iniciado manualmente.

Após enviar o projeto para um repositório no GitHub, configure **Settings → Pages → Build and deployment → Source → GitHub Actions**. Depois acompanhe a execução em **Actions → Publicar Laboratório Curie**. O endereço público será informado pelo GitHub na implantação concluída.

Os alunos podem navegar pela experiência sem cadastro. O quiz continua funcionando no próprio navegador: cada visitante configura suas equipes e mantém sua própria partida local. Os resultados não são enviados a um servidor.
