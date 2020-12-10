class MaraAnimationManager extends egret.DisplayObjectContainer{

	private lafayetteFactory: egret.MovieClipDataFactory;
	private redWineFactory: egret.MovieClipDataFactory;
	private changeModeFactory: egret.MovieClipDataFactory;
	private expFactory: egret.MovieClipDataFactory;
	private towerFactory: egret.MovieClipDataFactory;
	private fireworksFactory: egret.MovieClipDataFactory;

	private onecardPosition: egret.Point = new egret.Point( 158, 142 );

	private get oneCardMode(): boolean{
		return Mara.oneCardMode;
	}

	public constructor() {
		super();
	}

	private setScaleToNew( mc: egret.MovieClip, withBigCard: boolean = false ){
		mc.scaleX = 409 / 180;
		mc.scaleY = 393 / 175;
		if( withBigCard ){
			mc.scaleX *= 2.05;
			mc.scaleY *= 2.05;
		}
	}

	public playLafayette(){
		if( !this.lafayetteFactory ){
			let data = RES.getRes( "maraLafayette_json" );
			let tex = RES.getRes( "maraLafayette_png" );
			this.lafayetteFactory = new egret.MovieClipDataFactory( data, tex );
		}

		let mc: egret.MovieClip = Com.addMovieClipAt( this, this.lafayetteFactory, "lafayette", 970, 480 );
		mc.anchorOffsetX = mc.anchorOffsetY = 90;
		mc.play(1);
		this.setScaleToNew( mc );
		TweenerTool.tweenTo( mc, { alpha: 0 }, 300, 2500, MDS.removeSelf.bind( this, mc ) );
	}

	public playCamera( position: egret.Point, x: number, y: number ){
		let powerUpIcon: egret.Bitmap = Com.addBitmapAt( this, MultiPlayerMachine.getAssetStr( "painting" ), x, y );
		let xScale: number = 32/199;
		let yScale: number = 28/175;
		if( this.oneCardMode ){
			xScale *= 2;
			yScale *= 2;
			powerUpIcon.scaleX = powerUpIcon.scaleY = 2.05;
			position = position.subtract( this.onecardPosition );
			position = new egret.Point( position.x * 2.05, position.y * 2.05 );
			position = position.add( this.onecardPosition );
		}
		TweenerTool.tweenTo( powerUpIcon, { x: position.x, y: position.y, scaleX: xScale, scaleY: yScale }, 500, 0, MDS.removeSelf.bind( this, powerUpIcon ) );
		setTimeout( this.showPainting.bind(this), 500, position );
	}

	private showPainting( position: egret.Point ){
		let mc: egret.MovieClip = Com.addMovieClipAt( this, MDS.mcFactory, "paining", position.x, position.y );
		mc.play(1);
		if( this.oneCardMode ) mc.scaleX = mc.scaleY = 2.05;
		TweenerTool.tweenTo( mc, { alpha: 0 }, 300, 800, MDS.removeSelf.bind( this, mc ) );
	}

	public redWine( x: number, y: number ){
		if( !this.redWineFactory ){
			let data = RES.getRes( "maraRedWine_json" );
			let tex = RES.getRes( "maraRedWine_png" );
			this.redWineFactory = new egret.MovieClipDataFactory( data, tex );
		}

		let mc: egret.MovieClip = Com.addMovieClipAt( this, this.redWineFactory, "redWine", x, y );
		mc.play(1);
		this.setScaleToNew( mc, this.oneCardMode );
		TweenerTool.tweenTo( mc, { alpha: 0 }, 300, 2500, MDS.removeSelf.bind( this, mc ) );
	}

	public bread( x: number, y: number ){
		let mc: egret.MovieClip = Com.addMovieClipAt( this, MDS.mcFactory, "bread", x, y );
		mc.play(1);
		this.setScaleToNew( mc, this.oneCardMode );
		TweenerTool.tweenTo( mc, { alpha: 0 }, 300, 1200, MDS.removeSelf.bind( this, mc ) );
	}

	public jellyFish( num: number, x: number, y: number ){
		let cow: number = num % 6;
		let line: number = Math.floor( num / 6 );
		let pt: egret.Point = new egret.Point;
		pt.x = MultiPlayerCard.gridInitPosition.x + ( cow - 1 ) * MultiPlayerGrid.gridSpace.x;
		pt.y = MultiPlayerCard.gridInitPosition.y + ( line - 1 ) * MultiPlayerGrid.gridSpace.y;
		let mc: egret.MovieClip = Com.addMovieClipAt( this, MDS.mcFactory, "cheese", x + pt.x, y + pt.y );
		mc.play(1);
		if( this.oneCardMode ){
			mc.x += pt.x;
			mc.y += pt.y;
			mc.scaleX = mc.scaleY = 2.05;
		}
		TweenerTool.tweenTo( mc, { alpha: 0 }, 300, 1200, MDS.removeSelf.bind( this, mc ) );
	}

	public playMacaroon( effectName: string, x: number, y: number ){
		let mc: egret.MovieClip = Com.addMovieClipAt( this, MDS.mcFactory, effectName, x, y );
		mc.play(1);
		this.setScaleToNew( mc, this.oneCardMode );
		TweenerTool.tweenTo( mc, { alpha: 0 }, 300, 1200, MDS.removeSelf.bind( this, mc ) );
	}

	public playShark( startPosition: egret.Point, endPosition: egret.Point, x: number, y: number ){
		let mc: egret.MovieClip = Com.addMovieClipAt( this, MDS.mcFactory, "croissant", x, y );
		mc.play(1);
		this.setScaleToNew( mc, this.oneCardMode );
		TweenerTool.tweenTo( mc, { alpha: 1 }, 10, 1200, this.sharkBallMove.bind( this, mc, startPosition, endPosition ) );
	}

	private sharkBallMove( mc: egret.MovieClip, startPosition: egret.Point, endPosition: egret.Point ){
		TweenerTool.tweenTo( mc, { alpha: 0 }, 300, 0, MDS.removeSelf.bind( this, mc ) );
		let scale: number = 75 / 90;
		if( this.oneCardMode ){
			startPosition = startPosition.subtract( this.onecardPosition );
			startPosition = new egret.Point( startPosition.x * 2.05, startPosition.y * 2.05 );
			startPosition = startPosition.add( this.onecardPosition );
			endPosition = endPosition.subtract( this.onecardPosition );
			endPosition = new egret.Point( endPosition.x * 2.05, endPosition.y * 2.05 );
			endPosition = endPosition.add( this.onecardPosition );
			scale *= 2;
		}
		let ball: egret.Bitmap = Com.addBitmapAtMiddle( this, MultiPlayerMachine.getAssetStr( "02" ), startPosition.x, startPosition.y );
		ball.scaleX = ball.scaleY = scale;
		TweenerTool.tweenTo( ball, { x: endPosition.x, y: endPosition.y }, 300, 0, this.sharkOil.bind( this, ball, endPosition ) );
	}

	private sharkOil( ball: egret.Bitmap, endPosition: egret.Point ){
		TweenerTool.tweenTo( ball, { alpha: 0 }, 100, 0, MDS.removeSelf.bind( this, ball ) );
		let mc: egret.MovieClip = Com.addMovieClipAt( this, MDS.mcFactory, "croissant_oil", endPosition.x, endPosition.y );
		mc.play(1);
		if( this.oneCardMode ) mc.scaleX = mc.scaleY = 2.05;
		TweenerTool.tweenTo( mc, { alpha: 1 }, 300, 1200, MDS.removeSelf.bind( this, mc ) );
	}

	public playStar( x: number, y: number ){
		let mc: egret.MovieClip = Com.addMovieClipAt( this, MDS.mcFactory, "sandwich", x, y );
		mc.play(1);
		if( this.oneCardMode ) mc.scaleX = mc.scaleY = 2.05;
		TweenerTool.tweenTo( mc, { alpha: 0 }, 300, 3200, MDS.removeSelf.bind( this, mc ) );
	}

	public playPearlMain( pt: egret.Point, x: number, y: number ){
		if( this.oneCardMode ){
			pt = pt.subtract( this.onecardPosition );
			pt = new egret.Point( pt.x * 2.05, pt.y * 2.05 );
			pt = pt.add( this.onecardPosition );
		}
		let mc: egret.MovieClip = Com.addMovieClipAt( this, MDS.mcFactory, "perfume_bottle", pt.x, pt.y );
		mc.play(1);
		if( this.oneCardMode ) mc.scaleX = mc.scaleY = 2.05;
		TweenerTool.tweenTo( mc, { alpha: 0 }, 300, 1500, MDS.removeSelf.bind( this, mc ) );
		let mcBig: egret.MovieClip = Com.addMovieClipAt( this, MDS.mcFactory, "perfume", x, y );
		mcBig.play(1);
		if( this.oneCardMode ) mcBig.scaleX = mcBig.scaleY = 2.05;
		TweenerTool.tweenTo( mcBig, { alpha: 0 }, 300, 2200, MDS.removeSelf.bind( this, mcBig ) );
	}

	public playPearl( pt: egret.Point ){
		if( this.oneCardMode ){
			pt = pt.subtract( this.onecardPosition );
			pt = new egret.Point( pt.x * 2.05, pt.y * 2.05 );
			pt = pt.add( this.onecardPosition );
		}
		let mc: egret.MovieClip = Com.addMovieClipAt( this, MDS.mcFactory, "perfume_cap", pt.x, pt.y );
		mc.play(1);
		if( this.oneCardMode ) mc.scaleX = mc.scaleY = 2.05;
		TweenerTool.tweenTo( mc, { alpha: 0 }, 100, 700, MDS.removeSelf.bind( this, mc ) );
	}

	public roundOver(){
		let rs: egret.DisplayObjectContainer = new egret.DisplayObjectContainer;
		Com.addBitmapAt( rs, MultiPlayerMachine.getAssetStr("round"), 0, 0 );
		Com.addBitmapAtMiddle( rs, "mara_" + MuLang.language + "_json.round_over_tip", 448, 457 );
		Com.addObjectAt( this, rs, BingoBackGroundSetting.gameMask.width - rs.width >> 1, - rs.height );
		TweenerTool.tweenTo( rs, { y: BingoBackGroundSetting.gameMask.height - rs.height >> 1 }, 500, 0, this.roundStartHide.bind( this, rs ), null, egret.Ease.circOut );
	}

	private roundStartHide( rs: egret.DisplayObjectContainer ){
		TweenerTool.tweenTo( rs, { y: BingoBackGroundSetting.gameMask.width }, 500, 1500, MDS.removeSelf.bind( this, rs ), null, egret.Ease.circIn );
	}

	public changeModeAnimation(){
		if( !this.changeModeFactory ){
			let data = RES.getRes( "mara_change_mode_json" );
			let tex = RES.getRes( "mara_change_mode_png" );
			this.changeModeFactory = new egret.MovieClipDataFactory( data, tex );
		}
		let mc: egret.MovieClip = Com.addMovieClipAt( this, this.changeModeFactory, "mara_change_mode", 0, 0 );
		mc.scaleX = BingoBackGroundSetting.gameMask.width / 378;
		mc.scaleY = BingoBackGroundSetting.gameMask.height / 300;
		mc.play(1);
		TweenerTool.tweenTo( mc, { alpha: 0 }, 200, 1100, MDS.removeSelf.bind( this, mc ) );
	}

	public playGetMacaroon( type: string, x: number, y: number, num: number ){
		let mc: egret.MovieClip = Com.addMovieClipAt( this, MDS.mcFactory, type + "_macaroon_award", x, y );
		mc.play(1);
		this.setScaleToNew( mc, this.oneCardMode );
		TweenerTool.tweenTo( mc, { alpha: 0 }, 200, 1300, MDS.removeSelf.bind( this, mc ) );

		if( type == "white" ){
			setTimeout( this.getExp.bind(this), 1000, x, y );
			setTimeout( this.macaroonCoins.bind(this), 1000, "exp_big", num, 0x00FF00, x, y );
		}
		else if( type == "red" ){
			setTimeout( this.macaroonCoins.bind(this), 1000, "coin_big", num, 0xFFFF00, x, y );
		}
		else if( type == "green" ){
			setTimeout( this.macaroonCoins.bind(this), 1000, "dinero_big", num, 0x00FF00, x, y );
		}
	}

	private macaroonCoins( name: string, num: number, textColor: number, x: number, y: number ){
			let sp: egret.Sprite = new egret.Sprite;
			Com.addObjectAt( this, sp, x, y );
			Com.addBitmapAt( sp, MultiPlayerMachine.getAssetStr( name ), 70, 85 );
			let coinsNumTxt: egret.TextField = Com.addTextAt( sp, 35, 85, 200, 24, 18, true );
			coinsNumTxt.stroke = 1;
			coinsNumTxt.bold = true;
			coinsNumTxt.strokeColor = 0;
			coinsNumTxt.textColor = textColor;
			coinsNumTxt.verticalAlign = "middle";
			coinsNumTxt.text = "" + num;
			TweenerTool.tweenTo( sp, { y: sp.y + 100, alpha: 0 }, 1500, 0, MDS.removeSelf.bind( this, sp ), null, egret.Ease.backInOut );
	}

	private getExp( x: number, y: number ){
		if( !this.expFactory ){
			let data = RES.getRes( "macaroon_exp_json" );
			let tex = RES.getRes( "macaroon_exp_png" );
			this.expFactory = new egret.MovieClipDataFactory( data, tex );
		}
		let mc: egret.MovieClip = Com.addMovieClipAt( this, this.expFactory, "exp", 0, 0 );
		mc.play( 1 );
		TweenerTool.tweenTo( mc, { alpha: 0 }, 200, 1000, MDS.removeSelf.bind( this, mc ) );
	}

	public showSpecialBingo(){
		if( !this.towerFactory ){
			let data = RES.getRes( "mara_tower_json" );
			let tex = RES.getRes( "mara_tower_png" );
			this.towerFactory = new egret.MovieClipDataFactory( data, tex );
		}
		if( !this.fireworksFactory ){
			let data = RES.getRes( "mara_fireworks_json" );
			let tex = RES.getRes( "mara_fireworks_png" );
			this.fireworksFactory = new egret.MovieClipDataFactory( data, tex );
		}
		let fireworkBg: egret.Shape = new egret.Shape;
		Com.addObjectAt( this, fireworkBg, 0, 0 );
		GraphicTool.drawRect( fireworkBg, BingoBackGroundSetting.gameMask, 0x000F41, false, 0.4 );
		TweenerTool.tweenTo( fireworkBg, { alpha: 0 }, 200, 3300, MDS.removeSelf.bind( this, fireworkBg ) );
		let mc0: egret.MovieClip = Com.addMovieClipAt( this, this.towerFactory, "mara_fireworks1", 226, 0 );
		mc0.play( 1 );
		mc0.scaleX = mc0.scaleY = 2;
		TweenerTool.tweenTo( mc0, { alpha: 0 }, 200, 3300, MDS.removeSelf.bind( this, mc0 ) );
		let mc1: egret.MovieClip = Com.addMovieClipAt( this, this.fireworksFactory, "mara_fireworks1", 226, 0 );
		mc1.play( 1 );
		mc1.scaleX = mc1.scaleY = 2;
		TweenerTool.tweenTo( mc1, { alpha: 0 }, 200, 3300, MDS.removeSelf.bind( this, mc1 ) );
		let mc2: egret.MovieClip = Com.addMovieClipAt( this, this.fireworksFactory, "mara_fireworks2", 180, 106 );
		mc2.play( 1 );
		mc2.scaleX = mc2.scaleY = 2;
		TweenerTool.tweenTo( mc2, { alpha: 0 }, 200, 1500, MDS.removeSelf.bind( this, mc2 ) );
		let mc3: egret.MovieClip = Com.addMovieClipAt( this, this.fireworksFactory, "mara_fireworks3", 0, 0 );
		mc3.play( 1 );
		mc3.scaleX = BingoBackGroundSetting.gameMask.width / 755;
		mc3.scaleY = BingoBackGroundSetting.gameMask.height / 600;
		TweenerTool.tweenTo( mc3, { alpha: 0 }, 200, 3300, MDS.removeSelf.bind( this, mc3 ) );
		let mc4: egret.MovieClip = Com.addMovieClipAt( this, this.fireworksFactory, "mara_fireworks4", 0, 0 );
		mc4.play( 1 );
		mc4.scaleX = BingoBackGroundSetting.gameMask.width / 755;
		mc4.scaleY = BingoBackGroundSetting.gameMask.height / 600;
		TweenerTool.tweenTo( mc4, { alpha: 0 }, 200, 3300, MDS.removeSelf.bind( this, mc4 ) );
	}
}