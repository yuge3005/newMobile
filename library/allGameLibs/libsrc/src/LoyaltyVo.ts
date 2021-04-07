
class LoyaltyVo {
    private static loyaltyLevel: number;
    private static loyaltyPoint: number;
    private static loyaltyThisLevelBegin: number;
    private static loyaltyNextLevelBegin: number;
    private static loyaltyLevelBuffEndTime: number;
    private static loyaltyCalcF: number;
    private static loyaltyCalcPurchaseLt: number;
    private static isMissionRefresh: string;
    private static thisMonthPurchaseCount: number;
    private static missionScoreEasy: string;
    private static privileges: Array<Object>;
    private static dataAfterUpdate: any;

    private static loyaltyName: Array<string>;

    private static overplus: number;
    private static overplusTimer: egret.Timer;

    /**
     * init loyalty data
     */
    public static init(data: any): void {
        this.loyaltyLevel = Number(data["loyalty_level"]);
        this.loyaltyPoint = Number(data["loyalty_point"]);
        this.loyaltyThisLevelBegin = Number(data["loyalty_this_level_begin"]);
        this.loyaltyNextLevelBegin = Number(data["loyalty_next_level_begin"]);
        this.loyaltyLevelBuffEndTime = Number(data["loyalty_level_buff_end_time"]) || 0;
        this.loyaltyCalcF = Number(data["loyalty_calc_f"]) || 0;
        this.loyaltyCalcPurchaseLt = Number(data["loyalty_calc_purchase_lt"]) || 0;
        this.thisMonthPurchaseCount = Number(data["this_month_purchase_count"]) || 0;
        this.privileges = data["privileges"];
        this.isMissionRefresh = this.privileges[this.loyaltyLevel]["is_mission_refresh"];
        this.missionScoreEasy = this.privileges[this.loyaltyLevel]["mission_score_easy"] || "no";

        this.loyaltyName = ["pupils", "students", "bachelor", "teacher", "master", "doctor", "doctor_bingo"];

        this.dataAfterUpdate = data;
        this.checkBuffTime();
    }

    /**
     * update loyalty data
     */
    public static update(data: any): void {
        for (let key in data) {
            switch (key) {
                case "loyalty_level":
                    if (Number(data[key]) > this.loyaltyLevel) {
                        this.loyaltyLevel = data[key];

                        // Lobby.getInstance().updateGameListLoyaltyLevel(Number(data[key]));
                    }

                    // Lobby.getInstance().redPointCheck();
                    break;
                case "loyalty_point": this.loyaltyPoint = data[key]; break;
                case "loyalty_this_level_begin": this.loyaltyThisLevelBegin = data[key]; break;
                case "loyalty_next_level_begin": this.loyaltyNextLevelBegin = data[key]; break;
                case "loyalty_level_buff_end_time": this.loyaltyLevelBuffEndTime = data[key]; break;
                case "loyalty_calc_f": this.loyaltyCalcF = data[key];break;
                case "loyalty_calc_purchase_lt": this.loyaltyCalcPurchaseLt = data[key]; break;
                case "is_mission_refresh": this.isMissionRefresh = data[key]; break;
                case "mission_score_easy": this.missionScoreEasy = data["key"]; break;    
                case "this_month_purchase_count": this.thisMonthPurchaseCount = data[key];break;
                case "privileges": this.privileges = data[key]; break;
                case "time": break;//PlayerConfig.player("time", Number(data[key]));
            }
        }

        this.checkBuffTime();
    }

    /**
     * update data
     */
    public static updateData(data: any): void {
        this.dataAfterUpdate = data;

        if (data["loyalty_level"] && Number(data["loyalty_level"]) > this.loyaltyLevel) {
            // Trigger.insertModel(LoyaltyUpPopup);
        } else {
            this.update(data);
        }
    }

    /**
     * check buff time
     */
    private static checkBuffTime(): void {
        if (this.loyaltyLevelBuffEndTime > Math.floor(new Date().valueOf() / 1000)) {
            if (this.overplusTimer) {
                this.overplusTimer.stop();
                this.overplusTimer = null;
            }

            this.overplus = Math.floor((this.loyaltyLevelBuffEndTime - Math.floor(new Date().valueOf() / 1000)));
            this.overplusTimer = new egret.Timer(1000, this.overplus);
            this.overplusTimer.addEventListener(egret.TimerEvent.TIMER_COMPLETE, this.loyaltyBuffOver, this);
            this.overplusTimer.start();
		}
    }

    /**
     * loyalty buff over
     */
    private static loyaltyBuffOver(): void {
        this.loyaltyLevel -= 1;
        // Lobby.getInstance().updateGameListLoyaltyLevel(this.loyaltyLevel);
    }

    /**
     * get data
     */
    public static get data(): any {
        return {
            "loyalty_level": this.loyaltyLevel,
            "loyalty_point": this.loyaltyPoint,
            "loyalty_this_level_begin": this.loyaltyThisLevelBegin,
            "loyalty_next_level_begin": this.loyaltyNextLevelBegin,
            "loyalty_level_buff_end_time": this.loyaltyLevelBuffEndTime,
            "loyalty_calc_f": this.loyaltyCalcF,
            "loyalty_calc_purchase_lt": this.loyaltyCalcPurchaseLt,
            "is_mission_refresh": this.isMissionRefresh,
            "mission_score_easy": this.missionScoreEasy,
            "this_month_purchase_count": this.thisMonthPurchaseCount,
            "privileges": this.privileges
        };
    }

    /**
     * get name
     */
    public static get getLoyaltyName(): Array<string> {
        return this.loyaltyName;
    }

    /**
     * get data
     */
    public static get(key: string): any {
        return this[key] || null;
    }
}