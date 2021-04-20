class HalloweenSlotIconLayer extends SlotIconLayer{

	protected runningAnimations: Array<egret.MovieClip>;
	public maxIconNumber: number;

	public constructor() {
		super();

		this.x = LineManager.lineStartPoint.x;
		this.y = LineManager.lineStartPoint.y;
	}

	protected buildIcons(){
		this.icons = [];
		for( let i: number = 0; i < 15; i++ ){
			this.icons[i] = new HalloweenIcon( null );
			Com.addObjectAt( this, this.icons[i], 136 + i % 5 * 289, 256 * Math.floor( i / 5 ) + 135 );
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
			this.runningAnimations[i] = Com.addMovieClipAt( this, MDS.mcFactory, "turning", 4 + 289 * i, 3 );
			this.runningAnimations[i].scaleX = this.runningAnimations[i].scaleY = 2.0625;
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
		if( this.figlinhas.length != this.figuras.length ) throw new Error( "Server data Error: figlinhas" );

		if( this.blinkIcons ) this.clearBlinkIcons();
		this.blinkIcons = [];
		if( !this.blinkIconsLayer ) this.blinkIconsLayer = new egret.DisplayObjectContainer;
		this.addChild( this.blinkIconsLayer );

		let pts: Object = LineManager.linesDictionary;
		this.maxIconNumber = 0;
		for( let i: number = 0; i < this.figlinhas.length; i++ ){
			let ptIndex: number = this.figlinhas[i];
			let iconIdex: number = this.figuras[i];
			let line: LineUI = pts["p"+ptIndex];
			let tempBlinkArray: Array<number> = this.getSameIconInLine( line.lineRule, iconIdex );
			for( let j: number = 0; j < tempBlinkArray.length; j++ ){
				let slotIconNumberIndex: number = tempBlinkArray[j];
				let slotIcon: SlotIcon = this.icons[ slotIconNumberIndex ];
				if( !this.blinkIcons[tempBlinkArray[j]] ) this.blinkIcons[tempBlinkArray[j]] = this.buildBlinkIcon( iconIdex, slotIcon.x, slotIcon.y );
			}
			if( tempBlinkArray.length > this.maxIconNumber ) this.maxIconNumber = tempBlinkArray.length;
		}
	}

	private getSameIconInLine( ruleString: string, iconIdex: number ): Array<number>{
		let tempBlinkArray: Array<number> = [];
		for( let i: number = 0; i < ruleString.length; i++ ){
			let slotIconNumberIndex: number = parseInt( ruleString.charAt(i), 16 );
			let slotIcon: SlotIcon = this.icons[ slotIconNumberIndex ];
			if( slotIcon.iconIndex == iconIdex ) {
				tempBlinkArray.push( slotIconNumberIndex );
			}
			else{
				if( tempBlinkArray.length < 3 ){
					tempBlinkArray.length = 0;
					continue;
				}
				else break;
			}
		}
		return tempBlinkArray;
	}

	protected buildBlinkIcon( iconIndex: number, positionX: number, positionY: number ): egret.MovieClip{
		let mc: egret.MovieClip = Com.addMovieClipAt( this.blinkIconsLayer, MDS.mcFactory, "" + iconIndex, positionX - 128, positionY - 128 );
		mc.scaleX = 2;
		mc.scaleY = 2;
		return mc;
	}

	public stopRunning(){
		let maxIndex: number = this.runningAnimations.length;
		for( let i: number = 0; i < maxIndex; i++ ){
			egret.Tween.removeTweens( this.runningAnimations[i] );
			this.hideRunningAn( this.runningAnimations[i], i == maxIndex - 1 );
		}
	}
}