interface ITounamentData {
	totalDuration: number;
	duration: number;
	userCount: number;
	prize: number;
	normalPrize: number;
	goldPrize: number;
	fromLevel: number;
	toLevel: number;
	prizes: Array<ITounamentPrize>;
	gameIDs: Array<number>;
	userList: Array<ITounamentUser>;
	threshold: number;
	currentTreshold: number
	eligible: boolean;
	winners: Array<ITounamentUser>;
}

interface ITounamentPrize{
	fromRank: number;
	toRank: number;
	winningPrize: number;
	winGoldPrize: number;
}

interface ITounamentUser{
	uid: string;
	isWinning: boolean;
	loyaltyLevel: number;
	minEnter: number;
	coinsEarn: number;
	rank: number;
	winGoldPrize: number;
	networkLogins: Array<ITounamentNetwordLogins>;
	currentWinningPrize: number;
}

interface ITounamentNetwordLogins{
	id: string;
	pic: string;
	network: string;
}

interface ITounamentWinInfo{
	bonusId: number;
	rank: number;
 	currentWinningPrize: number;
	goldPrize: number;
}