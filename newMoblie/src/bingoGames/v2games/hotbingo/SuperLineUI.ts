class SuperLineUI extends egret.DisplayObjectContainer{

    private pointer: egret.Bitmap;
    private superLineCallback: Function;

	public constructor() {
		super();

		this.visible = false;
        let wheel: egret.Bitmap = Com.addBitmapAt( this,  "superLine_json.Wheel", 0, 0 );
        wheel.anchorOffsetX = 345;
        wheel.anchorOffsetY = 349;

        this.pointer = Com.addBitmapAt( this,  "superLine_json.Pointer", 0, 0 );
        this.pointer.anchorOffsetX = 46;
        this.pointer.anchorOffsetY = 162;
	}

	public playWheel( multiple: number, callback: Function ){
        this.visible = true;
        this.alpha = 0;
        this.pointer.rotation = 0;
        this.superLineCallback = callback;
        if( this.parent )this.parent.addChild( this );
        TweenerTool.tweenTo( this, { alpha: 1 }, 300, 1000, this.runWheel.bind(this,multiple) );
	}

    private runWheel(multiple: number){
        let an: number = Math.floor( multiple / 3 ) * 90;
        if( multiple == 25 ) an = 180;
        let randomAn: number = Math.random() * 60;
        an += 1080 + 295 + randomAn;
        TweenerTool.tweenTo( this.pointer, { rotation: an }, 2200, 0, this.hideWheel.bind(this), null, egret.Ease.circOut );
    }

    private hideWheel(){
        TweenerTool.tweenTo( this, { alpha: 0 }, 300, 0, this.superLineCallback );
    }

	public getLinePosition( checkingString: Array<string> ): egret.Point{
		let superLineCardIndex: number;
        let superLineLineIndex: number;
        for( let i: number = 0; i < checkingString.length; i++ ){
            superLineCardIndex = i;
            if( checkingString[i].substr( 0, 5 ) == "11111" ){
                superLineLineIndex = 0;
                break;
            }
            else if( checkingString[i].substr( 5, 5 ) == "11111" ){
                superLineLineIndex = 1;
                break;
            }
            else if( checkingString[i].substr( 10 ) == "11111" ){
                superLineLineIndex = 2;
                break;
            }
        }

		if( isNaN(superLineLineIndex) ) return null;
		return new egret.Point( superLineCardIndex, superLineLineIndex );
	}
}