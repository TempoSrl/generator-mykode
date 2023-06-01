/*global define,MetaData */
/* template for derived application metadata */
(function(_,metaModel,localResource,Deferred,
		getDataUtils,logger,logType,getMeta,
		  getDataExt,/*{CType}*/ CType,securityExt,MetaXData,MetaData, jsDataQuery) {
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

		function Meta_XXData() {
			MetaXData.apply(this, ["xxTitle"]);
		}

		Meta_XXData.prototype = _.extend(
		new MetaXData(),
		{
			constructor: Meta_XXData,
			superClass: MetaXData.prototype,

			primaryKey: function(){
				return ["idxx"]; //idxx to be replaced with actual key
			},

			getNewRow: function (parentRow, dt, editType) {
				let def = Deferred("getNewRow-Meta_XXData");

				//dt.autoIncrement('idxx', { minimum: 990000 });

				return this.superClass.getNewRow(parentRow, dt, editType)
				.then(function (dtRow) {
					return def.resolve(dtRow);
				});
			},

			/**
			 *
			 * @param {DataTable} table
			 */
			setDefaults: function (table) {
				this.superClass.setDefaults(table);
			}

		});

		// Some AMD build optimizers like r.js check for condition patterns like the following:
		//noinspection JSUnresolvedVariable
		if (typeof define === 'function' && typeof define.amd === 'object' && define.amd) {
			// Expose lodash to the global object when an AMD loader is present to avoid
			// errors in cases where lodash is loaded by a script tag and not intended
			// as an AMD module. See http://requirejs.org/docs/errors.html#mismatch for
			// more details.
			root.Meta_XXData = Meta_XXData;

			// Define as an anonymous module so, through path mapping, it can be
			// referenced as the "underscore" module.
			//noinspection JSUnresolvedFunction
			define(function () {
				return Meta_XXData;
			});
		}
		// Check for `exports` after `define` in case a build optimizer adds an `exports` object.
		else if (freeExports && freeModule) {
			if (typeof root.appMeta !== "undefined") {
				root.appMeta.Meta_XXData = Meta_XXData;
			}
			else{
				if (moduleExports){ // Export for Node.js or RingoJS.
					(freeModule.exports = Meta_XXData).Meta_XXData = Meta_XXData;
				}
				else{ // Export for Narwhal or Rhino -require.
					freeExports.Meta_XXData = Meta_XXData;
				}
			}
		} else {
			// Export for a browser or Rhino.
			if (root.appMeta){
				root.appMeta.Meta_XXData = Meta_XXData;
			} else {
				root.Meta_XXData=Meta_XXData;
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
		(typeof appMeta === 'undefined') ? require('./MetaXData') : appMeta.MetaXData,
		(typeof appMeta === 'undefined') ? require('./../components/metadata/MetaData') : appMeta.MetaData,
		(typeof appMeta === 'undefined') ? require('./../components/metadata/jsDataQuery') : appMeta.jsDataQuery
	)
);
