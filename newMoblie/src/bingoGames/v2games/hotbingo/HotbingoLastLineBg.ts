class HotbingoLastLineBg extends egret.DisplayObjectContainer{

	private arrows: Array<egret.Bitmap>;
	private currentArrowIndex: number;

	public constructor() {
		super();

		this.arrows = [];
		for( let i: number = 0; i < 19; i++ ){
			if( i < 9 ){
				Com.addBitmapAt( this, "superLine_json.Arrow1", i * 53, 0 );
				this.arrows[i] = Com.addBitmapAt( this, "superLine_json.Arrow2", i * 53, 0 );
			}
			else if( i == 9 ){
				Com.addBitmapAt( this, "superLine_json.Superline1_" + GlobelSettings.language, i * 53, 7 );
				this.arrows[i] = Com.addBitmapAt( this, "superLine_json.Superline2_" + GlobelSettings.language, i * 53, 7 );
			}
			else{
				Com.addBitmapAt( this, "superLine_json.Arrow1", i * 53 + 163, 0 );
				this.arrows[i] = Com.addBitmapAt( this, "superLine_json.Arrow2", i * 53 + 163, 0 );
			}
			this.arrows[i].visible = false;
		}

		this.currentArrowIndex = this.arrows.length;
		setTimeout( this.runArrow.bind( this ), 1000 );
	}

	private runArrow(){
		if( !this.stage ) return;
		if( this.currentArrowIndex < this.arrows.length )this.arrows[this.currentArrowIndex].visible = false;
		if( this.currentArrowIndex == 0 ){
			this.currentArrowIndex = this.arrows.length;
			setTimeout( this.runArrow.bind( this ), 1000 );
		}
		else{
			this.currentArrowIndex--
			setTimeout( this.runArrow.bind( this ), 200 );
			this.arrows[this.currentArrowIndex].visible = true;
		}
	}
}