class PipaAnimation extends egret.Sprite{

	private letterBg: egret.Bitmap;
	private assetName: string;

	private starParticle: particle.GravityParticleSystem;

	public constructor( assetName: string, fillRepeat: boolean = false ) {
		super();

		this.assetName = assetName;
		this.letterBg = Com.addBitmapAt( this, assetName + ".bg", 0, 240 );
		if( fillRepeat )this.letterBg.fillMode = egret.BitmapFillMode.REPEAT;
		this.letterBg.anchorOffsetY = this.letterBg.height >> 1;
		this.letterBg.scaleY = 0.01;
		this.letterBg.width = 755;
		this.letterBg.height = 120;

		this.addTween( this.letterBg, { "scaleY": 1 }, 250, 100, this.addTitle.bind(this), true );

		GraphicTool.drawRect( this, new egret.Rectangle( 0, 0, 755, 600 ), 0, false, 0.2 );
		this.touchEnabled = true;

		this.starParticle = new particle.GravityParticleSystem(RES.getRes("pipaParticle_png"), RES.getRes("pipaParticle_json"));
		Com.addObjectAt(this, this.starParticle, 0, 0);
		this.starParticle.start();

		this.addTween( this.starParticle, { "alpha": 0 }, 1000, 1500 );
	}

	private addTween( target: egret.DisplayObject, ob: Object, duration: number, delay: number = 0, callback: Function = null, inOut: boolean = false ): void{
		let tw: egret.Tween = egret.Tween.get( target );
		if( delay )tw.wait( delay );
		tw.to( ob, duration, inOut ? egret.Ease.circOut : egret.Ease.circIn );
		if( callback )tw.call( callback );
	}

	private addTitle(){
		let tittle: egret.Bitmap = Com.addBitmapAt( this, this.assetName + ".title_" + GlobelSettings.language, 800, 220 );

		this.addTween( tittle, { "x": 775 - tittle.width >> 1 }, 300, 100, this.titleLeave.bind(this, tittle), true );
	}

	private titleLeave( tittle: egret.Bitmap ){
		this.addTween( tittle, { "x": - tittle.width - 50 }, 300, 1500, this.bgLeave.bind(this), false );
	}

	private bgLeave(): void{
		this.addTween( this.letterBg, { "scaleY": 0.01 }, 250, 100, this.deleteSelf.bind(this), false );
	}

	private deleteSelf(): void{
		if( this.parent )this.parent.removeChild( this );
	}
}