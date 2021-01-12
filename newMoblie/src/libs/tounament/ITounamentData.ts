interface ITounamentData {
	totalDuration: number;
	duration: number;
	userCount: number;
	prize: number;
	normalPrize: number;
	goldPrize: number;
	prizes: Array<ITounamentPrize>;
	userList: Array<ITounamentUser>;
	winners: Array<ITounamentUser>;
}

interface ITounamentInitData extends ITounamentData {
	isGold: boolean;
	threshold: number;
	currentTreshold: number
	eligible: boolean;
	fromLevel: number;
	toLevel: number;
	gameIDs: Array<number>;
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