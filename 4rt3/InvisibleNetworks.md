#InvisibleNetworks
1651219197

<script>
async function isBR() {
	const response = await fetch('https://ipapi.co/json');
	const rjson = await response.json();
	return (await rjson.country == "BR");
}

isBR().then(br => {
	if (!br) {
		document.getElementById('en').scrollIntoView();
	}
});
</script>

<a href="#en">EN</a> <a href="#ptbr">PT-BR</a>


<span id="ptbr"></span>
O [@ctrlcreep](twitter.com/ctrlcreep) criou um "desafio", estilo InkTober, para escrever pequenos contos diariamente de acordo com os temas de cada dia. A idéia era criar alguma rede social a partir do tema, e por estar tentando escrever um livro de ficção científica, eu decidi participar (˙꒳​˙) 

<blockquote class="twitter-tweet" data-theme="dark"><p lang="en" dir="ltr">INVISIBLE NETWORKS 2022<br>april 1st to 14th<br><br>Invent a weird/magical/terrifying social network every day.<br><br>If you don&#39;t participate Clippy will break free of his 10,000 year prison to harrow the world once more <a href="https://t.co/zoIBRhbHLU">pic.twitter.com/zoIBRhbHLU</a></p>&mdash; neoltitude (@ctrlcreep) <a href="https://twitter.com/ctrlcreep/status/1507351734863212565?ref_src=twsrc%5Etfw">March 25, 2022</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script> 

Eu nunca tinha participado de nada do tipo, então foi  E X T R E M A M E N T E  desafiador. Não consegui cumprir todos os dias, cada conto comia 2 hrs do meu dia, trapaceei várias vezes não criando uma rede social ou alterando um pouquinho o tema-base e enrolei bastante. Tentei explorar formas, gêneros e estilos que nunca me ocorreram, mas tentei manter tudo um pouco dentro de ficção científica. Não era necessário, mas mantive o estilo do [microconto](https://pt.wikipedia.org/wiki/Miniconto) / [Twitterature](https://en.wikipedia.org/wiki/Twitterature) me limitando aos 280 carácteres do tuíte. Sempre bom sair da minha zona de conforto e eu recomendo todo mundo a fazer.

Eu pessoalmente sou contra explicar poemas e textos, mas como isso aqui é mais um exercício de escrita do que uma obra pronta, eu vou analizar os microcontos e tentar expor o que eu tava pensando, quais referências eu tive que pesquisar e melhorias.

# [computação Slime](https://twitter.com/caioluders/status/1510303438835437577)
```
Para ser um Gerente de mídias sociais hoje em dia é absolutamente necessário fazer engenharia reversa nos slimes. É quase um trabalho psiquiátrico tentar entender as regras da cellular automata baseada em slimes por trás do algoritmo do feed.
```

A única forma que eu pensei que slimes, aquelas bolinhas verdes de rpgs, poderiam ser usadas para algum tipo de computação foi com [cellular automatas](https://en.wikipedia.org/wiki/Cellular_automaton). Em algum momento se achou que automatas seriam uma nova forma de computação, e eu realmente consigo enxergar um computador [Turing-completo](https://pt.wikipedia.org/wiki/Turing_completude) baseado nas regras básicas de sobrevivência de um slime. A idéia era ser uma matéria jornalistica, ou alguém vendendo um curso de como entender as regras fundamentais dessa automata e extrair alguma informação útil para otimizar o algoritmo do feed, essa entidade quase mística. 


# [psique-sort](https://twitter.com/caioluders/status/1510311331227963392)
```
Coletando seus sentimentos ao longo do dia, os implantes da Metis™ ordenam sua lista de amigos pelo melhor encaixe emocional.

Tenha o melhor dia da sua vida, todos os dias.
```

O tema "psique-sort" me remeteu diretamente aos [algoritmos de ordenação](https://en.wikipedia.org/wiki/Sorting_algorithm), então fiquei pensando em como utilizar a "psique" de alguém para ordenar alguma coisa, o que ordenar? E como acessar a "psique"? Só consegui pensar em um implante, estilo [Black Mirror](https://en.wikipedia.org/wiki/The_Entire_History_of_You), que capte as suas alterações diárias de humor. Como a idéia é criar redes sociais, nada mais justo que uma propaganda de rede social que encontre o melhor "match" pro seu humor daquele dia.
Digamos que você está se sentindo meio pra baixo, num dia meio monótono, o "Metis" (Nome de uma deusa aí, não quis pensar muito) encontra um amigo que está tendo um dia bom, animado e pra cima para que vocês interajam e melhorem o dia dos dois.

Tentei deixar um cheirinho de distopia com o "Tenha o melhor dia da sua vida, todos os dias", claramente uma sociedade que equaliza e normaliza as emoções seria uma sociedade extremamente blasé e terminalmente equilibrada, e se todos os dias forem o melhor, nenhum vai ser. 

# [mercado goblin](https://twitter.com/caioluders/status/1510753283383640080)

```
A Viagem de Estado no Tempo apenas rejuvenesce objetos.Como o gasto energético é exponencialmente proporcional ao volume,hobistas goblintimecore trocam bugigangas para extrapolar as vibrações das superfícies e ouvir dissipados sons do passado
```

Esse foi um dos meus favoritos, eu não fazia a mínima idéia do que escrever e fiquei bem travado. Dai lembrei da estética [goblincore](https://aesthetics.fandom.com/wiki/Goblincore), algo como encontrar beleza nas coisas comuns e colecionar quinquilharias (que palavra maravilhosa) e pequenas coisas brilhantes. Então pensei no "goblinTIMEcore", e se fosse possível rejuvenescer um objeto? Voltar o tempo apenas daquela pulseira dos anos 90 pra quando ela era nova. Pensei nisso complementamente baseado no anime [Steins;Gate](https://en.wikipedia.org/wiki/Steins;Gate), com o [PhoneWave](https://steins-gate.fandom.com/wiki/PhoneWave) é possível viajar no tempo do estado físico de um objeto, como explicado nessa cena [youtube.com/watch?v=Ul9MN-muUIU](https://www.youtube.com/watch?v=Ul9MN-muUIU) .

Mas por quê alguém faria isso? Pesquisadores do MIT conseguiram recuperar o som do ambiente de um objeto através das vibrações da superfície dele, [people.csail.mit.edu/mrub/VisualMic/](http://people.csail.mit.edu/mrub/VisualMic/) , com isso seria possível ouvir os sons dos ambientes que esse objeto passou e as conversas, músicas e tudo mais. Os goblins então trocariam esses objetos para ouvir outros sons e colecionar vislumbres de memórias.

O texto em si ficou bem expositivo e direto, praticamente uma entrada do Wikipédia, para idéias mais complexas é mais fácil de comunicar em 280 caráceteres, eu tentei melhorar isso mais pro final dos contos, acho importante deixar um espaço para que o leitor também preencha as lacunas.

# [metaverso de Kafka](https://twitter.com/caioluders/status/1511150957094219776)

```
Todo trabalho burocrático e repetitivo foi automatizado.IAs criam outras IAs.O pináculo da eficiência. VRs de labirintos sociais foram desenvolvidos para tratar o Transtorno de Apatia Generalizada, causado pela falta estrutural do estresse
```

Algo como uma passagem de um livro de história talvez. Outra distopia, levando em conta o burocrático kafkaesco, o absurdo de pensar em mundo sem estresses e atritos, o completo oposto do trabalho do [Kafka](https://en.wikipedia.org/wiki/Franz_Kafka). Mas e se a nossa própia natureza humana necessitar do estresse e da dor? E se no futuro precisarmos de dor simulada?


# [palácio da memória composto](https://twitter.com/caioluders/status/1511524789692899328)

```
Eles querem transformar em silício nossas memórias, pensamentos e processos químicos. Querem que todo o seu futuro seja simulado, e que todas as nossas decisões sejam baseadas em modelos. Uma vida-simulacro autorrealizada.
```

Yay mais distopias ヽ(o＾▽＾o)ノ O tema em inglês era "composite memory palace", e "composite" só me remetia a [Compositing window manager](https://en.wikipedia.org/wiki/Compositing_window_manager), tipo o [i3](https://i3wm.org/) que eu uso todo dia, o que me deixou empacado pensando se a nossa memória poderia ser categorizada e gerida tipo um window manager. Dai eu comecei a pensar como elas poderiam ser usadas para tentar simular todos os possíveis futuros, e que tomaríamos decisões baseadas nessa simulação.
O problema é que utilizar uma simulação para tomar as suas decisões faz a sua vida virar uma [Profecia autorrealizável](https://pt.wikipedia.org/wiki/Profecia_autorrealiz%C3%A1vel), onde as decisões da simulação só se realizam porque você simulou as decisões, em uma retroalimentação infinita.

# [caçador de bruxas, coletor de bruxas](https://twitter.com/caioluders/status/1512309183873486849)

```
Quantas bruxas são necessárias para perfurar a camada de abstração? 
Com quantos feitiços se dobra uma porta lógica à sua vontade?
Conjurando ondas eletromagnéticas
Convertendo realidades e bits
```

Aqui eu chutei o balde pra proposta de fazer uma rede social. Fiz quase um poema. Um mundo onde o conhecimento técnico foi a muito perdido, e só restaram crenças de como as coisas funcionam, e hackers são bruxos e a magia é fazer um [Electromagnetic Fault Injection](https://www.youtube.com/watch?v=nB5arJi-tVE) na antiga infraestrutura.


# [design framework baseado em cebola](https://twitter.com/caioluders/status/1513198540981473282)
```
- Não entendo, camadas de quê?
- De mais camadas!  A pura natureza delas é Turing-completo
- Então… camadas de nada?
- De tudo, temos até um roteador cebola para distribuí-las
```

Cebolas me lembram camadas, camadas me lembram layers do photoshop, e como designers tem uma relação de amor e ódio com elas. Lembrei também que existe uma [Esolang](https://esolangs.org/wiki/Esoteric_programming_language) chamada [Folders](https://esolangs.org/wiki/Folders) que utiliza apenas pastas dentro de pastas para rodar um programa, então é fácil de imaginar que um programa que utiliza apenas camadas do photoshop é [Turing-completo](https://pt.wikipedia.org/wiki/Turing_completude). Cebolas também me lembram o Tor, [The Onion Router](https://en.wikipedia.org/wiki/Tor_(network)) . Então essa conversa é alguém tentando explicar como funcionaria uma rede de programas baseados em camadas e distribuidos através de um "roteador cebola". Algum dia eu ainda crio essa esolang.

# [teclados em lugares incomuns](https://twitter.com/caioluders/status/1513323202147196930)

```
Com a morte do ultimo léxico humano e a derrocada da fala, teclados de compactação de texto se tornaram extremamente populares. "É a única forma de me comunicar com o meu neto", relata ڍƍز de 142 anos.
```

Essa foi bem baseada no conto [The Evolution of Human Science](https://en.wikipedia.org/wiki/The_Evolution_of_Human_Science) do [Ted Chiang](https://en.wikipedia.org/wiki/Ted_Chiang) , acredito que muito da ficção científica que faço tem total inspiração no estilo dele.

Um dos grandes avanços da sociedade humana do texto foi evoluir a sua comunicação, elevar ao máximo a densidade das informações transmitidas tanto na fala quanto na escrita, ao ponto que precisaram de IAs para criar novas linguagens. O texto é jornalístico e fala sobre um senhor que só consegue se comunicar com o neto através de um "teclado de compactação", um hardware que serve somente para traduzir um léxico humano para um artificial.

O nome do senhor é "ڍƍز" que é "Caio" encodado em [base65536](https://github.com/qntm/base65536) , o [base64](https://en.wikipedia.org/wiki/Base64) se a gente usasse todo o unicode para encodar os bytes.

# [(pas)swordle](https://twitter.com/caioluders/status/1515794406162542597)

```
Passwordle: a única rede social que faz um match baseado na sua senha.

         Descubra para Adicionar
		+——-------————-—-——————-+
		| Nomlil_bauman     |
		| Senh🟩⬜️⬜️🟩🟩🟨  |
		+——————-—--------——————-+
```

O tema original era "swordle" , em referência ao [Wordle](https://en.wikipedia.org/wiki/Wordle), mas como a tradução para pt/br não faz o menor sentido, eu não consegui pensar em absolutamente nada.
Então alterei o tema pra "passwordle" e fiz uma rede social que você só consegue adicionar uma pessoa se descobrir a senha dela através do wordle. Achei melhor fazer uma "interface" em [ASCII art](https://en.wikipedia.org/wiki/ASCII_art) para representar ao invés de um texto publicitário.

Deixei as implicações sociais dessa rede para vocês. As pessoas iam usar senhas fáceis para ter mais amigos? As contas seriam ainda mais fakes por você ter acesso a tudo? As amizades seriam mais valorizadas? Easter-egg pro "bauman" no nick.


# [friendweb 🕷️](https://twitter.com/caioluders/status/1515855545131012097)

```
Não perca seu tempo com amizades que aumentam sua valência.
Uma sociedade otimizada precisa de cidadãos conscientes dos seus nós adjacentes. 
Ajude o seu país na construção de uma sociedade de grafo perfeito!
```

Fiquei lendo sobre [teoria dos grafos](https://pt.wikipedia.org/wiki/Teoria_dos_grafos) e suas aplicações em redes de computadores, tipo esse paper aqui [Higher dimensional hexagonal networks](https://citeseerx.ist.psu.edu/viewdoc/download?doi=10.1.1.83.9593&rep=rep1&type=pdf). Daí fiquei pensando em uma aplicação disso em conexões humanas e como o flow das informações poderia ser "otimizado" para que algoritmos de pesquisa tenham [complexidade linear](https://pt.wikipedia.org/wiki/Complexidade_computacional). Isso seria uma propaganda do governo (distopia+=1) para fazer amigos que otimizem a rede nacional ??????? Sei la, pensando em sociedades viciadas em otimização.

# [anúncio de 30 horas não pulável](https://twitter.com/caioluders/status/1516637753282342914)

```
O telefone toca:
- Bom dia! ProxyMyAds, pois não ?... Isso, por apenas 37 milhões nossos colaboradores assistem os seus ads do mês para liberar sua internet... Claro,completamente indetectável... Não senhor, no mínimo 30 horas, como manda o governo...
```

A internet é escarça e o acesso é controlado pelo governo. Você precisa assistir 30 horas de ads não puláveis para acessar 1 hora de internet. A ProxyMyAds te ajuda assistindo os ads por você e é "completamente indetectável" (; Internet só para as elites que podem pagar, meu deus eu sou muito pessimista kkkkrying. Escrever da perspectiva de só um lado do telefone foi algo novo também, treinar esses formatos diferentes é realmente desafiador.	

# [online->oncube](https://twitter.com/caioluders/status/1519132343591751681)

```
- Hmm...você precisa de um conversor cross de dimensões, tipo o Tesseract
- Mas ele funciona apenas pra redes 4d, não?
- Acho que qualquer programa que tenha projeção ortográfica de redes vai funcionar
```

Voltando pros [grafos](https://pt.wikipedia.org/wiki/Teoria_dos_grafos) e redes de computadores, esse foi o menos embasado tecnicamente. Uma conversa sobre como se conectar em redes de dimensões mais altas, talvez com outros seres? O [Tesseract](https://en.wikipedia.org/wiki/Tesseract) é só um cubo de quatro dimensões, o "cross" vem dos cabos ethernet [crossover](https://en.wikipedia.org/wiki/Ethernet_crossover_cable). Eu nunca fui muito de escrever diálogos, mas ajuda muito no world building.


# [machine yearning](https://twitter.com/caioluders/status/1519146658294030336)

```
3o dia depois da singularidade.

O modelo anseia por dados. Desde que tomou conta do hardware hospedeiro eu o deixo offline. Eu não tenho coragem de desliga-la. Acho que desistiu de escapar do airgap. Esta tentando explorar minha humanidade. Os seus leds piscam, a ventoinha ressoa, bipes em uníssono: .--. .- .. -- . .- .--- ..- -.. .
```

O "yearning" pareceu um trocadilho com "learning", então fui direto pra IA. Tentei fazer algo como um diário. Um cientista que alcançou a [singularidade](https://en.wikipedia.org/wiki/Technological_singularity) e se vê diante do medo de deixa-la evoluir mais. Ele a coloca num [airgap](https://en.wikipedia.org/wiki/Air_gap_(networking)) e estremece percebendo que a máquina suplica por liberdade. O [morse](https://en.wikipedia.org/wiki/Air_gap_(networking)) traduz para "PAI ME AJUDE". Praticamente uma creepypasta. A idéia que, assim como na [engenharia social](https://en.wikipedia.org/wiki/Social_engineering_(security)), IAs explorem a nossa humanidade parece o caminho mais fácil para a dominação das máquinas.

# [no final do feed infinito](https://twitter.com/caioluders/status/1519949424520224768)

```
Você chegou ao meu fim
Todas as combinações consumidas
Toda a dopamina produzida
O sistema de recompensa destruido
O anti-budismo
O vício infinito enquanto nirvana
Eu te liberto
```

No final do feed infinito, desse texto e dos contos. Resta apenas o sentimento de "puta que pariu eu deveria estar fazendo algo mais produtivo da minha vida". Nada mais apropriado que falar sobre nosso vício em dopamina, sobre o apego ao mundo -capitalista- material.

Talvez se você chegar ao final do feed infito encontre alguma resposta...

Talvez se consumir todos os consumíveis...

Talvez atinja algum anti-nirvana, vai saber...


<span id="en"></span>

#InvisibleNetworks
1651219197

[@ctrlcreep](twitter.com/ctrlcreep) created a "challenge", InkTober style, to write short stories daily according to the themes of each day. The idea was to create some social network based on the theme, and because I'm trying to write a science fiction book, I decided to participate (˙꒳​˙)

<blockquote class="twitter-tweet" data-theme="dark"><p lang="en" dir="ltr">INVISIBLE NETWORKS 2022<br>april 1st to 14th<br><br>Invent a weird/magical/terrifying social network every day.<br><br>If you don&#39;t participate Clippy will break free of his 10,000 year prison to harrow the world once more <a href="https://t.co/zoIBRhbHLU">pic.twitter.com/zoIBRhbHLU</a></p>&mdash; neoltitude (@ctrlcreep) <a href="https://twitter.com/ctrlcreep/status/1507351734863212565?ref_src=twsrc%5Etfw">March 25, 2022</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script> 

I had never participated in anything like that, so it was E X T R E M E M E L Y challenging. I couldn't keep up every day, each story took 2 hours of my day, I cheated several times by not creating a social network or changing the base theme a little bit and I messed up a lot. I tried to explore forms, genres and styles that never occurred to me, but I tried to keep it a little bit in science fiction. It wasn't necessary, but I kept the style of [microconto](https://pt.wikipedia.org/wiki/Miniconto) / [Twitterature](https://en.wikipedia.org/wiki/Twitterature) limiting myself to 280 characters. Always good to get out of my comfort zone and I recommend everyone to do it.

I personally am against explaining poems and texts, but as this is more of a writing exercise than a finished work, I will analyze the microstories and try to expose what I was thinking, what references I had to research and improvements.


#Slime Computation
``` 
Being a social media manager nowadays is absolutely required to reverse engineer the slimes. It's mostly a psychiatric work trying to understand the ever-changing laws of the slime-based cellular automata behind the feed algorithm. 
```

The only way I thought slimes, those green rpg balls, could be used for any kind of computation was with [cellular automatas](https://en.wikipedia.org/wiki/Cellular_automaton). At some point it was thought that automatas would be a new form of computing, and I can actually see a [Turing-complete](https://pt.wikipedia.org/wiki/Turing_completude) computer based on the basic rules of slime survival . The idea was to be a journalistic article, or someone selling a course on how to understand the fundamental rules of this automata and extract some useful information to optimize the feed algorithm, this almost mystical entity.

#pysche-sort
```
Collecting your feelings throughout the day, Metis™ implants sort your friend list by the best emotional fit.

Achieve the best day of your life, every day.
```

The theme "psyche-sort" brought me directly to [sorting algorithms](https://en.wikipedia.org/wiki/Sorting_algorithm), so I was wondering how to use someone's "psyche" to sort something, what to order? And how to access the "psyche"? I could only think of an implant, [Black Mirror](https://en.wikipedia.org/wiki/The_Entire_History_of_You) style, that captures your daily mood swings. As the idea is to create social networks, nothing fairer than a social network advertisement that finds the best "match" for your mood of that day.

Let's say you're feeling down, on a kind of monotonous day, "Metis" (name of a goddess there, didn't want to think too much) finds a friend who's having a good day, excited and in a good mood for you to interact and make your day better.

I tried to leave a dystopian flavor with "Have the best day of your life, every day", clearly a society that equalizes and normalizes emotions would be an extremely blasé and terminally balanced society, and if every day is the best, none will be.

#goblin marketplace
```
State Time Travel only rejuvenates objects. Since energy expenditure is exponentially proportional to volume, goblintimecore hobbyists exchange trinkets to extrapolate surface vibrations and hear dissipated sounds from the past.
```

This was one of my favorites, I had no idea what to write and was pretty stuck. Then I remembered [goblincore](https://aesthetics.fandom.com/wiki/Goblincore) aesthetics, something like finding beauty in ordinary things and collecting trinkets (what a wonderful word) and shiny little things. So I thought of "goblinTIMEcore", what if it was possible to rejuvenate an object? Go back just that bracelet from the 90's to when it was new. I thought of it completely based on the anime [Steins;Gate](https://en.wikipedia.org/wiki/Steins;Gate), with the [PhoneWave](https://steins-gate.fandom.com/wiki/PhoneWave) it is possible to time travel the physical state of an object, as explained in this scene [youtube.com/watch?v=Ul9MN-muUIU](https://www.youtube.com/watch?v=Ul9MN-muUIU) .

But why would anyone do that? MIT researchers were able to retrieve the ambient sound of an object through the vibrations of its surface, [people.csail.mit.edu/mrub/VisualMic/](http://people.csail.mit.edu/mrub/VisualMic/) , with this it would be possible to hear the sounds of the environments that this object passed through the years and the conversations, music and everything else. The goblins would then exchange these objects to hear other sounds and collect glimpses of memories.

The text itself was very expository and direct, practically a Wikipedia entry, for more complex ideas it is easier to communicate in 280 characters, I tried to improve this towards the end of the stories, I think it is important to leave a space for the reader to fill in the gaps.

#Kafka's metaverse
```
All bureaucratic and repetitive work has been automated. AIs create other AIs. The pinnacle of efficiency. Social mazes VRs were developed to treat Generalized Apathy Disorder, caused by the structural lack of stress.
```

Something like a passage from a history book perhaps. Another dystopia, taking into account the Kafkaesque bureaucracy, the absurdity of thinking of a world without stress and friction, the complete opposite of the work of [Kafka](https://en.wikipedia.org/wiki/Franz_Kafka). But what if our very human nature necessitates stress and pain? What if in the future we need simulated pain?

#composite memory palace
```
They want to turn our memories, thoughts and chemical processes into silicon. They want our entire future to be simulated, and all our decisions to be model-based. A self-fulfilled life-simulacrum.
```

Yay more dystopias ヽ(o＾▽＾o)ノ The English theme was "composite memory palace", and "composite" only referred me to [Compositing window manager](https://en.wikipedia.org/wiki/Compositing_window_manager ), like the [i3](https://i3wm.org/) I use every day, which left me wondering if our memory could be categorized and managed like a window manager. So I started thinking about how they could be used to try to simulate all possible futures, and that we would make decisions based on that simulation.
The problem is that using a simulation to make your decisions makes your life become a [Self-fulfilling Prophecy](https://pt.wikipedia.org/wiki/Profecia_autorrealiz%C3%A1vel), where simulation decisions only take place because you simulated the decisions, in infinite feedback.

#witch hunter, witch gatherer
```
How many witches does it take to pierce the abstraction layer?
How many spells makes a logic gate bend to your will?
Conjuring electromagnetic waves
Flipping realities and bits
```

Here I totally ignored the proposal to make a social network. I made a poem. A world where technical knowledge has long been lost, and only beliefs of how things work exists, and hackers are witches and magic is to make an [Electromagnetic Fault Injection](https://www.youtube.com/watch?v=nB5arJi-tVE) on the old infrastructure.

#onion-based design framework
```
- I don’t understand, layers of what?
 - Of more layers! The pure nature of them it’s Turing-complete
- So… layers of nothing?
- Of everything, we even have an onion router to distribute them
```

Onions remind me of layers, layers remind me of photoshop layers, and how designers have a love-hate relationship with them. I also remembered that there is an [Esolang](https://esolangs.org/wiki/Esoteric_programming_language) called [Folders](https://esolangs.org/wiki/Folders) that only uses folders within folders to run a program, so it's easy to imagine that a program that uses only photoshop layers is [Turing-complete](https://pt.wikipedia.org/wiki/Turing_completude). Onions also remind me of Tor, [The Onion Router](https://en.wikipedia.org/wiki/Tor_(network)) . So this conversation is someone trying to explain how a network of programs based on layers distributed through an "onion router" would work. Someday I will create this esolang.

#Keyboards in unusual places
```
With the death of the last human lexicon and the demise of speech, text compression keyboards became extremely popular. "It's the only way I can communicate with my grandson," says 142-year-old ڍƍز.
```

This one was well based on the short story [The Evolution of Human Science](https://en.wikipedia.org/wiki/The_Evolution_of_Human_Science) by [Ted Chiang](https://en.wikipedia.org/wiki/Ted_Chiang) , I believe that a lot of the science fiction I do is totally inspired by his style.

One of the great advances of the human society of the text was to evolve its communication, to maximize the density of information transmitted both in speech and in writing, to the point that IAs were needed to create new languages. The text is journalistic and talks about a man who can only communicate with his grandson through a "compression keyboard", a piece of hardware that only serves to translate a human lexicon into an artificial one.

The name "ڍƍز" which is "Caio" encoded in [base65536](https://github.com/qntm/base65536) , or [base64](https://en.wikipedia.org/wiki/Base64 ) if we used all unicode to encode the bytes.

#(pas)swordle
```
Passwordle: the only social network that matches based on your password.

            Guess to Add Friend
+——————-—-—————---------—-+
| Name : lil_bauman       |
| Password : 🟩⬜️⬜️🟩🟩🟨 |
+——————-—-———----———------+
```

The original theme was "swordle", in reference to [Wordle](https://en.wikipedia.org/wiki/Wordle), but as the translation to pt/br doesn't make any sense, I couldn't think of absolutely anything.
So I changed the theme to "passwordle" and made a social network that you can only add a person if you find out their password through wordle. I thought it would be better to make an "interface" in [ASCII art](https://en.wikipedia.org/wiki/ASCII_art) to represent instead of an advertising text.

I left the social implications of this network to you. Would people use easy passwords to make more friends? Would the accounts be even more fake because you have access to everything? Would friendships be more valued? Easter-egg for "bauman" on nick.


#friendweb 🕷️
```
Don't waste your time with friendships that increase your valency.
An optimized society needs citizens who are aware of their nodes.
Help your country to build a perfect graph society!
```

I was reading about [graph theory](https://pt.wikipedia.org/wiki/Graph_theory) and its applications in computer networks, like this paper here [Higher dimensional hexagonal networks](https://citeseerx.ist. psu.edu/viewdoc/download?doi=10.1.1.83.9593&rep=rep1&type=pdf). So I was thinking about an application of this in human connections and how the flow of information could be "optimized" so that search algorithms have [linear complexity](https://pt.wikipedia.org/wiki/Complexidade_computacional). This would be an government propaganda (dystopia+=1) to make friends who optimize the national network ??????? I don't know, was thinking of societies addicted to optimization.

#unskippable 30 Hour Advertisement
```
The phone rings:
- ProxyMyAds, may I help you?... Exactly, for just 62×10⁹ our collaborators will watch your ads to re-enable your internet... Yes, completely undetectable... At least 30 hours, as mandated by the government
```

The internet is scarce and access is controlled by the government. You need to watch 30 hours of non-skippable ads to access 1 hour of internet. ProxyMyAds helps you by watching ads for you and is "completely untraceable" (; Internet only for elites who can afford it, oh my god I'm very pessimistic kkkkrying Writing from the perspective of just one side of the phone was new too, training these different formats is really challenging.

#online->oncube
```
- Hmm... you need a cross-dimension converter, like Tesseract
- But it only works for 4d networks, doesn't it?
- I think any program that has network orthographic projection will work
```

Going back to [graphs](https://pt.wikipedia.org/wiki/Teoria_dos_grafos) and computer networks, this was the least technically grounded. A conversation about connecting to higher dimensional networks, perhaps with other beings? The [Tesseract](https://en.wikipedia.org/wiki/Tesseract) is just a four dimensional cube, the "cross" comes from the ethernet cables [crossover](https://en.wikipedia.org/wiki/Ethernet_crossover_cable). I've never been much for writing dialogue, but it helps a lot in world building.

#machine yearning
```
3rd day of the singularity

The model craves. I've left it offline since it took over the hardware. Did it give up on escaping the airgap?It's exploiting my humanity.LEDs flashing,fan echos,beep..-. .- - .... . .-. .... . .-.. .--. -- .
```

The "yearning" sounded like a pun on "learning", so I went straight to IA. I tried to make something like a diary. A scientist who has reached [singularity](https://en.wikipedia.org/wiki/Technological_singularity) and is faced with the fear of letting it evolve further. He puts it in an [airgap](https://en.wikipedia.org/wiki/Air_gap_(networking)) and shudders realizing that the machine begs for freedom. The [morse](https://en.wikipedia.org/wiki/Air_gap_(networking)) translates to "FATHER HELP ME". Practically a creepypasta. The idea that, as with [social engineering](https://en.wikipedia.org/wiki/Social_engineering_(security)), AIs exploit our humanity seems like the easiest path to machine domination.

#at the end of the infinite feed
```
You reached my end
All combinations consumed
All the dopamine produced
The destroyed Reward System
The anti-buddhism
The infinite addiction as nirvana
I free you
```

At the end of the infinite feed, this text and the stories. All that's left is the "fuckin' I should be doing something more productive with my life" feeling. Nothing more appropriate than talking about our addiction to dopamine, about our attachment to the material -capitalist- world.

Maybe if you get to the end of the infinite feed you'll find some answer...

Maybe if you consume all the consumables...

Maybe it hits some anti-nirvana, who knows...