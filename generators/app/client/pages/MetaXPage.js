/* global appMeta,_ */
(function () {

	// Deriva da MetaPage
	const MetaPage = window.appMeta.MetaPage;
	const sec = appMeta.security;
	const metaModel = appMeta.metaModel;

	// Enumerato dei tipi di campi di cui controllare un formato specifico.
	// Utilizzato sulla validateRow()
	var EnumformatFields = {
		E_email: "email",
		E_ip: "ip"
	};


	/********** classe ausiliaria QueryHelper **********************/
	function QueryHelper() {
	}

	QueryHelper.prototype = {
		constructor: QueryHelper,

		/**
		 * @method getClausoleInFromRows
		 * @private
		 * @description ASYNC
		 * Return an array of value of field "field" on rows
		 * @param {ObjectRow[]} rows
		 * @param {string} field
		 * @returns [] an array of value
		 */
		getValuesOfFieldFromRows: function (rows, field) {
			return _.uniq(
				_.map(rows, function (r) {
					return r[field];
				}));
		},

		/**
		 * Returns true if the two dates are equal, false otherwise
		 * @param {Date} d1
		 * @param {Date} d2
		 * @returns {boolean}
		 */
		dateCompare: function (d1, d2) {
			let same = d1.getTime() === d2.getTime();
			return same;
		}
	};
	appMeta.QueryHelper = new QueryHelper();
	/******** fine classe statica ***********/


	/********** classea usiliaria QueryCreator **********************/
	function QueryCreator() {
	}

	QueryCreator.prototype = {
		constructor: QueryCreator,

		/**
		 *
		 */
		emptyDate: function () {
			return new Date(1000, 1, 1);
		}
	};
	appMeta.QueryCreator = new QueryCreator();

	/******** fine classe statica ***********/

	function MetaXPage() {
		MetaPage.apply(this, arguments);
		// oggetto con le var di sicurezza
		this.sec = sec;
		// var di sicurezza notevoli
		this.ayear = new Date(sec.sys("ayear"));
		this.esercizio = sec.sys("esercizio");

		// oggetto di helper per la costruzione di filtri tramite jsDataquery
		this.queryHelper = appMeta.QueryHelper;
		// oggetto jsDataQuery
		this.q = window.jsDataQuery;

	}

	MetaXPage.prototype = _.extend(
		new MetaPage(),
		{
			constructor: MetaXPage,
			superClass: MetaPage.prototype,

			/**
			 * @method getName
			 * @private
			 * @description SYNC
			 * To override. sets the name of the page
			 */
			getName: function () {
				return "MetaXPage " + ((this.name !== undefined) ? this.name : "");
			},


			/**
			 * Called once
			 * @returns {Deferred}
			 */
			afterLink: function () {
				return MetaPage.prototype.afterLink.call(this);
			},

			/**
			 * @method afterRowSelect
			 * @public
			 * @description
			 * Event fired after row selecting. To be eventually implemented in derived classes
			 * @param {DataTable} t
			 * @param {ObjectRow} r
			 * @returns Deferred
			 */
			afterRowSelect: function (t, r) {
				return appMeta.ResolvedDeferred(null, "afterRowSelect");
			},

			/**
			 * @method beforeRowSelect
			 * @public
			 * @description
			 * Event fired before row selecting. To be eventually implemented in derived classes
			 * @param {DataTable} t
			 * @param {ObjectRow} r
			 * @returns Deferred
			 */
			beforeRowSelect: function(t, r) {
				return appMeta.ResolvedDeferred(null, "beforeRowSelect");
			},

			/**
			 * Called after Data are extracted from page. Integrate data reading here if needed.
			 * @returns Deferred
			 */
			afterGetFormData: function () {
				return appMeta.ResolvedDeferred(null, "afterGetFormData");
			},

			/**
			 * Called before filling form with data. Fix tags here if needed
			 * @returns {*}
			 */
			beforeFill: function () {
				return appMeta.ResolvedDeferred(null, "beforeFill");
			},

			/**
			 * Called after filling form with data. Integrate filling here if needed.
			 * @returns {*}
			 */
			afterFill: function () {
				return appMeta.ResolvedDeferred(null, "afterFill");
			},

			afterClear: function () {
				return appMeta.ResolvedDeferred(null, "afterClear");
			},

		});

	appMeta.MetaXPage = MetaXPage;
	appMeta.EnumformatFields = EnumformatFields;
}());
