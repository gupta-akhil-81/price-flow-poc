'use strict';

const express = require('express');
var bodyParser = require('body-parser');
require('body-parser-xml')(bodyParser);

var xml2jsonparser = require('xml2json');


const app = express();
app.enable('trust proxy');
app.use(express.json());
//app.use(express.urlencoded());
app.use(bodyParser.xml());

// Initialize datastore client
const {Datastore} = require('@google-cloud/datastore');
const datastore = new Datastore({namespace: 'com.ikea.datastore'});

app.post('/prices', async (req, res, next) => {

    var reqURL=req.method +' ' + req.url;
    var contentType=req.headers["content-type"];

    console.log('Start: '+reqURL + ' ContentType='+ contentType);
    
	try {
        let priceObj={};
        if(contentType.includes("xml")){
            
            priceObj= {
                itemNo: req.body.RetailItem.ItemNo[0],
                itemType: req.body.RetailItem.ItemType[0],
                storeClassType: req.body.RetailItem.ClassUnitKey[0].ClassType[0],
                storeCode: req.body.RetailItem.ClassUnitKey[0].ClassUnitCode[0],
                type: req.body.RetailItem.ClassUnitKey[0].ClassUnitType[0],
                currencyCode: req.body.RetailItem.RetailItemPriceList[0].RetailItemPrice[0].CurrencyCode[0],
                priceTaxInclusive: req.body.RetailItem.RetailItemPriceList[0].RetailItemPrice[0].PriceInclTax[0],
                priceTaxExclusive: req.body.RetailItem.RetailItemPriceList[0].RetailItemPrice[0].PriceExclTax[0],
                taxIncludedOverrideCode: req.body.RetailItem.RetailItemPriceList[0].RetailItemPrice[0].TaxIncludedOverrideCode[0],
                reasonCode: req.body.RetailItem.RetailItemPriceList[0].RetailItemPrice[0].ReasonCode[0],
                validFrom :  req.body.RetailItem.RetailItemPriceList[0].RetailItemPrice[0].ValidFromDateTime[0],
                validTo:  req.body.RetailItem.RetailItemPriceList[0].RetailItemPrice[0].ValidToDateTime[0],
                createdAt: req.body.RetailItem.RetailItemPriceList[0].RetailItemPrice[0].UpdateDateTime[0],
                updatedAt : req.body.RetailItem.RetailItemPriceList[0].RetailItemPrice[0].UpdateDateTime[0]
            }

        }else{
            priceObj=req.body;
        }

        console.log('priceObj=' + JSON.stringify(priceObj));
        
        const pricesKey = datastore.key('prices');
		const entity = {
				key: pricesKey,
				data : priceObj
		};
	    await datastore.save(entity);
	    console.log('Customer '+ pricesKey.id + ' created.');
	    res
	    .status(201)
	    .location(req.url + '/'+pricesKey.id)
	    .end();
		
	} catch (error) {
		next(error);
	}

    res
    .status(201)
    .end();

    console.log('End : '+reqURL);
});


//get price by item id
app.get('/prices', async (req, res, next) => {

    var reqURL=req.method +' ' + req.url;
    console.log('Start: '+reqURL);
    var itemNo=req.query.itemNo;

	try {
        let query = datastore.createQuery('prices').filter('itemNo' , itemNo);
	    const [results] = await datastore.runQuery(query);

	    res
	    .status(200)
	    .set('Content-Type', 'application/json')
	    .json(results)
	    .end();
	} catch (error) {
		next(error);
	}
    console.log('End : '+reqURL);
});



const PORT = process.env.PORT || 8080;
app.listen(process.env.PORT || 8080, () => {
  console.log(`App listening on port ${PORT}`);
});

module.exports = app;
