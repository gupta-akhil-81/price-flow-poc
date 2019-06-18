create or replace function call_api_function (
	CLASS_TYPE IN varchar2, 
	CLASS_UNIT_TYPE IN varchar2, 
	CLASS_UNIT_CODE IN varchar2, 
	ITEM_NO IN varchar2, 
	ITEM_TYPE IN varchar2, 
	UPD_DTIME IN varchar2, 
	INS_DTIME IN varchar2, 
	RETAIL_PRICE_TYPE IN varchar2, 
	CURRENCY_CODE IN varchar2, 
	VALID_FROM_DTIME IN varchar2, 
	VALID_TO_DTIME IN varchar2, 
	PRICE_INCL_TAX  IN varchar2, 
	PRICE_EXCL_TAX  IN varchar2, 
	REASON_CODE  IN varchar2, 
	TAX_INCL_OVERRIDE  IN varchar2
) 

RETURN varchar2
IS
  req utl_http.req;
  res utl_http.resp;
  url varchar2(4000) := 'http://prices-dot-ikea-customerintegrations-test.appspot.com/prices';
  name varchar2(4000);
  buffer varchar2(4000);
  payload varchar2(4000);
begin
  
  payload := 
    '{ "itemNo": "'             || ITEM_NO     ||  
    '", "itemType": "'          || ITEM_TYPE        ||
    '", "storeClassType": "'    || CLASS_TYPE        ||
    '", "storeCode": "'         || CLASS_UNIT_CODE        ||
    '", "type": "'              || RETAIL_PRICE_TYPE        ||
    '", "currencyCode": "'      || CURRENCY_CODE        ||
    '", "priceTaxInclusive": "' || PRICE_INCL_TAX        ||
    '", "priceTaxExclusive": "' || PRICE_EXCL_TAX        ||
    '", "taxIncludedOverrideCode": "' || TAX_INCL_OVERRIDE        ||
    '", "reasonCode": "'        || REASON_CODE        ||
    '", "validFrom": "'         || VALID_FROM_DTIME        ||
    '", "validTo": "'           || VALID_TO_DTIME        ||
    '", "createdAt": "'         || INS_DTIME        ||
    '", "updatedAt": "'         || UPD_DTIME        ||
    '" }' ;
    
  dbms_output.put_line(payload);
  
  
  req := utl_http.begin_request(url, 'POST',' HTTP/1.1');
  utl_http.set_header(req, 'user-agent', 'mozilla/4.0');
  utl_http.set_header(req, 'content-type', 'application/json');
  utl_http.set_header(req, 'content-length', length(payload));
  utl_http.write_text(req, payload);
  res := utl_http.get_response(req);
  begin
    loop
      utl_http.read_line(res, buffer);
      dbms_output.put_line(buffer);
    end loop;
    utl_http.end_response(res);
  exception
    when utl_http.end_of_body
    then
      utl_http.end_response(res);
  end;
  
  return 'inserted';
end ;