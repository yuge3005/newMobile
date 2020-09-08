class BonusDataSetting {
	public constructor() {
	}

	public static getProgressData( bonusBalls: string ): Object {
		let bonusBallsArr: Array<string> = bonusBalls.split( ";" );
		let betProgress: Object = {};
		for( let i: number = 0; i < bonusBallsArr.length; i++ ){
			let tempAr: Array<string> = bonusBallsArr[i].split( "-" );
			if( tempAr.length == 2 ){
				let lettersAready: Array<string> = tempAr[1].split( "," );
				betProgress[tempAr[0]] = [];
				for( let j: number = 0; j < lettersAready.length; j++ ){
					betProgress[tempAr[0]][parseInt( lettersAready[j] )] = true;
				}
			}
		}
		return betProgress;
	}

	public static  getBonusRounds( bonusRounds: string ): Object {
		let bonusRoundArr: Array<string> = bonusRounds.split( ";" );
		let betBonusRounds: Object = {};
		for( let i: number = 0; i < bonusRoundArr.length; i++ ){
			let tempAr: Array<string> = bonusRoundArr[i].split( "-" );
			if( tempAr.length == 2 ){
				betBonusRounds[tempAr[0]] = parseInt( tempAr[1] );
			}
		}
		return betBonusRounds;
	}

	public static getLuckMultis( luckmultis: string ): Object{
		let luckmultiArr: Array<string> = luckmultis.split( ";" );
		let betLuckMultis: Object = {};
		for( let i: number = 0; i < luckmultiArr.length; i++ ){
			let tempAr: Array<string> = luckmultiArr[i].split( "-" );
			if( tempAr.length == 2 ){
				betLuckMultis[tempAr[0]] = parseInt( tempAr[1] );
			}
		}
		return betLuckMultis;
	}
}