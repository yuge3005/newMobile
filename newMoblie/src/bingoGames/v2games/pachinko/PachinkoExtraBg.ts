class PachinkoExtraBg extends egret.DisplayObjectContainer{

	private cats: Array<egret.DisplayObjectContainer>;

	public constructor() {
		super();

		this.cats = [];
		for( let i: number = 0; i < 10; i++ ){
			this.cats[i] = new egret.DisplayObjectContainer;
			this.addChild( this.cats[i] );
			if( i < 8 ) this.cats[i].x = i * 71;
			else if( i < 10 ){
				this.cats[i].x = ( i - 4 ) * 71;
				this.cats[i].y = - 71;
			}
			Com.addBitmapAt( this.cats[i], BingoMachine.getAssetStr( "EB_next_bg" ), 0, 0 );
			Com.addTextAt( this.cats[i], 17, 42, 35, 25, 22 ).text = "" + (i+1);
		}
	}

	public setVisible( value: boolean ){
		if( this.visible == value ) return;
		this.visible = value;
		if( value ){
			this.showCats();
		}
	}

	private showCats(){
		for( let i: number = 0; i < 10; i++ ){
			this.cats[i].visible = false;
			TweenerTool.tweenTo( this, { alpha: 1 }, 1, i * 100, this.showCat.bind(this, this.cats[i]) );
		}
	}

	private showCat( cat: egret.DisplayObjectContainer ){
		cat.visible = true;
	}
}