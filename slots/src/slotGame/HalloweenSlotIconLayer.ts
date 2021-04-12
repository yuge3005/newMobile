class HalloweenSlotIconLayer extends SlotIconLayer{

	protected runningAnimations: Array<egret.MovieClip>;

	public constructor() {
		super();

		this.x = LineManager.lineStartPoint.x;
		this.y = LineManager.lineStartPoint.y;
	}

	protected buildIcons(){
		this.icons = [];
		for( let i: number = 0; i < 15; i++ ){
			this.icons[i] = new HalloweenIcon( null );
			Com.addObjectAt( this, this.icons[i], 135 + i % 5 * 289, 256 * Math.floor( i / 5 ) + 135 );
		}
	}

	public showIcons( iconArray: Array<number> = null ){
		if( !this.icons ){
			this.buildIcons();
			this.buildRunningAn();
		}

		if( !iconArray ){
			for( let i: number = 0; i < 15; i++ ){
				this.icons[i].changeTexture( SlotMachine.getAssetStr( "" + Math.floor( Math.random() * 10 ) ) );
			}
		}
		else{
			for( let i: number = 0; i < 15; i++ ){
				this.icons[i].changeTexture( SlotMachine.getAssetStr( "" + iconArray[i] ) );
			}
		}
	}

	private buildRunningAn(){
		this.runningAnimations = [];
		for( let i: number = 0; i < 5; i++ ){
			this.runningAnimations[i] = Com.addMovieClipAt( this, MDS.mcFactory, "turning", 7 + 289 * i, 7 );
			this.runningAnimations[i].scaleX = this.runningAnimations[i].scaleY = 2;
			this.runningAnimations[i].stop();
			this.runningAnimations[i].visible = false;
		}
	}

	public startRunning( figuras: Array<number>, figlinhasPremiadas: Array<number>, figurasPremiadas: Array<number> ){
		for( let i: number = 0; i < 5; i++ ){
			this.runningAnimations[i].gotoAndPlay( Math.floor( Math.random() * 5 + 1 ) );
			this.runningAnimations[i].visible = true;

			TweenerTool.tweenTo( this.runningAnimations[i], { alpha: 1 }, 100, 500 * i + 1000, this.hideRunningAn.bind( this, this.runningAnimations[i], i == 4 ) );
		}

		this.showIcons( figuras );
	}

	private hideRunningAn( mc: egret.MovieClip, isLast: boolean ){
		mc.stop();
		mc.visible = false;

		if( isLast ) SlotMachine.endSlotRunning();
	}
}