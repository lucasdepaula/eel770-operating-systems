# Jogo da Velha Online
Trabalho avaliativo desenvolvido para a disciplina EEL770 - Sistemas Operacionais do curso de Engenharia de Computação e Informação da Escola Politécnica da UFRJ no período 2018-1, sob orientação do professor Pedro Henrique Cruz Caminha.
## Autores
Lucas Santos de Paula - lucasdepaula at poli . ufrj . br
Lucas Vieira - lucasvg at poli . ufrj . br

## Objetivo
O objetivo desse trabalho é implementar um **jogo da velha** (*tic tac toe*) online que permita múltiplas salas (diversas partidas podem ocorrer simultaneamente entre pares de jogadores).


## Fluxo do Jogo

![Fluxograma do Jogo](https://github.com/lucasdepaula/eel770-operating-systems/raw/master/doc/Fluxogram.jpg)

## Arquitetura do Projeto

O código foi estruturado em cima da arquitetura **MVC** (*Model-View-Controller*) por ser eficiente e ser de fácil compreensão e manutenção.

## Arquitetura do Sistema

Por ser desenvolvido utilizando Javascript - NodeJS, nosso sistema não foi desenvolvido com o uso de threads, mas sim com processos, devido a limitações da linguagem. Porém,  por ser um sistema multiprocessado e todos os processos filhos (*clusters*) se comunicam através de tecnologias de websockets, o sistema tem características de um sistema distribuído, sendo totalmente escalável, o que traz uma enorme vantagem sobre os sistemas multithreaded.
Uma outra tecnologia que ajudaria a garantir sincronia entre processos seria memória compartilhada, porém esta também não é suportada pelo Node. A solução foi utilizar um banco de dados orientado a documentos (**MongoDB**) para persistir informações relacionadas àquela execução do sistema. São armazenados no banco:

 1. Informações da partida (estado do tabuleiro, vez, participantes), que devem estar sincronizadas entre todos os processos de servidores web.
 2. Sessão dos participantes associada à sala no qual se encontram para que, quando um jogador faça uma jogada, seja verificada executada na sala correta.

## Medidas de Segurança

Como todo sistema que atende a usuários, e por se tratar de um jogo, é importante se prevenir contra eventuais trapaças que os jogadores possam tentar fazer.

Toda jogada é tratada integralmente no lado do servidor. Ele recebe um request, valida o jogador verificando sua sala, e valida se está na sua vez e também valida se a jogada em questão é possível.

O chat também é protegido por um mecanismo de criptografia onde o nome do canal no qual a comunicação de uma sala ocorre é randômico. É utilizada uma função criptograficamente segura de mão única para gerar um hash usando um segredo totalmente configurável por quem roda o sistema e o número da sala. Dessa forma, por mais que queira, um atacante não conseguirá infiltrar-se em conversas de maneira trivial.

## Dependências do Projeto (Bibliotecas)

As dependências do nosso projeto estão listadas no arquivo **package.json** e podem ser instaladas utilizando o comando **npm install** dentro do diretório **src**.
Cada biblioteca exerce um papel fundamental para o funcionamento do sistema.

 - body-parser - biblioteca que nos permite tratar requests em diversos formatos inclusive JSON, que é nativo do Javascript e é facilmente manipulado dentro da linguagem.
 - clusterws
 - clusterws-client-js
 - consign - middleware que indica ao sistema pastas das quais ele deve observar os arquivos.
 - ejs - engine de views que permite passagem de dados dinâmicos
 - express - framework para criação de aplicações web, utilizada em toda configuração do servidor presente nos processos.
 - express-validator - faz validação no lado do servidor
 - mongodb - biblioteca nativa para execução de comandos em bancos de dados MongoDB.

## Rodando o Projeto

 1. Dê clone no projeto;
 2. Dentro do diretório src, execute o comando **npm install** para instalar as dependências mencionadas acima
 3. Com as dependências instaladas, execute o comando **node app.js**
