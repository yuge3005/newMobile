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
        let tw: egret.Tween = egret.Tween.get( this );
        tw.to( { scaleX: 4, scaleY: 4, x: -1200, y: -160 }, 400 );
        tw.to( { scaleX: 1, scaleY: 1, x: 0, y: 0  }, 400 );
        tw.to( { scaleX: 4, scaleY: 4, x: -1200, y: -160  }, 400 );
        tw.to( { scaleX: 1, scaleY: 1, x: 0, y: 0  }, 400 );
        tw.to( { scaleX: 4, scaleY: 4, x: -1200, y: -160  }, 400 );
        tw.to( { scaleX: 1, scaleY: 1, x: 0, y: 0  }, 400 );
        tw.to( { scaleX: 4, scaleY: 4, x: -1200, y: -160  }, 400 );
        tw.to( { scaleX: 1, scaleY: 1, x: 0, y: 0  }, 400 );
        tw.wait(100);
        tw.call( callback );
	}

	public showPachinkoLetterAnimation( i: number ){
        this.pachinkoLetters[i].filters = [MatrixTool.colorMatrixPure(0xFFFF00)];
        this.pachinkoLetters[i].scaleX = 5;
        this.pachinkoLetters[i].scaleY = 5;
        let tw: egret.Tween = egret.Tween.get( this.pachinkoLetters[i] );
        tw.to( { scaleX: 1, scaleY: 1 }, 1200 );
	}
}