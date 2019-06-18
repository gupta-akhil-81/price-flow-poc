'use strict';

const express = require('express');
var bodyParser = require('body-parser');
var xml2jsonparser = require('xml2json');

const app = express();
app.enable('trust proxy');
app.use(express.json());
app.use(express.urlencoded());

// Initialize datastore client
const {Datastore} = require('@google-cloud/datastore');
const datastore = new Datastore({namespace: 'com.ikea.datastore'});

app.post('/prices', async (req, res, next) => {

    var reqURL=req.method +' ' + req.url;
    console.log('Start: '+reqURL);
  
	try {
		const pricesKey = datastore.key('prices');
		const entity = {
				key: pricesKey,
				data : req.body
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
    console.log('End : '+reqURL);
});


app.post('/prices-xml', async (req, res, next) => {

	var jsonData = JSON.parse(xml2jsonparser.toJson(req.body));
	// console.log("to json ->", JSON.stringify(jsonData));

	  var priceJSON={
		"itemNo": jsonData.RetailItem.ItemNo,
		"itemType": jsonData.RetailItem.ItemType,
		"storeClassType": jsonData.RetailItem.ClassUnitKey.ClassUnitType,
		"storeCode": jsonData.RetailItem.ClassUnitKey.ClassUnitCode,
		"type": jsonData.RetailItem.RetailItemPriceList.RetailItemPrice.RetailPriceType,
		"currencyCode": jsonData.RetailItem.RetailItemPriceList.RetailItemPrice.CurrencyCode,
		"priceTaxInclusive": jsonData.RetailItem.RetailItemPriceList.RetailItemPrice.PriceInclTax,
		"priceTaxExclusive": jsonData.RetailItem.RetailItemPriceList.RetailItemPrice.PriceExclTax,
		"taxIncludedOverrideCode": jsonData.RetailItem.RetailItemPriceList.RetailItemPrice.TaxIncludedOverrideCode,
		"reasonCode": jsonData.RetailItem.RetailItemPriceList.RetailItemPrice.ReasonCode,
		"validFrom": jsonData.RetailItem.RetailItemPriceList.RetailItemPrice.ValidFromDateTime,
		"validTo": jsonData.RetailItem.RetailItemPriceList.RetailItemPrice.ValidToDateTime,
		"createdAt": jsonData.RetailItem.RetailItemPriceList.RetailItemPrice.UpdateDateTime,
		"updatedAt": jsonData.RetailItem.RetailItemPriceList.RetailItemPrice.UpdateDateTime
	};

	//console.log(priceJSON);
	
	try {
		const pricesKey = datastore.key('prices');
		const entity = {
				key: pricesKey,
				data : priceJSON
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