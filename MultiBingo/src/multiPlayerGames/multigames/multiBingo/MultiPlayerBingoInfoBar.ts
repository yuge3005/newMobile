class MultiPlayerBingoInfoBar extends MultyBingoInfoBar{
	
	public constructor() {
		super()

		let bg: egret.Bitmap = Com.addBitmapAt( this, MultiPlayerMachine.getAssetStr( "1" ), 0, 0 );
		this.addChildAt( bg, 0 );

		this.patternColor = 0xFFFFFF;
	}
	
	protected addFixText(){
		let levelTxt: egret.TextField = Com.addTextAt( this, 8, 38, 114, 13, 13 );
		levelTxt.textColor = 0;
		levelTxt.text = MuLang.getText( "for_level" ) + PlayerConfig.player("score.level");

		let bingoTxt: egret.TextField = Com.addTextAt( this, 45, 12, 75, 18, 18, false, true );
		bingoTxt.textColor = 0xBF7143;
		bingoTxt.text = "BINGOS";

		super.addFixText();
	}
}