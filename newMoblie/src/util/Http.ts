class Http {
	private HttpInstance = class {
		private url: string;
		private type: string;
		private data: JSON;
		private async: boolean;
		private callback: Function;
		private xmlhttp:any;

		public constructor(url, type, data, async, callback) {
			this.url = url;
			this.type = type ? type : "GET";
			this.data = data;
			this.async = async;
			this.callback = callback;

			this.xmlhttp = window["XMLHttpRequest"] ? new XMLHttpRequest() : eval('new ActiveXObject("Microsoft.XMLHTTP")');
			this.xmlhttp.onreadystatechange = function() {
				if (this.xmlhttp.readyState===4 && this.xmlhttp.status===200){
					let data = this.xmlhttp.responseText;
					if (this.callback) this.callback(data);
				}
			}.bind(this);
			this.xmlhttp.open(this.type, url, this.async);
		}

		public setRequestHeader(key, value):void {
			this.xmlhttp.setRequestHeader(key, value);
		}

		public send() {
			this.xmlhttp.send(this.data);
		}
	};

	public constructor() {}

	public instance(url, type, data, async, callback): any {
		return new this.HttpInstance(url, type, data, async, callback);
	}
}