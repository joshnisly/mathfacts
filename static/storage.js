


function loadFromBrowser(sKey, oDefaultValue, iVersion)
{
    let sCachedData = window.localStorage.getItem(sKey);
    if (!sCachedData)
        return oDefaultValue;

    let oData = window.JSON.parse(sCachedData);
    if (oData.iVersion !== iVersion)
        return oDefaultValue;

    return oData.oData;
}

function saveToBrowser(sKey, oValue, iVersion)
{
    window.localStorage.setItem(sKey, window.JSON.stringify({
        oData: oValue,
        iVersion: iVersion
    }));
}