# Eu fiz um editor de poemas chamado SAPE
1615439218

[lude.rs/SAPE/](https://lude.rs/SAPE/)

![Screenshot](https://i.imgur.com/EWA3UWD.png)


Completamente off-topic de segurança em geral, mas é sobre computação então vou postar aqui: eu codei um editor de poemas. Vou contar um pouco como foi codar isso, as idéias por trás e o futuro dele.

## Motivação
A idéia de ter um editor de poemas é meio antiga, na verdade eu já tinha feito um em 2017 em Electron e ficou uma bosta, Electron é uma bosta, ficou grande e pesado, embutir um chrome num programa só pra rodar uns html/css/js é uma péssima idéia. Então eu decidi refazer todo o código e adicionar mais funcionalidades.

A motivação principal foi pura preguiça, preguiça de contar a métrica de cada verso e preguiça de procurar rima em dicionário/Google. Essas foram as duas primeiras funcionalidades da primeira versão de 2017, mas tive algumas problemas. 

O primeiro problema foi COMO CARALHOS EU VOU CONTAR AS SÍLABAS ?!?!? É um problema super difícil que eu substimei, comecei tentando criar um algoritmo baseado em algumas regras gramaticais, mas além de porco, ficou errado, coisa de 60% de acerto. A língua portuguesa é linda e extremamente complexa, aqui em baixo tá a minha tentativa de função para contagem de sílabas poéticas, QUE CÓDIGO FEIO DA PORRA:

```javascript
function countSilabas(line) {
    var almost_done = line.replace(/[.,\/#$%\^&\*;:{}=\-_`~()]/g,"").split(" ") ; // remove pontuations, but not "!" that changes the metric
    var silabas_counter = 0 ; // main counter
    var list_consoantes =  Array.from("çbcdfghjklmnpqrstvwxyzBCDFGHJKLMNPQRSTVWXYZ") ; // almost forgot the "ç"
    var list_vogais = Array.from("aeiouAEIOUõã") ;
    var list_acentuadas = Array.from("àáâäåæèéêëæìíîïòóôöøùúûü");
    var f_v = false ; // flag to check if the last letter was a vogal
    var p_c = false ;
    console.log(almost_done) ;

    // holy shit that code is ugly , PLZ DO NOT READ IT , IT WILL MAKE YOUR EYES BURN !!!
    for (var i = 0 ; i <  almost_done.length; i++) { // word
      for (var y = 0; y < almost_done[i].length ;y++) { // letter
        if (list_acentuadas.indexOf(almost_done[i][y]) > -1) { // toda acentuada conta
          console.log("ac ->"+almost_done[i][y]) ;
          silabas_counter += 1 ;  
          f_v = false ; // it's a vogal, but a tonic one
        } else {
          if (list_vogais.indexOf(almost_done[i][y]) > -1) { // if vogal
            f_v = true;
            if (y == almost_done[i].length-1) { // check if last letter of word
              var tf = true ;
              for ( var k = 0 ; k < almost_done[i].length ; k++ ) {
                if (list_consoantes.indexOf(almost_done[i][k]) > -1 ) {
                  tf = false ;
                  break ;
                }
              }
              if ( tf && i != 0 ) { // if last letter is a vogal and isn't the first word
                if (list_vogais.indexOf(almost_done[i-1][almost_done[i].length-1]) > -1) { // if begin of the next word is a vogal
                  f_v = false ;
                  continue ; // goto
                }
              }
              console.log(almost_done[i][y]) ;
              silabas_counter += 1 ;
              f_v = false;
            }
            if (y == 0 && i != 0){
              if (list_vogais.indexOf(almost_done[i-1][almost_done[i-1].length-1]) > -1) {
                f_v = false ;
              }
            }
          } else {
            if ( (list_consoantes.indexOf(almost_done[i][y]) > -1) && f_v ){
                silabas_counter += 1 ;  
                f_v = false ;
                p_c = true ;
                console.log(almost_done[i][y]) ;
            }
          }
        }  
      }
    }
    if (silabas_counter >= 2 && (almost_done[almost_done.length-1][almost_done[almost_done.length-1].length-1] != '!') ) {
      silabas_counter -= 1 ; // BUG FIX
    }

    return silabas_counter ;
}
```

Tem comentários explicando porcamente as regras gramaticais, eu não tentei dividir as sílabas e só tentei contar a métrica, deu errado. 

O segundo problema foi a pesquisa de rimas, ou seja, as duas funcionalidades foram problemas kkkkkrying. Na minha cabeça o SAPE não deveria precisar de internet, pra ser mais acessível, dai eu tive a brilhante idéia de usar uma database local de palavras do [https://dicionario-aberto.net/](dicionario-aberto.net) junto com o programa, resultado? O executável ficou com 300mb, uns 200mb do SQLite e uns 100mb só da porra do Chrome do Electron.

## Aprendizados

* Primeiro aprendizado: Não usar Electron.
* Segundo aprendizado: Todo mundo que vai usar isso tem internet, bora usar a API do [https://dicionario-aberto.net/](dicionario-aberto.net) mesmo.
* Terceiro aprendizado: Não tentar resolver um problema absurdamente complexo que eu não tenho expertise. 


### Primeiro aprendizado
O que seria um bom substituto, nativo de prefêrencia, para o Electron? Tava usando o Binary Ninja e descobri que [o primeiro prototype](https://github.com/Vector35/deprecated-binaryninja-python) dele foi feito em [Qt](https://www.qt.io/) for Python, e é muito bonitinho. A versão comercial também foi feita em Qt, pelo o que entendi, mas com C++. Então decidi fazer a nova versão em Qt + Python usando o [Pyside2](https://pypi.org/project/PySide2/). O Qt é um framework que consegue unificar uma única API para todas as plataformas, além de ter bindings em Python o que facilita muito a minha vida.

### Segundo aprendizado
Database local realmente não foi uma boa ideia, uma simples requisição para uma API externa para pesquisar rimas não é tão ruim. Eu só não gosto de ter que depender de uma API de terceiro, talvez no futuro eu faça a minha própia.

### Terceiro aprendizado
Aqui que as coisas começam a ficar minimamente interessantes e menos noobice. Separação silábica e contagem de sílabas poéticas, apesar de parecidas, não são iguais. A forma como os sons interagem dentro do verso importa muito na métrica, e nem um pouco apenas para separar as sílabas de uma palavra. Apesar disso, imaginei que poderia usar como base as sílabas e apenas adicionar as regras que fossem necessárias, a separação foi o mais díficil naquela coisa horrível de cima. 

Pesquisando bastante tentando encontrar programas de separação silábica, acabei encontrando alguns promissores como o trabalho do Setfon [github.com/leleobhz/phonetica](https://github.com/leleobhz/phonetica) que tem uma série de ferramentas para análise de palavras/voz, mais notávelmente pro meu caso o ortosil [github.com/leleobhz/phonetica/blob/master/ortosil/ortosil_013.c](https://github.com/leleobhz/phonetica/blob/master/ortosil/ortosil_013.c), um trabalho pioneiro do Alexsandro Meireles para converter palavras para sua representação fonológica, algo do tipo "como essa palavra soa", o que parece interessante para os nossos fins.
Todas as soluções que encontrei vieram da academia, normalmente colaboração de Letras com Computação (duh). Imagino que seja porque um programa desse precisa de umas 300 regras pra funcionar.

Eu estava quase começando a portar o ortosil pra Python quando encontrei uma pesquisa mais recente chamada [Pɛtɾʊs (PhonEtic TRanscriber for User Support)](https://github.com/alessandrobokan/PETRUS) por favor leiam as referências. Isso praticamente solucionou todos os meus problemas, para conseguir fazer a representação fonética internacional (IPA) [pt.wikipedia.org/wiki/Alfabeto_fon%C3%A9tico_internacional](https://pt.wikipedia.org/wiki/Alfabeto_fon%C3%A9tico_internacional) ele precisa antes separar as sílabas!

Bem, implementei o PETRUS no SAPE e adicionei algumas regras para a contagem da métrica ficar coerente, apesar de ainda ter uns bugs. 

## Funcionalidades
Descrevendo rapidamente o que foi implementado no SAPE, até pra eu não me perder:

* Editor de texto
* Criar/Salvar arquivos
* Painel de configurações com persistência
* Escolha de fontes
* Busca de rimas
* Contagem de métrica

Precisei também fazer a distribuição para macOS/Windows/Linux, porque eu imagino que a maioria dos potenciais usuários não sejam de computação. Então usei o [Pyinstaller](https://www.pyinstaller.org/) para empacotar o programa, e todos os seus arquivos, em um executável. O processo foi bastante straight-forwarded e só precisei adicionar os arquivos adicionais manualmente na configuração, além de setar algumas flags, como não mostrar o console no Windows. Os executáveis ficaram em torno de ~40mb, um grande avanço.

## Futuro
Enquanto codava tive a idéia de que o editor poderia realçar as rimas do texto, estilo syntax highlight, isso seria muuuito útil. Porque agora, já munido da representação fonética, eu nem preciso ficar preso a rimas que tem grafia exatamente igual, teoricamente devo conseguir identificar rimas que possuem grafias diferentes. Apenas checando a representação do IPA o SAPE deveria ser capaz de encontrar sílabas foneticamente iguais. Ah! Um 1337zador de texto vai ficar de easter egg pro futuro tbm lol.

Acabou que a API de syntax highlight do Qt é meio bugada e estou tendo problemas para comparar as palavras com o IPA, então vou deixar essa funcionalidade para a próxima versão. Também vou deixar pra próxima versão o tema escuro do app, apesar de estar funcionando no Linux, não rolou no Windows/macOS e eu tô sem saco pra descobrir o por quê.

Eu tô bem satisfeito com o resultado de fazer um thick client e ver que na real não é tão difícil assim. Provavelmente vou voltar a escrever mais com a ajuda do SAPE e parar de escrever verso branco :p 
