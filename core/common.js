class Common {
    static isset(object) {
		if((typeof object == "undefined") || (object == null))
			return null;
		return object;
	};

}

module.exports = Common;