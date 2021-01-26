class WaitingBar extends MultiCoverBars{

	public constructor() {
		super();
	}

	public existCard( betStep: number, amount: number ){
		//sub class override
	}

	public existCardIdle( betStep: number, amount: number ){
		//sub class override
	}

	public hideBottomBtns( amount: number = 0 ){
		//sub class override
	}

	public showCountDown( countDown: number ){
		//sub class override
	}

	public updateFreeCardCountText( freeCards: number ){
		//sub class override
	}

	public updateFreeCardAfterBuycard( freeCards: number ){
		//sub class override
	}
}