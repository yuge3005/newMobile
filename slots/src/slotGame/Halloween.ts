class Halloween extends SlotMachine{
		protected static get classAssetName(){
				return "halloween";
		}

		protected static get animationAssetName(){
				return "halloweenAnimation";
		}

		public constructor( assetsPath: string ) {
				super( "halloween.conf", assetsPath, 46 );

				LineManager.enabledCards = 20;
				LineManager.lineStartPoint = new egret.Point( 333, 124 );
				LineManager.linePicPositions = [395,181,618,0,145,101,98,281,76,55,124,55,64,7,96,112,335,33,242,159];
		}
}