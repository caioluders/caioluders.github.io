# Pequenas ligações, grandes vulnerabilidades: Uma breve introdução a deep links Android.

## Introdução

Esse artigo tem como objetivo introduzir as vulnerabilidades que ocorrem através de Intents no Android. Tentarei ser o mais introdutório possível e listarei todas as referências necessárias, caso algum conceito parecer muito avançado. Será utilizado o aplicativo [InjuredAndroid](https://github.com/B3nac/InjuredAndroid) como exemplo de aplicativo vulnerável. 54lv3 pros companheiros da @duphouse, sem eles esse texto não seria possível.

https://github.com/B3nac/InjuredAndroid

https://www.youtube.com/watch?v=4eso_7RyZ58
https://www.youtube.com/watch?v=WFUEbMFx2EQ

## Intents

Os [Intents](https://developer.android.com/guide/components/intents-filters) funcionam como a forma dos aplicativos se comunicarem internamente entre eles. Por exemplo, se um aplicativo quer abrir o [InjuredAndroid](https://github.com/B3nac/InjuredAndroid) ele pode iniciar um Intent utilizando a [URI](https://en.wikipedia.org/wiki/Uniform_Resource_Identifier) `flag13://rce`.

```java
Intent intent = new Intent();
intent.setData(Uri.parse("flag13://rce"));
startActivity(intent);
```

Além de aceitar todos os dados de uma [URI](https://en.wikipedia.org/wiki/Uniform_Resource_Identifier) ( scheme, host, path, query, fragment ), um Intent também pode levar dados [fortemente tipados](https://pt.wikipedia.org/wiki/Linguagem_tipada) através dos [Intent Extras](https://developer.android.com/reference/android/content/Intent#putExtra(java.lang.String,%20android.os.Bundle)). Na prática, queries e extras são as formas mais comuns de passar dados entre os aplicativos. Eles serão discutidos com exemplos mais adiante.


## Intents Filters

Como o Android sabe qual aplicativo é referente a `flag13://rce`? O InjuredAndroid define um [Intent Filter](https://developer.android.com/guide/components/intents-filters#Resolution) que diz quais tipos de Intent o Sistema Operacional deve enviar para ele.

O Intent Filter é definido no [AndroidManifest.xml](https://developer.android.com/guide/topics/manifest/manifest-intro). Vamos analizar a definição do Intent Filter relacionado a `flag13://rce` : https://github.com/B3nac/InjuredAndroid/blob/master/InjuredAndroid/app/src/main/AndroidManifest.xml

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

O `name` define de qual [Activity](https://developer.android.com/reference/android/app/Activity) estamos tratando, como ele começa com ponto, o nome é igual a `package`+`.RCEActivity` = `b3nac.injuredandroid.RCEActivity`.  


	- Como usar
	- Definições

## Análise estática

	- AndroidManifest.xml
	- Exported
 	- Browsable
 	- OnCreate

## Tipos vulnerabilidades

	- XSS
	- RCE
	- SQLi

## Conclusão

## Próximos passos