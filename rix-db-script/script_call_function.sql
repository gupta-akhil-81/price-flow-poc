SELECT call_api_function(
	P.CLASS_TYPE , 
	P.CLASS_UNIT_TYPE , 
	P.CLASS_UNIT_CODE , 
	P.ITEM_NO , 
	P.ITEM_TYPE , 
	P.UPD_DTIME , 
	P.INS_DTIME , 
	P.RETAIL_PRICE_TYPE , 
	P.CURRENCY_CODE , 
	P.VALID_FROM_DTIME , 
	P.VALID_TO_DTIME , 
	P.PRICE_INCL_TAX , 
	P.PRICE_EXCL_TAX , 
	P.REASON_CODE , 
	P.TAX_INCL_OVERRIDE )  
FROM CEM_RETAIL_ITEM_PRICE P WHERE item_no = '40368713' ;