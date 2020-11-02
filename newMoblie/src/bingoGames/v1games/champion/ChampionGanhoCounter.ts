class ChampionGanhoCounter extends GanhoCounter{
	public constructor( winCallback: Function = null ) {
		super( winCallback );
	}
	
	protected countGanho( ganhoArray: Array<number>, i: number, ob: string, result: PaytableCheckResult ){
		let winTimesTxt: string = PayTableManager.payTablesDictionary[ob].ui["tx"].text;
		ganhoArray[i] += parseFloat( winTimesTxt.replace( /\D/, "" ) );
		if( ob == "letterTX" && result.fits.length == 2 && result.fits[0] ){
			trace( result );
			ganhoArray[i] += 10;
		}
	}
}