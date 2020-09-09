class BonusLuckMultiAnimation extends egret.DisplayObjectContainer{
	public constructor( luckMultiTimes: number ) {
		super();

		this.mask = new egret.Rectangle( -110, -50, 1035, 800 );
        let dtAnimation: egret.Sprite = new egret.Sprite;
        Com.addObjectAt( this, dtAnimation, 0, 140 );
        GraphicTool.drawRect( dtAnimation, new egret.Rectangle( -110, 0, 804, 320 ), 0, false, 0.5 );
        Com.addBitmapAt( dtAnimation, BingoMachine.getAssetStr( "doctor_multiplier" ), 250, 48 );
        let tx1: TextLabel = MDS.addGameTextCenterShadow( this, 50, 120, 30, 0xFFFFFF, "choose a card", false, 260, true, false );
        dtAnimation.addChild( tx1 );
        Com.addBitmapAt( dtAnimation, BingoMachine.getAssetStr( "txt_bg" ), -110, -40 );
        let tx2: egret.TextField = Com.addTextAt( dtAnimation, -40, 20, 100, 40, 40, false, true );
        tx2.textColor = 0xFEFE00;
        tx2.text = "X" + luckMultiTimes;
        let tx3: TextLabel = MDS.addGameTextCenterShadow( this, -110, -27, 36, 0x0, "win multiplier", false, 415, true, false );
        dtAnimation.addChild( tx3 );
        let tw: egret.Tween = egret.Tween.get( dtAnimation );
        tw.to( { y: 45 }, 600, egret.Ease.bounceOut );
	}
}