class MultiPlayerBingoInfoBar extends MultyBingoInfoBar{
	
	public constructor() {
		super()

		let bg: egret.Bitmap = Com.addBitmapAt( this, MultiPlayerMachine.getAssetStr( "1" ), 0, 0 );
		this.addChildAt( bg, 0 );

		this.patternColor = 0xFFFFFF;
	}
	
	protected addFixText(){
		let levelTxt: egret.TextField = Com.addTextAt( this, 33, 103, 271, 28, 28 );
		levelTxt.textColor = 0x333333;
		levelTxt.text = MuLang.getText( "for_level" ) + PlayerConfig.player("score.level");

		let bingoTxt: egret.TextField = Com.addTextAt( this, 140, 40, 235, 50, 50 );
		bingoTxt.textColor = 0xBF7143;
		bingoTxt.text = "BINGOS";
		bingoTxt.bold = true;
		bingoTxt.scaleX = 0.7;

		this.bingoLeftTxt = Com.addTextAt( this, 33, 33, 111, 68, 68, false, true );
		this.bingoLeftTxt.textColor = 0x974500;

		this.winTxt = Com.addTextAt( this, 127, 161, 260, 40, 40 );
		this.winTxt.bold = true;
	}
}