class LoyaltyVo{
    public constructor(){

    }

    public static get( value: string ): number{
        if( value == "loyaltyLevel" ) return 6;
        return 0;
    }
}