class BingoDefaultSetting {
	public constructor() {
	}

	/**
	 * default settings of bingo games
	 */
	public static defaultSetting(): void{
		CardManager.cardDefaultSettings();
		PaytableUI.effectWithBg = null;
		PaytableUI.effectForMenton = null;
		PaytableUI.textBold = false;
		PaytableUI.textLeft = false;
		PaytableUI.focusColor = 0xFFFF88;
		CardGrid.winTimesOffset = new egret.Point;

		BallManager.textStroke = false;
		BingoGameToolbar.toolBarY = 900;

		BallManager.normalBallInterval = 100;
		BallManager.ballOffsetY = 0;

		BingoBackGroundSetting.defaultScale = true;
		PayTableManager.bingoPaytableName = "bingo";
	}
}