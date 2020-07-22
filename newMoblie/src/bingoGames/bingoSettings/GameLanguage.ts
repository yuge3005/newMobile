class GameLanguage {

	public constructor() {
	}

	public static init(): void{
		if( !GameUIItem.languageText ) GameUIItem.languageText = {};
		else return;
		this.setWord( "bet", "BET", "APUESTA", "APOSTA" );
		this.setWord( "credit", "CREDIT", "CRÉDITO", "CRÉDITO" );
		this.setWord( "card", "CARD", "TARJETA", "CARTELA" );
		this.setWord( "select cards", "Select Cards.", "Seleccione Tarjeta.", "Selecione Cartões." );
		this.setWord( "pulse game", "Pulse Game.", "Juego de pulso.", "Pulse Jogue." );
		this.setWord( "good luck", "GOOD LUCK", "BUENA SUERTE", "BOA SORTE" );
		this.setWord( "extra ball", "EXTRA BALL ?", "BOLA EXTRA ?", "BOLA EXTRA ?" );
		this.setWord( "play extra", "Play Extra Ball", "Bola del juego extra", "Aperte Bola Extra" );
		this.setWord( "win", "WIN", "GANÕ", "GANHO" );
		// languageText["ball"] = { en: "BALL", es: "BOLA", pt: "BOLA" };
		this.setWord( "jackpot", "JACKPOT", "JACKPOT", "ACUMULADO" );
		this.setWord( "prize", "PRIZE", "PRÉMIO", "PRÉMIO" );
		this.setWord( "jackpot_tooltip", "Your current bet does not qualify\nPlease increase your bet to {1}\nand play {2} cards",
			"Su apuesta actual no cualifica.\nPor favor,aumente su apuesta\npara {1} y juega con {2} tarjetas.", 
			"Sua aposta atual não se qualifica.\nPor favor,aumente sua aporta\npara {1} e jogue com {2} cartas." );
	}

	private static setWord( key: string, en: string, es: string, pt: string ): void{
		GameUIItem.languageText[key] = { en: en, es: es, pt: pt };
	}

	public static languageTextForGameToolbar(): Object{
		let languageText = {};
		languageText["max bet"] = { en: "MAX BET", es: "APUESTA MAX", pt: "APOSTA MAX" };
        languageText["play"] = { en: "PLAY", es: "JUGAR", pt: "JOGAR" };
		languageText["stop"] = { en: "STOP", es: "PARAR", pt: "PARAR" };
        languageText["start auto"] = { en: "START AUTO", es: "INICIO AUTO", pt: "LIGAR AUTO" };
		languageText["collect"] = { en: "COLLECT", es: "RECOGER", pt: "COLETAR" };
		languageText["extra"] = { en: "EXTRA\nBALL", es: "PELOTA\nEXTRA", pt: "BOLA\nEXTRA" };
		languageText["stop auto"] = { en: "STOP AUTO", es: "DEJAR AUTO", pt: "PARAR AUTO" };

		languageText["win"] = { en: "WIN", es: "GANÕ", pt: "GANHO" };
		languageText["select card"] = { en: "Select Card", es: "Seleccionar Tarjetas", pt: "Selecione Cartelas" };
		languageText["press play"] = { en: "Press Play", es: "Pulse jugar", pt: "Tecle Jogar" };
		languageText["good luck"] = { en: "Good Luck", es: "Buena Suerte", pt: "Boa Sorte" };
		languageText["extra ball"] = { en: "Extra Ball", es: "Bola extra", pt: "Bola extra" };
		languageText["credits"] = { en: "credits", es: "créditos", pt: "créditos" };
		languageText["total bet"] = { en: "TOTAL\nBET", es: "APUETA\nTOTAL", pt: "APOSTA\nTOTAL" };
		languageText["card"] = { en: "CARD", es: "TARJETA", pt: "CARTELA" };

		languageText["free"] = { en: "FREE", es: "GRATIS", pt: "GRATIS" };

		languageText["press space"] = { en: "Press Space bar to Spin", es: "Presione barra espaciadora para jugar", pt: "Tecle Barra de Espaço para Jogar" };
		languageText["press X"] = { en: "Press Space for Extra Ball", es: "Presione espaciadora para Bola Extra", pt: "Tecle Espaço para Bola Extra" };
		languageText["press C"] = { en: "Press C for Credit", es: "Presione C para Crédito", pt: "Tecle C para Creditar" };

		languageText["saving"] = { en: "SAVINGS", es: "AHORRO", pt: "POUPANÇA" };
		languageText["board"] = { en: "Board", es: "Tablero", pt: "Tabuleiro" };
		languageText["mega"] = { en: "MEGA\nBALL", es: "MEGA\nBOLA", pt: "BOLA\nOSTENTAÇÃO" };
		languageText["mega ball"] = { en: "Mega Ball", es: "Mega Bola", pt: "Bola Ostentação" };

		return languageText;
	}
}