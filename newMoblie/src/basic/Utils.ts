let Utils = {
	
	/**
     * put "," in the coins number
     * @param coins
     * @returns {string}
     */
    formatCoinsNumber: function (coins) {
        let coinsNumStr = coins + "", result = "", suffix = "";
        if (coinsNumStr.indexOf(".")>0) {
            suffix = coinsNumStr.substring(coinsNumStr.indexOf("."), coinsNumStr.length);
            coinsNumStr = coinsNumStr.substring(0, coinsNumStr.indexOf("."));
        }
        for (let i=coinsNumStr.length, j=1; i>0; i--, j++) {
            result = (j%3===0?",":"").concat(coinsNumStr.charAt(i-1)) + result;
        }

        return result.substring(result.charAt(0) === ","?1:0) + suffix;
    },

    /**
	 * transfer first word to Upper
	 */
	toFirstUpperCase: function(str: string): string {
        return str.substring(0, 1).toUpperCase() + str.substring(1, str.length).toLowerCase();
	},

	/**
     * transform the format of seconds to 'HH:mm:ss'.
     * example, call <b>Utils.secondToHour(8011)</b>, result is <b>02:13:31</b>
     * @param second
     * @returns {string}
     */
    secondToHour: function(second) {
        let h = Math.floor(second / 3600),
            m = Math.floor(second % 3600 / 60),
            s = Math.floor(second % 60);

        return (h<10?"0":"") + h + ":" + (m<10?"0":"") + m + ":" + (s<10?"0":"") + s;
    },

    /**
     * return how many seconds over the day
     */
    secondsOverDay: function () {
        let now = new Date();
        return {
            D: 0,
            H: 23 - now.getHours(),
            M: 59 - now.getMinutes(),
            S: 59 - now.getSeconds()
        };
    },

    /**
     * return how many seconds over the week
     */
    secondsOverWeekend: function () {
        let now = new Date();
        return {
            D: 7 - now.getDay(),
            H: 23 - now.getHours(),
            M: 59 - now.getMinutes(),
            S: 59 - now.getSeconds()
        };
    },

    replaceAll: function(str: string, searchValue: string, replaceValue: string):string {
        return str.indexOf(searchValue)>-1 ? Utils.replaceAll(str.replace(searchValue, replaceValue), searchValue, replaceValue) : str;
    }
};