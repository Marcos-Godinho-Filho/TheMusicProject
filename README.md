# The Music Project

O projeto consiste em um aplicativo de música que permite ao usuário cadastrar sua conta, bem como pesquisar por músicas / artistas e criar suas próprias playlists.

---

## Sobre o Projeto

* Para o desenvolvimento do projeto, utilizamos uma API disponibilizada pelo Deezer, que nos retorna informações como nome da música, do artista e do álbum, imagens de álbuns e do artista e uma preview de 30 segundos. 

* A obtenção e o retorno dos dados ocorre em dois arquivos: o server.js e o index-script.js. O primeiro funciona como um servidor, recebendo todas as informações da API do Deezer e retornando-as ao segundo arquivo, que faz requisições ao servidor e exibe tais retornos num arquivo html, que é a página de busca.

* As ferramentas utilizadas no desenvolvimento dessa página foram o Node.JS, um software de código aberto, multiplataforma, que permite a execução de códigos JavaScript fora de um navegador web, além do Axios, cliente HTTP baseado-em-promessas para o node.js e para o navegador, e o Express, um Framework rápido e um dos mais utilizados em conjunto com o Node.js.

* Outras páginas do website desenvolvido são a Home, que apresenta o site ao usuário com um slider de imagens, a página de Cadastro e de Login, a página de Perfil do usuário e a das Playlists.

* Para o cadastro do usuário, bem como das músicas e das playlists salvas pelo mesmo, utilizamos...