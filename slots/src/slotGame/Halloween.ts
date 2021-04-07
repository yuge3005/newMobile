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
		}
}