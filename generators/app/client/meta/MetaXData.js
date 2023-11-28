/*global define,MetaData */
(function(_,metaModel,localResource,Deferred,
		getDataUtils,logger,logType,getMeta,
		  getDataExt,/*{CType}*/ CType,securityExt,MetaData,jsDataQuery) {
		/** Detect free variable `global` from Node.js. */
		let freeGlobal = typeof global === 'object' && global && global.Object === Object && global;
		/** Detect free variable `self`. */
		let freeSelf = typeof self === 'object' && self && self.Object === Object && self;
		/** Used as a reference to the global object. */
		let root = freeGlobal || freeSelf || Function('return this')();
		/** Detect free variable `exports`. */
		let freeExports = typeof exports === 'object' && exports && !exports.nodeType && exports;
		/** Detect free variable `module`. */
		let freeModule = freeExports && typeof module === 'object' && module && !module.nodeType && module;


		//noinspection JSUnresolvedVariable
		/** Detect free variable `global` from Node.js or Browserified code and use it as `root`. (thanks lodash)*/
		let moduleExports = freeModule && freeModule.exports === freeExports;

		function MetaXData() {
			MetaData.apply(this, arguments);
			// var di sicurezza notevoli
			this.q = jsDataQuery;
		}

		MetaXData.prototype = _.extend(
		new MetaData(),
		{
			constructor: MetaXData,
			superClass: MetaData.prototype,
			getNewRow: function (parentRow, dt) {
				let def = Deferred("getNewRow-MetaXData");
				let realParentObjectRow = parentRow ? parentRow.current : undefined;
				let objRow = dt.newRow({}, realParentObjectRow);
				// torno la dataRow creata
				return def.resolve(objRow.getRow());
			},

			/**
			 *
			 * @param {DataTable} dt
			 */
			setDefaults: function (dt) {
				let logUserClos = ['cu', 'lu'];
				let logTimeClos = ['ct', 'lt'];
				let numericColumnsType = ['Decimal','Int32','Int16','Int64','Double','Float','Single'];
				let objDefaults = {};
				_.forEach(dt.columns, (c) => {
					if (logUserClos.includes(c.name)){
						objDefaults[c.name] = this.security.sys('user');
					}

					if (logTimeClos.includes(c.name)) {
						objDefaults[c.name] = new Date();
					}

					if (dt.isKey(c.name)) {
						if (numericColumnsType.includes(c.ctype) && !dt.defaults()[c.name]) {
							objDefaults[c.name] = 0;
						}
						if (c.ctype === 'String' && (dt.defaults()[c.name] === undefined || dt.defaults()[c.name] === null)) {
							objDefaults[c.name] = '';
						}
						if (c.ctype === 'DateTime'){
							objDefaults[c.name] = new Date();
						}
					}
				});

				dt.defaults(objDefaults);
			}

		});

		// Some AMD build optimizers like r.js check for condition patterns like the following:
		//noinspection JSUnresolvedVariable
		if (typeof define === 'function' && typeof define.amd === 'object' && define.amd) {
			// Expose lodash to the global object when an AMD loader is present to avoid
			// errors in cases where lodash is loaded by a script tag and not intended
			// as an AMD module. See http://requirejs.org/docs/errors.html#mismatch for
			// more details.
			root.MetaXData = MetaXData;

			// Define as an anonymous module so, through path mapping, it can be
			// referenced as the "underscore" module.
			//noinspection JSUnresolvedFunction
			define(function () {
				return MetaXData;
			});
		}
		// Check for `exports` after `define` in case a build optimizer adds an `exports` object.
		else if (freeExports && freeModule) {
			if (typeof root.appMeta !== "undefined") {
				root.appMeta.MetaXData = MetaXData;
			}
			else{
				if (moduleExports){ // Export for Node.js or RingoJS.
					(freeModule.exports = MetaXData).MetaXData = MetaXData;
				}
				else{ // Export for Narwhal or Rhino -require.
					freeExports.MetaXData = MetaXData;
				}
			}
		} else {
			// Export for a browser or Rhino.
			if (root.appMeta){
				root.appMeta.MetaXData = MetaXData;
			} else {
				root.MetaXData=MetaXData;
			}
		}

	}(  (typeof _ === 'undefined') ? require('lodash') : _,
		(typeof appMeta === 'undefined') ? require('./../components/metadata/MetaModel').metaModel : appMeta.metaModel,
		(typeof appMeta === 'undefined') ? require('./../components/metadata/LocalResource').localResource : appMeta.LocalResource,
		(typeof appMeta === 'undefined') ? require('./../components/metadata/EventManager').Deferred : appMeta.Deferred,
		(typeof appMeta === 'undefined') ? require('./../components/metadata/GetDataUtils') : appMeta.getDataUtils,
		(typeof appMeta === 'undefined') ? require('./../components/metadata/Logger').logger : appMeta.logger,
		(typeof appMeta === 'undefined') ? require('./../components/metadata/Logger').logTypeEnum : appMeta.logTypeEnum,
		(typeof appMeta === 'undefined') ? undefined : appMeta.getMeta.bind(appMeta),
		(typeof appMeta === 'undefined') ? undefined : appMeta.getData,
		(typeof jsDataSet === 'undefined') ? require('./../components/metadata/jsDataSet').CType : jsDataSet.CType,
		(typeof appMeta === 'undefined') ? undefined : appMeta.security,
		(typeof appMeta === 'undefined') ? require('./../components/metadata/MetaData') : appMeta.MetaData,
		(typeof appMeta === 'undefined') ? require('./../components/metadata/jsDataQuery') : appMeta.jsDataQuery

	)
);
