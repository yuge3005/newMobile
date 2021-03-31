class ConFirmBar extends egret.Sprite{
	public constructor( size: egret.Point ) {
		super();

		GraphicTool.drawRect( this, new egret.Rectangle( - size.x >> 1, -size.y >> 1, size.x + 100, size.y ), 0, false, 0.0 );
		this.touchEnabled = true;

		let barBg: egret.Bitmap = Com.addBitmapAt( this, "gameSettings_json.bg_popup", -610, -320 );
        barBg.scale9Grid = new egret.Rectangle( 60, 60, 911, 706 );
        barBg.width = 1110;
        barBg.height = 535;

		let title: TextLabel = Com.addLabelAt( this, 100-610, 75-320, 910, 72, 72, false, true );
        title.text = MuLang.getText( "change_language" );
        let tip: TextLabel = Com.addLabelAt( this, 100-610, 200-320, 910, 100, 48 );
        tip.setText( MuLang.getText( "change_language_tip" ) );
        let btn1: TouchDownButton = Com.addDownButtonAt( this, "gameSettings_json.OK", "gameSettings_json.OK", 125-610, 370-320, this.closeThisBar.bind(this), true );
        let btTx1: egret.TextField = Com.addTextAt( this, 0, 0, 20, 55, 55 );
        btTx1.fontFamily = "Righteous";
        btTx1.text = MuLang.getText( "cancel" );
        btn1.setButtonText( btTx1 );
		let btn2: TouchDownButton = Com.addDownButtonAt( this, "gameSettings_json.OK", "gameSettings_json.OK", 5, 370-320, this.confirmChange.bind(this), true );
        let btTx2: egret.TextField = Com.addTextAt( this, 0, 0, 20, 55, 55 );
        btTx2.fontFamily = "Righteous";
		btTx2.text = MuLang.getText( "confirm" );
        btn2.setButtonText( btTx2 );
	}

    private closeThisBar(): void {
        if( this.parent ) this.parent.removeChild( this );
    }

	private confirmChange( event: egret.Event ){
		LanguageBar.confirmChange();
	}
}