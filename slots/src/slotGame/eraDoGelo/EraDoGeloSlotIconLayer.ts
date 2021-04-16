class EraDoGeloSlotIconLayer extends SlotIconLayer{

	protected runningAnimations: Array<egret.MovieClip>;
	
	private eraMcFactory: egret.MovieClipDataFactory;

	public constructor() {
		super();

		this.x = LineManager.lineStartPoint.x;
		this.y = LineManager.lineStartPoint.y;

		let data = RES.getRes( "eraDoGelo_icon_animation_json" );
		let tex = RES.getRes( "eraDoGelo_icon_animation_png" );
		this.eraMcFactory = new egret.MovieClipDataFactory( data, tex );
	}

	protected buildIcons(){
		this.icons = [];
		for( let i: number = 0; i < 15; i++ ){
			this.icons[i] = new EraDoGeloIcon( null );
			Com.addObjectAt( this, this.icons[i], 158 + i % 5 * 304, 272 * Math.floor( i / 5 ) + 131 );
		}
	}

	public showIcons( iconArray: Array<number> = null ){
		if( !this.icons ){
			this.buildIcons();
			this.buildRunningAn();
		}

		if( !iconArray ){
			for( let i: number = 0; i < 15; i++ ){
				this.icons[i].changeTexture( SlotMachine.getAssetStr( "" + Math.floor( Math.random() * 10 ) ), 0 );
			}
		}
		else{
			for( let i: number = 0; i < 15; i++ ){
				this.icons[i].changeTexture( SlotMachine.getAssetStr( "" + iconArray[i] ), iconArray[i] );
			}
		}
	}

	private buildRunningAn(){
		this.runningAnimations = [];
		for( let i: number = 0; i < 5; i++ ){
			this.runningAnimations[i] = Com.addMovieClipAt( this, MDS.mcFactory, "er_tunning", 12 + 305 * i, 7 );
			this.runningAnimations[i].stop();
			this.runningAnimations[i].visible = false;
		}
	}

	public startRunning( figuras: Array<number>, figlinhasPremiadas: Array<number>, figurasPremiadas: Array<number> ){
		super.startRunning( figuras, figlinhasPremiadas, figurasPremiadas );

		let maxIndex: number = this.runningAnimations.length;
		for( let i: number = 0; i < maxIndex; i++ ){
			this.runningAnimations[i].gotoAndPlay( Math.floor( Math.random() * maxIndex + 1 ) );
			this.runningAnimations[i].visible = true;

			TweenerTool.tweenTo( this.runningAnimations[i], { alpha: 1 }, 100, 500 * i + 1000, this.hideRunningAn.bind( this, this.runningAnimations[i], i == maxIndex - 1 ) );
		}
	}

	private hideRunningAn( mc: egret.MovieClip, isLast: boolean ){
		mc.stop();
		mc.visible = false;

		if( isLast ) this.showResult();
	}

	protected showBlinkIcons(){
		if( this.blinkIcons ) this.clearBlinkIcons();
		this.blinkIcons = [];
		if( !this.blinkIconsLayer ) this.blinkIconsLayer = new egret.DisplayObjectContainer;
		this.addChild( this.blinkIconsLayer );

		for( let i: number = 0; i < this.figuras.length; i++ ){
			let slotIconNumberIndex: number = this.figuras[i];
			let slotIcon: SlotIcon = this.icons[ slotIconNumberIndex ];
			let iconIdex: number = slotIcon.iconIndex;
			this.blinkIcons[i] = this.buildBlinkIcon( iconIdex, slotIcon.x, slotIcon.y );
			slotIcon.visible = false;
		}
	}

	protected buildBlinkIcon( iconIndex: number, positionX: number, positionY: number ): egret.MovieClip{
		let mc: egret.MovieClip = Com.addMovieClipAt( this.blinkIconsLayer, iconIndex < 10 ? this.eraMcFactory : MDS.mcFactory, "" + iconIndex, positionX - 135, positionY - 126 );
		mc.scaleX = 1.5;
		mc.scaleY = 1.5;
		return mc;
	}

	protected clearBlinkIcons(){
		super.clearBlinkIcons();

		for( let i: number = 0; i < this.icons.length; i++ ){
			if( !this.icons[i].visible ) this.icons[i].visible = true;
		}
	}

	public stopRunning(){
		let maxIndex: number = this.runningAnimations.length;
		for( let i: number = 0; i < maxIndex; i++ ){
			egret.Tween.removeTweens( this.runningAnimations[i] );
			this.hideRunningAn( this.runningAnimations[i], i == maxIndex - 1 );
		}
	}
}