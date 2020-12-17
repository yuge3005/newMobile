class PachinkoLetterLayer extends egret.DisplayObjectContainer{

	private pachinkoLetters: Array<egret.Bitmap>;

	public constructor() {
		super();

		this.pachinkoLetters = [];
		for( let i: number = 0; i < 8; i++ ){
            this.pachinkoLetters[i] = Com.addBitmapAt( this, BingoMachine.getAssetStr( "pachinko_letter_" + ( i + 1 ) ), 29 * i + ( i > 4 ? -16 : 0 ), 0 );
        }
	}

	public setPachinkoLetter( index: number ): void{
        for( let i: number = 0; i < 8; i++ ){
            if( i < index )this.pachinkoLetters[i].filters = [MatrixTool.colorMatrixPure(0xFFFF00)];
            else if( i == index )this.pachinkoLetters[i].filters = [MatrixTool.colorMatrixPure(0xFF0000)];
            else this.pachinkoLetters[i].filters = [];
        }
    }

	public runPachinkoGetAllLetterAnimation( callback: Function ){
		this.pachinkoLetters[this.pachinkoLetters.length-1].filters = [MatrixTool.colorMatrixPure(0xFFFF00)];
        let scaleBig: number = 8.73684;
        let ptOld: egret.Point = new egret.Point( this.x, this.y );
        let ptNew: egret.Point = new egret.Point( 253, 354 );
        let tw: egret.Tween = egret.Tween.get( this );
        tw.to( { scaleX: scaleBig, scaleY: scaleBig, x: ptNew.x, y: ptNew.y }, 400 );
        tw.to( { scaleX: 1, scaleY: 1, x: ptOld.x, y: ptOld.y }, 400 );
        tw.to( { scaleX: scaleBig, scaleY: scaleBig, x: ptNew.x, y: ptNew.y }, 400 );
        tw.to( { scaleX: 1, scaleY: 1, x: ptOld.x, y: ptOld.y  }, 400 );
        tw.to( { scaleX: scaleBig, scaleY: scaleBig, x: ptNew.x, y: ptNew.y  }, 400 );
        tw.to( { scaleX: 1, scaleY: 1, x: ptOld.x, y: ptOld.y  }, 400 );
        tw.wait(100);
        tw.call( callback );
	}

	public showPachinkoLetterAnimation( i: number, needAnimation: boolean = false ){
        this.pachinkoLetters[i].filters = [MatrixTool.colorMatrixPure(0xFFFF00)];
        if( needAnimation ){
            let originX: number = this.pachinkoLetters[i].x;
            let zoomMaxX: number = originX - this.pachinkoLetters[i].width * 2;
            this.pachinkoLetters[i].scaleX = 5;
            this.pachinkoLetters[i].scaleY = 5;
            this.pachinkoLetters[i].x = zoomMaxX;
            let tw: egret.Tween = egret.Tween.get( this.pachinkoLetters[i] );
            tw.to( { scaleX: 1, scaleY: 1, x: originX }, 600 );
            tw.to( { scaleX: 5, scaleY: 5, x: zoomMaxX }, 300 );
            tw.to( { scaleX: 1, scaleY: 1, x: originX }, 600 );
            tw.to( { scaleX: 5, scaleY: 5, x: zoomMaxX }, 300 );
            tw.to( { scaleX: 1, scaleY: 1, x: originX }, 600 );
        }
	}
}