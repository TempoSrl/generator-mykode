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

			/**
			 *
			 * @param {DataRow} r
			 * @return promise({
			 * 				[string warningMsg],
			 * 				[string errMsg],
			 *				string errField,
			 *				string outCaption,
			 *			    {DataRow} row
			 * 			})
			 */
			isValid: function(r){
				// Implementation example
				//let def = appMeta.Deferred("isValid-Meta_XXData");
				//to signal errors:
				//def.resolve(this.createIsValidResult (errMessage, colname, outCaption, row));
				//to signal warnings
				//def.resolve(this.createIsValidResult (null, colname, outCaption, row, warningMessage));
				//to call the base class when every check made has passed
				//def.resolve(this.superClass.isValid(r));
				//return def.promise();

				return this.superClass.isValid(r);
			},

			getNewRow: function (parentRow, dt, editType) {
				let def = Deferred("getNewRow-Meta_XXData");

				/**
				 Possible autoincrement properties:
				 {string[]} [selector]
				 Array of column names of selector fields. The max() is evaluating filtering the values of those fields

				 {number[]} [selectorMask]
				 Array of bit mask to use for comparing selector. If present, only corresponding bits will be compared,
				   i.e. instead of sel=value it will be compared (sel & mask) = value

				 {string} [prefixField]
				 A field to use as prefix for the evaluated field

				 {string} [middleConst]
				 String literal to be appended to the prefix before the evaluated max

				 {number} [idLen=0]
				 for string id, the len of the evaluated max. It is not the overall size of the evaluated id, because a
				 prefix and a middle const might be present
				 If idLen = 0 and there is no prefix, the field is assumed to be a number, otherwise a 0 prefixed string-number

				 {boolean} [linearField=false]
				 Indicates that numbering does NOT depend on prefix value, I.e. is linear in every section of the calculated field

				 {number} [minimum=0]
				 Minimum temporary value for in-memory rows

				 {number} [isNumber=false]
				 true if this field is a number

				 **/
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
				// table.defaults({
				// 	"field1":value1,
				// 	"field2":value2,
				// 	"fieldN":"N"
				// });
				this.superClass.setDefaults(table);
			},

			/**
			 * @method describeColumns
			 * @public
			 * @description ASYNC
			 * Describes a listing type (captions, column order, formulas, column formats and so on)
			 * @param {DataTable} table
			 * @param {string} listType
			 * @returns {Promise<DataTable>}
			 */
			describeColumns: function (table, listType) {
				let def = Deferred("describeColumns");
				// if (listType==="default"){
				// 	for (colName in table.columns){
				// 		this.describeAColumn(table, colName,"",null,-1,null);
				// 	}
				// 	//this.describeAColumn(table, "nome campo","Intestazione", "formato", 1, 100);
				// }
				return def.resolve(table).promise();
			},

		});

		if (freeExports && freeModule) {
			if (typeof root.appMeta !== "undefined") {
				appMeta.addMeta('xx', new Meta_XXData());
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
				appMeta.addMeta('xx', new Meta_XXData());
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
