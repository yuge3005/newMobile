class SuperGoalLetterLayer extends egret.DisplayObjectContainer{

	private pachinkoLetters: Array<egret.Bitmap>;
	public playingLetterAnimation: boolean;

	public constructor() {
		super();

		this.pachinkoLetters = [];
		for( let i: number = 0; i < 9; i++ ){
            this.pachinkoLetters[i] = Com.addBitmapAt( this, BingoMachine.getAssetStr( "champion_letter_" + ( i + 1 ) ), 44 * i, 0 );
        }
	}

	public setPachinkoLetter( index: number ): void{
		for( let i: number = 0; i < 9; i++ ){
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

	public showPachinkoLetterAnimation( index: number ){
		let pachinkoStr: string = SuperGoal.supergoalString;
		this.playingLetterAnimation = true;

		let letterPaytable: egret.Bitmap = Com.addBitmapAt( this, BingoMachine.getAssetStr( "champion_paytable_" + pachinkoStr[index] ), 1000, 700 );
		letterPaytable.scaleX = letterPaytable.scaleY = 3;
        TweenerTool.tweenTo( letterPaytable, { x: 44 * 10, y: 0, scaleX: 1, scaleY: 1 }, 800, 0, MDS.removeSelf.bind( this, letterPaytable ) );

        for( let i: number = pachinkoStr.length - 1; i > index; i-- ){
            TweenerTool.tweenTo( this.pachinkoLetters[i], { alpha: 1 }, 0.01, ( pachinkoStr.length - 1 - i ) * 200 + 800, this.letterTurnYellow.bind( this, i, true ) );
            TweenerTool.tweenTo( this.pachinkoLetters[i], { alpha: 1 }, 0.01, ( pachinkoStr.length - 1 - i ) * 200 + 1000, this.letterTurnYellow.bind( this, i, false ) );
        }

        TweenerTool.tweenTo( this, { alpha: this.alpha }, 1, ( pachinkoStr.length - index - 2 ) * 200 + 1000, this.setPlayingLetterEsendPlayRequest.bind(this, index) );
	}

	private letterTurnYellow( i: number, isYellow: boolean ): void{
        this.pachinkoLetters[i].filters = isYellow ? [ MatrixTool.colorMatrixPure( 0xFFFF00 ) ] : [];
    }

	private setPlayingLetterEsendPlayRequest( index: number ){
        this.playingLetterAnimation = false;
        this.letterTurnYellow( index, true );
    }
}