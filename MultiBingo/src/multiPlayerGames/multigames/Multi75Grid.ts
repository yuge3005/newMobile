class Multi75Grid extends MultiPlayerGrid{

	protected blinkTextSizeMin: number;
	protected blinkTextSizeMax: number;
	
	protected _isCollected: boolean;
	public get isCollected(): boolean{
		if( this.gridNumber == 0 ) return true;
		return this._isCollected;
	}
	public set isCollected( value: boolean ){
		this._isCollected = value;
		if( this.blink ) this.blink = false;
	}

	protected _awardType: string;		
	public set awardType( value: string ){
		this._awardType = value;
		if( this.additionPic && this.contains( this.additionPic ) ) this.removeChild( this.additionPic );
		this.additionPic = this.getBitmapByAwardType( value );
		if( this.additionPic && this.additionPic.parent ){
			this.additionPic.x = this.defaultBgPic.width - this.additionPic.width >> 1;
			this.additionPic.y = this.defaultBgPic.height - this.additionPic.height >> 1;
			this.setChildIndex( this.additionPic, this.getChildIndex( this.numTxt ) );
		}
	}
	public get awardType(): string{
		return this._awardType;
	}
	protected additionPic: egret.Bitmap;

	public constructor() {
		super();
	}

	protected getBitmapByAwardType( awardType: string ): egret.Bitmap{
		return null;
	}
	
	public setCoinsAward( type: string ){
		this.awardType = type;
	}

	private _txtSize: number;
	protected set txtSize( value: number ){
		this._txtSize = value;
		this.numTxt.size = Math.round( value );
	}
	protected get txtSize(){
		return this._txtSize;
	}
	
	public onEffectBlink( currentCount: number ): void{
		if( this.currentBgPic == this.onEffBgPic ){
			if( currentCount & 1 ){
				TweenerTool.tweenTo( this, {txtSize: this.blinkTextSizeMin}, 231 );
			}
			else{
				TweenerTool.tweenTo( this, {txtSize: this.blinkTextSizeMax}, 231 );
			}
		}
		else{
			if( this.numTxt.size != CardGridColorAndSizeSettings.defaultNumberSize ) this.numTxt.size = CardGridColorAndSizeSettings.defaultNumberSize;
		}
	}

	public showEffect( isShow: boolean ){
		super.showEffect( isShow );
		if( this.gridNumber )this.touchEnabled = true;
	}

	public showRedEffect(){
		super.showRedEffect();
		this._isCollected = true;
		this.txtSize = CardGridColorAndSizeSettings.defaultNumberSize;

		if( this.additionPic && this.contains( this.additionPic ) ) this.removeChild( this.additionPic );
	}

	public clearCoinsAward(){
		this._awardType = null;
		if( this.additionPic && this.contains( this.additionPic ) ) this.removeChild( this.additionPic );
		if( this.zeroUI ){
			if( this.contains( this.zeroUI ) ) this.removeChild( this.zeroUI );
			this.zeroUI = null; 
		}
	}
}