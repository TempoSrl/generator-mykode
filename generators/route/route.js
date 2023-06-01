const express = require('express');
const q = require('./../../client/components/metadata/jsDataQuery');
const asyncHandler = require("express-async-handler");
const getDataUtils = require("./../../client/components/metadata/GetDataUtils");

async function xxx(req,res,next){
    let ctx = req.app.locals.context;
    let getDataInvoke = ctx.getDataInvoke;

    //let filter=  q.fromObject(getDataUtils.getJsObjectFromJson(req.body.filter));
    //let ds = getDataUtils.getJsDataSetFromJson(req.body.ds);

    try {
        let val = "myKode wonderful result";
        res.send(val);
    } catch (err) {
        res.status(410).send("Error " + err);
    }
}

let router = express.Router();
router.xxxmethod('/xxx', asyncHandler(xxx));

module.exports= router;
